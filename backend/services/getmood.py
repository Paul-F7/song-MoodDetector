import joblib
import numpy as np
from pydantic import BaseModel
from ..constants.constants import EMOTION_COORDINATES

class EmotionResult(BaseModel):
    valence: float
    arousal: float
    emotion1: str
    percentage1: float
    emotion2: str
    percentage2: float
    emotion3: str
    percentage3: float

valence_model = joblib.load('../model/valence_model.joblib')
arousal_model = joblib.load('../model/arousal_model.joblib')
COORDS = np.array(list(EMOTION_COORDINATES.values()))
LABELS = np.array(list(EMOTION_COORDINATES.keys()))

def get_mood(features):
    if features is None:
        return None
    
    valence = valence_model.predict(features)[0]
    arousal = arousal_model.predict(features)[0]

    v = max(0.0, min(1.0, valence))
    a = max(0.0, min(1.0, arousal))

    # Vector Distance Calculation
    input_point = np.array([v, a])
    distances = np.linalg.norm(COORDS - input_point, axis=1)
    
    #Top3 Emotions
    top_3_idx = np.argsort(distances)[:3]

    #Calculate percentages
    top_3_dists = distances[top_3_idx]
    weights = 1 / (1 + top_3_dists)
    percentages = (weights / np.sum(weights)) * 100

    top_3_labels = LABELS[top_3_idx]
    return EmotionResult(
        valence=valence,
        arousal=arousal,
        emotion1=top_3_labels[0], percentage1=round(percentages[0], 2),
        emotion2=top_3_labels[1], percentage2=round(percentages[1], 2),
        emotion3=top_3_labels[2], percentage3=round(percentages[2], 2)
    )



