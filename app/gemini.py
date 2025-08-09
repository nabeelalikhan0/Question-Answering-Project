import os
import sys
import google.generativeai as genai

# --- Configuration ---
# This block now checks if the environment variable is set before using it.
try:
    # It's best practice to load the key from an environment variable.
    api_key = os.environ["GEMINI_API_KEY"]
    genai.configure(api_key=api_key)
except KeyError:
    # Exit gracefully if the API key is not found.
    sys.exit("Error: The 'GOOGLE_API_KEY' environment variable is not set. Please set it and try again.")


# --- File Content ---
# Ensure you have a folder named 'app' with 'test.txt' inside.
if not os.path.exists("app"):
    os.makedirs("app")

# Read the context file that the AI will use.
with open("app/test.txt", "r", encoding="utf-8") as f:
    file_text = f.read()


# --- Model and Chat Initialization ---
system_instruction = f"You are an assistant. Understand the following text and answer questions based ONLY on the information within it. Do not use any external knowledge.\n\n---TEXT---\n{file_text}"

model = genai.GenerativeModel(
    model_name='gemini-1.5-flash',
    system_instruction=system_instruction
)

chat_session = model.start_chat(history=[])


# --- Main Function ---
def ask_gemini(prompt):
    """
    Sends a prompt to the ongoing chat session and returns the model's response.
    """
    response = chat_session.send_message(prompt)
    return response.text


# --- Example Usage ---
# print("User: What types of cars are mentioned?")
# print(f"Gemini: {ask_gemini('What types of cars are mentioned?')}\n")

# print("User: Which car is best for off-road driving?")
# print(f"Gemini: {ask_gemini('Which car is best for off-road driving?')}")