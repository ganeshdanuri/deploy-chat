from fastapi import FastAPI
from dotenv import load_dotenv
from pathlib import Path
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.limiter import limiter
from app.core.cors import ScopedCORSMiddleware

# Load environment variables from .env file

load_dotenv()

from app.api.router import api_router  # noqa: E402

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Schema setup is a deployment step, not a runtime one -- see app/core/bootstrap.py.
# Running DDL on startup races across Cloud Run instances.

# CORS: permissive for the embeddable widget, locked to our own frontend for
# everything else. See app/core/cors.py.
app.add_middleware(ScopedCORSMiddleware)

app.include_router(api_router)


