# Feelify — Music Emotion Recognition

Upload an MP3, get its emotions and a visualization of where it sits on valence-arousal emotion space.

**[Try it Out](https://song-mood-detector.vercel.app)**

![Python](https://img.shields.io/badge/Python-3.14-blue)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.8-orange)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-19-blue)

---

## Summary

- Trained **two scikit-learn GradientBoostingRegressors** to predict valence and arousal from audio
- Extracted **89 acoustic features** per song using **librosa** (MFCCs, chroma, spectral, tempo, etc.)
- Implemented **custom sample weighting** to prevent center bias in regression
- Built data pipeline with **pandas** and **NumPy** for processing ~2000 songs from the DEAM dataset
- Created emotion space visualization with **matplotlib**, dynamic overlays with **Pillow**
- Served via **FastAPI** backend, **React + TypeScript** frontend

---

## The Problem

- Emotions in music aren't discrete — a song isn't just "happy" or "sad"
- Framed this as **regression** instead of classification
- Predict two continuous values:
  - **Valence** — how positive or negative (x-axis)
  - **Arousal** — how energetic or calm (y-axis)
- These coordinates map to a 2D emotion space with 24 labeled emotions

---

## Dataset

- **DEAM (Database for Emotion Analysis in Music)**
- ~2000 songs with crowdsourced annotations
- Each song rated on valence and arousal (1-9 scale)
- Includes standard deviation per song — used this for sample weighting
- Loaded and merged with **pandas**

---

## Feature Extraction

- Used **librosa** to extract **89 acoustic features** per song:
  - **Temporal** — zero-crossing rate, RMS energy
  - **Spectral** — centroid, bandwidth, rolloff, contrast
  - **Rhythm** — tempo (BPM)
  - **Tonal** — chroma (12 pitch classes), tonnetz
  - **Timbre** — MFCCs (1-13)
  - **Source separation** — harmonic/percussive ratio
- Computed mean and std for most features to capture how the song changes over time
- All processing done with **NumPy** arrays

---

## Model Training

- Two separate **scikit-learn GradientBoostingRegressors** — one for valence, one for arousal
- Hyperparameters: 200 estimators, max depth 5, learning rate 0.1, 80% subsampling
- Normalized all features with **StandardScaler**
- Implemented **custom sample weighting**:
  - Songs with higher annotator agreement get more weight
  - Songs with extreme emotions (edges of the space) get boosted
  - This prevents the model from predicting everything as neutral
- Evaluated with **mean absolute error** on 80/20 train/test split
- Serialized models with **joblib**

---

## Inference

- New MP3 goes through same **librosa** feature extraction
- Features scaled with saved **StandardScaler**
- Both models predict valence and arousal
- Calculate **Euclidean distance** (NumPy) to all 24 emotion coordinates
- Return top 3 closest emotions with confidence percentages based on inverse distance

---

## Visualization

<img src="backend/assets/valence_arousal_base.png" width="400">

- Base graph generated with **matplotlib**:
  - Custom RGB gradient background (red/blue/green/yellow for each quadrant)
  - 24 emotion coordinates plotted with color-coded markers
  - Quadrant labels and axis annotations
- At inference, **Pillow** overlays the predicted position onto this base image:
  - Draws a red marker at the (valence, arousal) coordinate
  - Adds an arrow and "YOUR SONG" label
  - Returns as base64-encoded PNG in the API response

---

## Backend

- **FastAPI** REST API with `/analyze` POST endpoint
- **Pydantic** models for request/response validation
- **Pillow** to overlay song position on pre-rendered emotion graph
- Returns base64-encoded visualization + emotion data as JSON

---

## Frontend

- **React 19** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- Custom `useFileUpload` hook for drag-and-drop handling

---

## Structure

```
backend/
├── model/train_model.py      # training + weighting logic
├── services/getfeatures.py   # 89-feature extraction
├── services/getmood.py       # inference + emotion mapping
├── services/visualization.py # Pillow overlay logic
├── scripts/generate_base_graph.py  # matplotlib graph generation
└── main.py

frontend/src/
├── app/App.tsx
└── hooks/useFileUpload.ts
```
