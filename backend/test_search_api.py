import requests
import json

def test_search(query):
    url = "http://localhost:5000/api/places/search"
    data = {"query": query}
    try:
        response = requests.post(url, json=data)
        print(f"Query: {query}")
        print(f"Status: {response.status_code}")
        print(f"Body: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_search("Starbucks Jaipur")
    test_search("NonExistentBusinessThatDoesntExist")
