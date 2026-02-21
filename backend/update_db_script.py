from sqlmodel import Session, create_engine, text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "")
engine = create_engine(DATABASE_URL)

def update_schema():
    with Session(engine) as session:
        print("Adding google_id column...")
        session.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR UNIQUE;"))
        print("Adding profile_image column...")
        session.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR;"))
        print("Making password_hash nullable...")
        session.execute(text("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;"))
        session.commit()
    print("Database schema updated successfully.")

if __name__ == "__main__":
    update_schema()
