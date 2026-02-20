import urllib.request
import json

url = 'https://script.google.com/macros/s/AKfycbxGwsPowTrYLsz_bQN81JesVjRjFcE6T8gwmJMd-jLA7N1ovCBRDz6udBgAMdOADryfaw/exec'
data = json.dumps({
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}]
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'text/plain;charset=utf-8'})

try:
    with urllib.request.urlopen(req) as response:
        result = response.read().decode('utf-8')
        print("Success:")
        print(result)
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
