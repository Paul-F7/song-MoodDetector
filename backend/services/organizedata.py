import json
from pydantic import BaseModel
from ..constants.constants import text

class Emotion(BaseModel):
    name: str
    percentage: float
    emoji: str
    description: str

def organize_data(name: str, percentage: float) -> Emotion:
    data = json.loads(text[name])
    return Emotion(
        name=name,
        percentage=percentage,
        emoji=data["emoji"],
        description=data["description"]
    )

