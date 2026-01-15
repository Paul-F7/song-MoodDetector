import base64
from services.getfeatures import get_features
from services.getmood import get_mood
from services.visualization import visualize_emotion
from services.organizedata import organize_data, Emotion
from pydantic import BaseModel
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

class Result(BaseModel):
    image: str  # base64-encoded PNG
    emotion1: Emotion
    emotion2: Emotion | None = None
    emotion3: Emotion | None = None

def main(audio_file):
    features = get_features(audio_file)
    mood = get_mood(features)

    if mood is None:
        return None

    image_buf = visualize_emotion(mood.valence, mood.arousal)
    image = base64.b64encode(image_buf.read()).decode('utf-8')

    if mood.percentage2 > 5:
        if mood.percentage3 > 5:
            return Result(
                image=image,
                emotion1=organize_data(mood.emotion1, mood.percentage1),
                emotion2=organize_data(mood.emotion2, mood.percentage2),
                emotion3=organize_data(mood.emotion3, mood.percentage3)
            )
        return Result(
            image=image,
            emotion1=organize_data(mood.emotion1, mood.percentage1),
            emotion2=organize_data(mood.emotion2, mood.percentage2)
        )

    return Result(
        image=image,
        emotion1=organize_data(mood.emotion1, mood.percentage1)
    )

app = FastAPI()

@app.get("/")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze", response_model=Result)
async def analyze(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    print(f"[DEBUG] Received file: {file.filename}, size: {len(audio_bytes)} bytes")
    result = main(audio_bytes)
    print(f"[DEBUG] Result: {result.emotion1.name if result else 'None'}")

    if result is None:
        raise HTTPException(status_code=400, detail="Unable to detect mood from audio")

    return result
