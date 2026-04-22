import logging
import re
from pathlib import Path

logger = logging.getLogger(__name__)

MIGRATIONS_DIR = Path(__file__).parent.parent / "migrations"


def _execute_sql_file(conn, sql: str) -> None:
    # Strip line comments so semicolons inside them don't split statements
    sql = re.sub(r"--[^\n]*", "", sql)
    statements = [s.strip() for s in sql.split(";") if s.strip()]
    for stmt in statements:
        conn.exec_driver_sql(stmt)


def run_migrations(engine) -> None:
    if not MIGRATIONS_DIR.exists():
        logger.warning("Migrations directory not found: %s", MIGRATIONS_DIR)
        return

    with engine.connect() as conn:
        conn.exec_driver_sql("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR NOT NULL UNIQUE,
                applied_at TIMESTAMP DEFAULT NOW()
            )
        """)
        conn.commit()

        result = conn.exec_driver_sql("SELECT filename FROM schema_migrations")
        applied = {row[0] for row in result}

        pending = sorted(f for f in MIGRATIONS_DIR.glob("*.sql") if f.name not in applied)

        if not pending:
            logger.info("No pending migrations")
            return

        for migration_file in pending:
            logger.info("Applying migration: %s", migration_file.name)
            try:
                _execute_sql_file(conn, migration_file.read_text())
                conn.exec_driver_sql(
                    "INSERT INTO schema_migrations (filename) VALUES (%s)",
                    (migration_file.name,),
                )
                conn.commit()
                logger.info("Applied migration: %s", migration_file.name)
            except Exception as e:
                conn.rollback()
                logger.error("Migration %s failed: %s", migration_file.name, e)
                raise
