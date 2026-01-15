# Feelify

A web app that analyzes the mood/emotion of songs using machine learning.

## Features

- Upload MP3 files via drag-and-drop or file picker
- ML model predicts valence and arousal from audio features
- Displays detected emotions with percentages and visualizations

## Tech Stack

**Backend:** Python, FastAPI, librosa, scikit-learn

**Frontend:** React, Vite, Tailwind CSS, Framer Motion

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API on `http://localhost:8000`.

## API

**POST /analyze** - Upload an audio file and receive emotion analysis results.
