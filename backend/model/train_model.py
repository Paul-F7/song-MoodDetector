# Trains the valence and arousal models from the librosa features
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import joblib

AUDIO_DIR = '../dataset/DEAM_audio/MEMD_audio' 
ANNOTATIONS_1 = '../dataset/DEAM_Annotations/annotations/static_annotations_averaged_songs_1_2000.csv'
ANNOTATIONS_2 = '../dataset/DEAM_Annotations/annotations/static_annotations_averaged_songs_2000_2058.csv'
FEATURES = '../dataset/audio_features/audio_features.csv'

annotations1 = pd.read_csv(ANNOTATIONS_1)
annotations2 = pd.read_csv(ANNOTATIONS_2)


annotations = pd.concat([annotations1, annotations2], ignore_index = True)
annotations.columns = annotations.columns.str.strip()

features = pd.read_csv(FEATURES)

# merge both
data = features.merge(annotations, on='song_id')
print(f"Matched {len(data)} songs with annotations")

#  Prepare features and targets
# Only use audio features (from features CSV), exclude all annotation columns
# Note: valence_std and arousal_std are still used below for sample weighting (confidence)
audio_feature_cols = [col for col in features.columns if col != 'song_id']
feature_cols = audio_feature_cols

X = data[feature_cols] 
y_valence = data['valence_mean']
y_arousal = data['arousal_mean']

# weights for training set (standard deviation)
valence_weights = 1 / (data['valence_std'] + 0.1)
arousal_weights = 1 / (data['arousal_std'] + 0.1)

# Split up data to 80/20 Test / Train Split
X_train, X_test, y_val_train, y_val_test, y_aro_train, y_aro_test, val_weights_train, _, aro_weights_train, _ = train_test_split(
    X, y_valence, y_arousal, valence_weights, arousal_weights, test_size=0.2, random_state=42
)

# Train valence model
print("Training valence model...")
valence_model = RandomForestRegressor(n_estimators=100, random_state=42)
valence_model.fit(X_train, y_val_train, sample_weight=val_weights_train)

# Train arousal model
print("Training arousal model...")
arousal_model = RandomForestRegressor(n_estimators=100, random_state=42)
arousal_model.fit(X_train, y_aro_train, sample_weight=aro_weights_train)

# Evaluate + Print Results
val_pred = valence_model.predict(X_test)
aro_pred = arousal_model.predict(X_test)
print(f"\nValence MAE: {mean_absolute_error(y_val_test, val_pred):.3f}")
print(f"\nArousal MAE: {mean_absolute_error(y_aro_test, aro_pred):.3f}")

# Save models
joblib.dump(valence_model, 'valence_model.joblib')
joblib.dump(arousal_model, 'arousal_model.joblib')
print("\nAll Done")