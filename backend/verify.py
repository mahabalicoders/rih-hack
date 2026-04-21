import urllib.request
import json

BACKEND = "http://localhost:5000"

normal = {
    "term": 12, "employees": 5, "loan_amount_inr": 500000,
    "business_type": 1, "is_urban": 1, "is_existing": 1,
    "upi_monthly_txn": 200, "gst_registered": 1, "gst_filing_score": 8,
    "whatsapp_business": 1, "has_website": 1, "social_score": 7,
    "mobile_banking_score": 8, "aadhaar_linked": 1
}

fraud = {
    "term": 0, "employees": 5, "loan_amount_inr": 500000,
    "business_type": 1, "is_urban": 1, "is_existing": 1,
    "upi_monthly_txn": 6000000, "gst_registered": 1, "gst_filing_score": 0,
    "whatsapp_business": 1, "has_website": 1, "social_score": 7,
    "mobile_banking_score": 8, "aadhaar_linked": 1
}

def post(payload, label):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{BACKEND}/score",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        result = json.loads(resp.read())
    print(f"\n=== {label} ===")
    print(f"  score:          {result.get('score')}")
    print(f"  grade:          {result.get('grade')}")
    print(f"  risk:           {result.get('risk')}")
    print(f"  is_anomaly:     {result.get('is_anomaly')}")
    print(f"  anomaly_score:  {result.get('anomaly_score')}")
    print(f"  anomaly_msg:    {result.get('anomaly_message', '')[:60]}")
    print(f"  message:        {result.get('message')}")

post(normal, "TEST 1 — Normal profile (expect is_anomaly: False)")
post(fraud,  "TEST 2 — Demo fraud trigger (expect is_anomaly: True)")
