
---

````markdown
# 📄 File-Based Chatbot with Google Gemini

This project is a Django web application that allows you to **upload a file** (TXT, PDF, DOCX), extract its text, and then **chat with a chatbot** powered by **Google Gemini** — with the conversation based entirely on the uploaded file’s content.

---

## 🚀 Features

- 📂 **Upload Files**: Supports `.txt`, `.pdf`, `.docx` formats.
- 🧠 **Text Extraction**: Automatically reads and processes file content.
- 💬 **Interactive Chat**: Ask questions and receive answers **only** from your uploaded file.
- 🔄 **Persistent Context**: The chatbot remembers your uploaded file during the session.
- 🖥 **User-Friendly Interface**: File upload + chat input on the same page.

---

## 🛠️ Tech Stack

- **Backend**: [Django](https://www.djangoproject.com/)
- **AI Model**: [Google Gemini API](https://ai.google.dev)
- **Frontend**: HTML + Django Templates
- **File Parsing**:
  - [PyPDF2](https://pypi.org/project/PyPDF2/) for PDFs
  - [python-docx](https://pypi.org/project/python-docx/) for DOCX
  - Built-in Python for TXT

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gemini-file-chatbot.git
   cd gemini-file-chatbot
````

2. **Create and activate a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Mac/Linux
   venv\Scripts\activate      # On Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root and add:

   ```env
   GOOGLE_API_KEY=your_google_gemini_api_key
   ```

5. **Run database migrations**

   ```bash
   python manage.py migrate
   ```

6. **Start the development server**

   ```bash
   python manage.py runserver
   ```

---

## 📄 Usage

1. Go to `http://127.0.0.1:8000/chatbot/`
2. Upload your file (`.txt`, `.pdf`, `.docx`).
3. Once uploaded, an **input box** will appear.
4. Type your questions — responses are based **only** on your uploaded file.

---

## 📂 Project Structure

```
project_root/
│
├── app/
│   ├── models.py         # File model with text storage
│   ├── forms.py          # Upload form
│   ├── views.py          # Upload + chat logic
│   ├── gemini.py         # Google Gemini API wrapper
│   ├── templates/
│   │   └── chatbot.html  # Main chatbot page
│
├── manage.py
├── requirements.txt
├── README.md
```

---

## 📜 Example

**Upload File**:

> `my_notes.pdf` containing details about cars.

**User**:

> "What does it say about electric cars?"

**Bot**:

> "The file mentions that electric cars are environmentally friendly and have lower running costs compared to traditional gasoline vehicles."

---

## ⚠️ Notes

* Large files may take longer to process.
* Session data is cleared when the server restarts.
* Gemini API usage depends on your API quota and billing settings.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💡 Future Improvements

* Store and search across multiple uploaded files.
* Add streaming responses for real-time replies.
* Enable multi-user sessions with authentication.

```

