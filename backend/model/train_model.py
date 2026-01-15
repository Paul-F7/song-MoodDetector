# Trains the valence and arousal models from the librosa features
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error
import joblib

ANNOTATIONS_1 = '../dataset/DEAM_Annotations/annotations/static_annotations_averaged_songs_1_2000.csv'
ANNOTATIONS_2 = '../dataset/DEAM_Annotations/annotations/static_annotations_averaged_songs_2000_2058.csv'
FEATURES = '../dataset/audio_features/audio_features.csv'

annotations1 = pd.read_csv(ANNOTATIONS_1)
annotations2 = pd.read_csv(ANNOTATIONS_2)

annotations = pd.concat([annotations1, annotations2], ignore_index=True)
annotations.columns = annotations.columns.str.strip()

features = pd.read_csv(FEATURES)

# merge both
data = features.merge(annotations, on='song_id')
print(f"Matched {len(data)} songs with annotations")

# Prepare features and targets
audio_feature_cols = [col for col in features.columns if col != 'song_id']
feature_cols = audio_feature_cols

X = data[feature_cols]
y_valence = data['valence_mean']
y_arousal = data['arousal_mean']

# Standardize features for better model performance
scaler = StandardScaler()
X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)

# weights for training - emphasize extreme values to reduce center bias
valence_weights = 1 / (data['valence_std'] + 0.1)
arousal_weights = 1 / (data['arousal_std'] + 0.1)

# Add extra weight to extreme values (away from center ~5)
valence_extremity = np.abs(y_valence - 5) / 4  # 0-1 scale of how extreme
arousal_extremity = np.abs(y_arousal - 5) / 4
valence_weights = valence_weights * (1 + valence_extremity)
arousal_weights = arousal_weights * (1 + arousal_extremity)

# Split up data to 80/20 Test / Train Split
X_train, X_test, y_val_train, y_val_test, y_aro_train, y_aro_test, val_weights_train, _, aro_weights_train, _ = train_test_split(
    X_scaled, y_valence, y_arousal, valence_weights, arousal_weights, test_size=0.2, random_state=42
)

# Train valence model with Gradient Boosting (less center bias than RF)
print("Training valence model...")
valence_model = GradientBoostingRegressor(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.1,
    subsample=0.8,
    random_state=42
)
valence_model.fit(X_train, y_val_train, sample_weight=val_weights_train)

# Train arousal model
print("Training arousal model...")
arousal_model = GradientBoostingRegressor(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.1,
    subsample=0.8,
    random_state=42
)
arousal_model.fit(X_train, y_aro_train, sample_weight=aro_weights_train)

# Evaluate + Print Results
val_pred = valence_model.predict(X_test)
aro_pred = arousal_model.predict(X_test)
print(f"\nValence MAE: {mean_absolute_error(y_val_test, val_pred):.3f}")
print(f"Arousal MAE: {mean_absolute_error(y_aro_test, aro_pred):.3f}")

# Check prediction spread
print(f"\nValence pred range: [{val_pred.min():.2f}, {val_pred.max():.2f}]")
print(f"Arousal pred range: [{aro_pred.min():.2f}, {aro_pred.max():.2f}]")

# Save models and scaler
joblib.dump(valence_model, 'valence_model.joblib')
joblib.dump(arousal_model, 'arousal_model.joblib')
joblib.dump(scaler, 'scaler.joblib')
print("\nAll Done")