from google import genai
import os

# Check installed version
# Note: google-genai package version attribute might differ or be accessed differently
# usually packages have __version__

print("google-genai package installed.")

def test_google_genai():
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY environment variable not set.")
            print("Please set your API key to run the model test.")
            return

        client = genai.Client(api_key=api_key)
        
        # Using the latest efficient model with new SDK
        print("Sending request to Gemini 1.5 Flash using google-genai client...")
        response = client.models.generate_content(
            model="gemini-1.5-flash", 
            contents="Hello, this is a test from the new SDK."
        )
        print("Response received:")
        print(response.text)
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_google_genai()
