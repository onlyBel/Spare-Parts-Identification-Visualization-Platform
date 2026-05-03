# Setup and Deployment Guide

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn package manager

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Seed the database with sample data:
```bash
python seed_data.py
```

6. Start the FastAPI server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Running the Application

### Development Mode

Run both backend and frontend in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

### Production Build

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
```

The built files will be in the `dist/` directory. Serve these files using any static file server (nginx, Apache, etc.).

## Database Management

### Reseeding Data
To reset the database with fresh sample data:
```bash
cd backend
python seed_data.py
```

### Viewing the Database
The SQLite database is stored at `backend/spare_parts.db`. You can view it using:
- DB Browser for SQLite (GUI)
- Command line: `sqlite3 backend/spare_parts.db`

## API Testing

You can test the API using:
1. The built-in Swagger UI at `http://localhost:8000/docs`
2. curl commands:
```bash
# Get all equipment
curl http://localhost:8000/api/equipment

# Search parts
curl -X POST http://localhost:8000/api/search/parts \
  -H "Content-Type: application/json" \
  -d '{"query": "bearing"}'

# Get inventory
curl http://localhost:8000/api/inventory
```

3. Postman or similar API testing tools

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in main.py or kill the process
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Database locked:**
- Ensure only one instance of the backend is running
- Delete `spare_parts.db` and reseed

**Import errors:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**Port already in use:**
```bash
# Change port in vite.config.js or kill the process
# On Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**API connection errors:**
- Verify backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify proxy configuration in `frontend/vite.config.js`

**Build errors:**
- Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Deployment Options

### Option 1: Local Development
Follow the setup instructions above.

### Option 2: Docker (Recommended for Production)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=sqlite:///./spare_parts.db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
```

Run with:
```bash
docker-compose up
```

### Option 3: Cloud Deployment

**Backend (FastAPI)**
- Deploy to: Railway, Render, Heroku, AWS ECS
- Requirements: Python runtime, SQLite or PostgreSQL

**Frontend (React)**
- Deploy to: Vercel, Netlify, AWS S3 + CloudFront
- Build command: `npm run build`
- Output directory: `dist`

## Environment Variables

### Backend
No environment variables required for basic setup. For production:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: For JWT authentication
- `CORS_ORIGINS`: Comma-separated list of allowed origins

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)

## Performance Optimization

### Backend
- Use PostgreSQL for production
- Add database indexes on frequently queried fields
- Implement API response caching
- Add pagination for large datasets

### Frontend
- Enable code splitting
- Implement lazy loading for images
- Use React.memo for expensive components
- Add service worker for offline support

## Monitoring and Logging

### Backend
- FastAPI provides built-in logging
- Add structured logging (JSON format)
- Integrate with monitoring tools (Sentry, DataDog)

### Frontend
- Use browser DevTools for performance profiling
- Add error tracking (Sentry)
- Implement analytics (Google Analytics)

## Backup and Recovery

### Database Backup
```bash
# SQLite backup
cp backend/spare_parts.db backend/spare_parts.db.backup

# Or use SQLite dump
sqlite3 backend/spare_parts.db .dump > backup.sql
```

### Restore
```bash
# Restore from backup
cp backend/spare_parts.db.backup backend/spare_parts.db

# Or from SQL dump
sqlite3 backend/spare_parts.db < backup.sql
```
