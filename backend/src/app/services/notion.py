import logging
import httpx
from typing import List, Dict, Any, Optional
from uuid import UUID
from sqlmodel import Session, select
from app.schemas.models import Connector, Document, DocumentContent
from app.core.db import engine
from datetime import datetime

logger = logging.getLogger(__name__)

class NotionService:
    @staticmethod
    async def list_accessible_pages(token: str) -> List[Dict[str, Any]]:
        """
        List pages and databases the integration has access to.
        """
        url = "https://api.notion.com/v1/search"
        headers = {
            "Authorization": f"Bearer {token}",
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, headers=headers, json={"filter": {"property": "object", "value": "page"}})
                response.raise_for_status()
                data = response.json()
                pages = []
                for result in data.get("results", []):
                    title = "Untitled"
                    properties = result.get("properties", {})
                    # Notion page title property can be under different names but usually 'title' or 'Name'
                    title_prop = properties.get("title") or properties.get("Name")
                    if title_prop and title_prop.get("title"):
                        title = "".join([t.get("plain_text", "") for t in title_prop["title"]])
                    
                    pages.append({
                        "id": result["id"],
                        "title": title,
                        "url": result.get("url"),
                        "last_edited_time": result.get("last_edited_time")
                    })
                return pages
            except Exception as e:
                logger.error(f"Failed to list Notion pages: {e}")
                return []

    @staticmethod
    async def get_page_markdown(token: str, page_id: str) -> str:
        """
        Fetch page blocks and convert to a basic markdown representation.
        Note: For a full production implementation, we'd use a more robust block-to-markdown converter.
        """
        url = f"https://api.notion.com/v1/blocks/{page_id}/children"
        headers = {
            "Authorization": f"Bearer {token}",
            "Notion-Version": "2022-06-28"
        }
        markdown_blocks = []
        async with httpx.AsyncClient() as client:
            try:
                # Basic recursive block fetching could be added here for nested blocks
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                for block in data.get("results", []):
                    block_type = block.get("type")
                    if block_type in ["paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list_item", "numbered_list_item"]:
                        rich_text = block.get(block_type, {}).get("rich_text", [])
                        text = "".join([t.get("plain_text", "") for t in rich_text])
                        
                        if block_type == "heading_1":
                            markdown_blocks.append(f"# {text}")
                        elif block_type == "heading_2":
                            markdown_blocks.append(f"## {text}")
                        elif block_type == "heading_3":
                            markdown_blocks.append(f"### {text}")
                        elif block_type in ["bulleted_list_item", "numbered_list_item"]:
                            markdown_blocks.append(f"- {text}")
                        else:
                            markdown_blocks.append(text)
                
                return "\n\n".join(markdown_blocks)
            except Exception as e:
                logger.error(f"Failed to fetch Notion page content: {e}")
                return ""

    @classmethod
    async def sync_connector(cls, connector_id: UUID):
        """
        Perform a sync for a specific Notion connector.
        """
        with Session(engine) as session:
            connector = session.get(Connector, connector_id)
            if not connector or connector.type != "notion":
                return
            
            token = connector.config.get("token")
            selected_pages = connector.config.get("selected_pages", []) # List of page IDs
            
            if not token or not selected_pages:
                return

            for page_id in selected_pages:
                markdown = await cls.get_page_markdown(token, page_id)
                if not markdown:
                    continue
                
                # Check if document already exists for this page
                stmt = select(Document).where(
                    Document.connector_id == connector_id,
                    Document.external_id == page_id
                )
                existing_doc = session.exec(stmt).first()
                
                if existing_doc:
                    # Update existing
                    content_stmt = select(DocumentContent).where(DocumentContent.document_id == existing_doc.id)
                    content_record = session.exec(content_stmt).first()
                    if content_record:
                        content_record.markdown_content = markdown
                        session.add(content_record)
                    existing_doc.updated_at = datetime.utcnow()
                    session.add(existing_doc)
                else:
                    # Create new
                    # Get page title for name
                    pages = await cls.list_accessible_pages(token)
                    page_meta = next((p for p in pages if p["id"] == page_id), None)
                    name = page_meta["title"] if page_meta else f"Notion Page {page_id}"
                    
                    new_doc = Document(
                        name=name,
                        user_id=connector.user_id,
                        connector_id=connector_id,
                        external_id=page_id
                    )
                    session.add(new_doc)
                    session.flush() # Get ID
                    
                    new_content = DocumentContent(
                        document_id=new_doc.id,
                        markdown_content=markdown
                    )
                    session.add(new_content)
            
            connector.last_sync_at = datetime.utcnow()
            session.add(connector)
            session.commit()
