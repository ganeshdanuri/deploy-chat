import os
from pathlib import Path
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

env_path = Path('src/.env')
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/dbname")
engine = create_engine(DATABASE_URL)

with open('src/app/schemas/update_db.sql', 'r') as file:
    sql_script = file.read()

with engine.connect() as connection:
    # We execute statement by statement if possible, but execute raw text might work
    # We will split by semicolon for safety or execute text block
    connection.execute(text(sql_script))
    connection.commit()

print("Schema updated successfully via update_db.sql.")
