from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the SiliconMind model
MODEL_PATH = 'siliconmind.pkl'
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("✅ SiliconMind model loaded")
else:
    model = None
    print("❌ siliconmind.pkl not found")

@app.route('/score', methods=['POST'])
def score_route():
    if model is None:
        return jsonify({'status': 'error', 'message': 'Model not loaded on server'}), 500
        
    try:
        data = request.json
        features = np.array([[
            data.get('term', 0),
            data.get('employees', 0),
            data.get('loan_amount_inr', 0),
            data.get('business_type', 0),
            data.get('is_urban', 0),
            data.get('is_existing', 0),
            data.get('upi_monthly_txn', 0),
            data.get('gst_registered', 0),
            data.get('gst_filing_score', 0),
            data.get('whatsapp_business', 0),
            data.get('has_website', 0),
            data.get('social_score', 0),
            data.get('mobile_banking_score', 0),
            data.get('aadhaar_linked', 0)
        ]])
        
        default_prob = model.predict_proba(features)[0][1]
        raw_score = (1 - default_prob) * 100

        # --- Hybrid Calibration (Aggressive for Demo) ---
        boost = 0
        if data.get('gst_filing_score', 0) >= 8: boost += 18
        elif data.get('gst_filing_score', 0) >= 6: boost += 10
        if data.get('upi_monthly_txn', 0) >= 150: boost += 12
        elif data.get('upi_monthly_txn', 0) >= 40: boost += 8
        if data.get('aadhaar_linked', 0) == 1: boost += 8
        if data.get('whatsapp_business', 0) == 1: boost += 4
        if data.get('is_existing', 0) == 1: boost += 6

        calibrated_score = round((raw_score * 0.5) + (boost * 1.8), 1)
        final_score = min(max(calibrated_score, 10), 99)
        final_prob = 1 - (final_score / 100)

        if final_score >= 80: risk, grade = "Low", "A"
        elif final_score >= 65: risk, grade = "Low", "B"
        elif final_score >= 45: risk, grade = "Medium", "C"
        elif final_score >= 25: risk, grade = "High", "D"
        else: risk, grade = "Critical", "F"

        return jsonify({
            'status': 'success',
            'score': final_score,
            'grade': grade,
            'risk': risk,
            'default_probability': round(final_prob * 100, 1),
            'message': 'Hybrid Assessment Complete'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/', methods=['GET'])
def health():
    return jsonify({'status': 'running', 'service': 'Arthashakti API'})

if __name__ == '__main__':
    # Hugging Face Spaces port is 7860
    app.run(host='0.0.0.0', port=7860)
