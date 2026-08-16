"""
Two CORS policies in one app.

The widget is embedded on customer domains we can't enumerate, so those routes
must accept any origin. The dashboard API is the opposite: it is only ever
called by our own frontend, and leaving it wide open means any page on the
internet can read responses for a user whose token it manages to obtain.

Starlette's CORSMiddleware is app-wide, so this dispatches to one of two
configured instances based on the request path.
"""
import os

from starlette.middleware.cors import CORSMiddleware

WIDGET_PATH_PREFIX = "/api/widget"

# Local dev origins are always allowed; production hosts come from env.
_DEFAULT_DEV_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


def dashboard_origins() -> list[str]:
    """Comma-separated FRONTEND_ORIGINS, plus localhost when not in production."""
    configured = [
        o.strip().rstrip("/")
        for o in os.getenv("FRONTEND_ORIGINS", "").split(",")
        if o.strip()
    ]
    is_prod = os.getenv("ENVIRONMENT", "development").lower() not in (
        "development",
        "local",
        "test",
    )
    if is_prod:
        return configured
    return configured + [o for o in _DEFAULT_DEV_ORIGINS if o not in configured]


class ScopedCORSMiddleware:
    """Routes each request to the CORS policy that matches its path."""

    def __init__(self, app):
        self.widget = CORSMiddleware(
            app,
            allow_origins=["*"],  # embedded on customer sites we don't control
            allow_credentials=False,
            allow_methods=["GET", "POST", "OPTIONS"],
            allow_headers=["*"],
        )
        self.dashboard = CORSMiddleware(
            app,
            allow_origins=dashboard_origins(),
            allow_credentials=False,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            # Websockets/lifespan bypass CORS entirely.
            await self.dashboard.app(scope, receive, send)
            return

        target = (
            self.widget
            if scope.get("path", "").startswith(WIDGET_PATH_PREFIX)
            else self.dashboard
        )
        await target(scope, receive, send)
