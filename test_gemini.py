import google.generativeai as genai
import os

# Check installed version
print(f"Installed google-generativeai version: {genai.__version__}")

# Note: You need to set your API key in the environment variable GEMINI_API_KEY
# or configure it directly: genai.configure(api_key="YOUR_API_KEY")

def test_gemini():
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY environment variable not set.")
            print("Please set your API key to run the model test.")
            return

        genai.configure(api_key=api_key)
        
        # Using the latest efficient model
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        print("Sending request to Gemini 1.5 Flash...")
        response = model.generate_content("Hello, are you working?")
        print("Response received:")
        print(response.text)
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_gemini()
