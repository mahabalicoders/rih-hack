import requests
import json

def get_score(payload):
    url = "http://localhost:5000/score"
    try:
        response = requests.post(url, json=payload)
        return response.json()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def test_calibration():
    # Base "genuine" data
    base_data = {
        "term": 12,
        "employees": 2,
        "loan_amount_inr": 1000000,
        "business_type": 1,
        "is_urban": 0,
        "is_existing": 0,
        "upi_monthly_txn": 20,
        "gst_registered": 0,
        "gst_filing_score": 4,
        "whatsapp_business": 0,
        "has_website": 0,
        "social_score": 4,
        "mobile_banking_score": 4,
        "aadhaar_linked": 1
    }

    print("--- Testing Anomaly Detector ---")
    res_normal = get_score(base_data)
    print(f"Normal Data Anomaly: {res_normal.get('is_anomaly')} (Score: {res_normal.get('anomaly_score')})")

    print("\n--- Testing Reputation Calibration ---")
    # Linked (Rep=0.9)
    linked_data = {**base_data, "google_reputation_score": 0.9}
    res_linked = get_score(linked_data)
    score_linked = res_linked.get('score')
    
    # Unlinked (Rep=0.5)
    unlinked_data = {**base_data, "google_reputation_score": 0.5}
    res_unlinked = get_score(unlinked_data)
    score_unlinked = res_unlinked.get('score')

    print(f"Score (Linked 0.9): {score_linked}")
    print(f"Score (Unlinked 0.5): {score_unlinked}")
    
    diff = score_linked - score_unlinked
    print(f"Score Drop: {diff:.1f} points ({ (diff/score_linked*100):.1f}%)")

    if 1 <= diff <= 10:
        print("RESULT: Calibration SUCCESSFUL - Drop is within expected 'at least 1-5' range.")
    else:
        print("RESULT: Calibration needs adjustment.")

if __name__ == "__main__":
    test_calibration()
