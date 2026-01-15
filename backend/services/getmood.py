import joblib

valence_model = joblib.load('../model/valnce_model.joblib')
arousal_model = joblib.load('../model/arousal_model.joblib')

def get_mood(features):
    if features is not None:
        valence = valence_model.predict(features)[0]
        arousal = arousal_model.predict(features)[0]
    
    