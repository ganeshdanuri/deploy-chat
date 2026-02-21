# Setup Guide

This guide provides step-by-step instructions to set up the Deploy Chat application, which consists of a Python FastAPI backend and a Next.js frontend.

## Prerequisites

- [Python 3.12](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) with the `pgvector` extension (e.g., using Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=dbname pgvector/pgvector:pg16`)
- [uv](https://github.com/astral-sh/uv) (for Python package management)

---

## 1. Backend Setup

The backend is a REST API built with FastAPI that manages the chatbots, RAG pipeline, and interactions.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment and install dependencies:**
   The project uses `uv` for fast package management. You can set it up via:
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   uv sync
   ```

3. **Environment Variables:**
   Create a `.env` file in the `backend` folder and configure your critical environment variables:
   ```env
   # Database connection string (adjust if using the Docker command above)
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   
   # Generate a strong secret key (e.g., using: openssl rand -hex 32)
   SECRET_KEY=your-secret-key
   
   # Obtain from Google Cloud Console (APIs & Services -> Credentials)
   GOOGLE_CLIENT_ID=your-google-client-id
   
   # Obtain from Resend Dashboard
   RESEND_API_KEY=your-resend-api-key
   ```

4. **Run the Backend Development Server:**
   ```bash
   uvicorn app.main:app --reload --app-dir src
   ```
   The backend should now be running at `http://127.0.0.1:8000`.

   *(Note: The database tables should automatically initialize on startup. If you encounter schema errors, review the backend files or run necessary setup scripts like `python update_db_script.py` if requested by the application).*

---

## 2. Frontend Setup

The frontend is a React application built with Next.js, hosting the Admin Dashboard and configuration UI.

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` or `.env.local` file in the `frontend` folder with relevant environment variables:
   ```env
   # Local URL for your backend server
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # Same Client ID as the backend, obtained from Google Cloud Console
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Run the Frontend Development Server:**
   ```bash
   npm run dev
   ```

5. **View the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your web browser.
