from services.getfeatures import get_features
from services.getmood import get_mood
from services.visualization import visualize_emotion
from services.organizedata import organize_data, Emotion
from pydantic import BaseModel
from fastapi import FastAPI, File, HTTPException, UploadFile

class Result(BaseModel):
    image: bytes
    emotion1: Emotion
    emotion2: Emotion | None = None
    emotion3: Emotion | None = None

def main(audio_file):
    features = get_features(audio_file)
    mood = get_mood(features)

    if mood is None:
        return None

    image_buf = visualize_emotion(mood.valence, mood.arousal)
    image = image_buf.read()

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

@app.post("/analyze", response_model=Result)
async def analyze(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    result = main(audio_bytes)

    if result is None:
        raise HTTPException(status_code=400, detail="Unable to detect mood from audio")

    return result
