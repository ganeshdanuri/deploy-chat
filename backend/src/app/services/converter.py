import os
import tempfile
from markitdown import MarkItDown

def convert_to_markdown(file_content: bytes, file_name: str) -> str:
    """
    Converts document bytes to markdown content using MarkItDown.
    Supports .txt, .pdf, .ppt, .docx, .xlsx, etc.
    """
    markitdown = MarkItDown()
    
    # Create a temporary file to store the content because MarkItDown 
    # might expect a file path or handle
    suffix = os.path.splitext(file_name)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(file_content)
        tmp_path = tmp.name
    
    try:
        result = markitdown.convert(tmp_path)
        return result.text_content
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
