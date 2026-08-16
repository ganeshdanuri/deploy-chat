"""One-shot schema setup. Run as a deployment step, never on app startup.

    python -m app.core.bootstrap

Ordering matters: extensions must exist before create_all(), because the
DocumentChunk model declares a Vector(768) column that pgvector must provide.
"""

import logging
import sys

from dotenv import load_dotenv

load_dotenv()

from app.core.db import engine, init_db  # noqa: E402
from app.core.migrations import run_migrations  # noqa: E402

logger = logging.getLogger(__name__)

# pgcrypto -> gen_random_bytes(), used by 20260422000001_update_db.sql
# vector   -> Vector(768) on DocumentChunk
REQUIRED_EXTENSIONS = ("pgcrypto", "vector")


def ensure_extensions(engine) -> None:
    with engine.connect() as conn:
        for ext in REQUIRED_EXTENSIONS:
            conn.exec_driver_sql(f'CREATE EXTENSION IF NOT EXISTS "{ext}"')
            logger.info("Extension ready: %s", ext)
        conn.commit()


def bootstrap() -> None:
    ensure_extensions(engine)
    init_db()
    run_migrations(engine)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    try:
        bootstrap()
    except Exception:
        logger.exception("Bootstrap failed")
        sys.exit(1)
    logger.info("Bootstrap complete")
