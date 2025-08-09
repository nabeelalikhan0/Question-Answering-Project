import json
from re import L
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from . import models,forms
import os
import PyPDF2
from .gemini import ask_gemini
import docx


# Create your views here.
def index(request):
    return render(request,"index.html")

def chatbot(request):
    form = forms.TextForm()
    file_text = request.session.get("file_text", None)
    ai_response = None

    if request.method == "POST":
        if "file" in request.FILES:  # File upload
            form = forms.TextForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                model = models.PreprocessText.objects.order_by('-id').first()

                if model and model.file:
                    ext = os.path.splitext(model.file.name)[1].lower()

                    # Read TXT
                    if ext == '.txt':
                        with open(model.file.path, 'r', encoding='utf-8') as f:
                            file_text = f.read()

                    # Read PDF
                    elif ext == '.pdf':
                        with open(model.file.path, 'rb') as pdf_file:
                            reader = PyPDF2.PdfReader(pdf_file)
                            file_text = "".join(page.extract_text() for page in reader.pages)

                    # Read DOCX
                    elif ext == '.docx':
                        doc = docx.Document(model.file.path)
                        file_text = "\n".join([para.text for para in doc.paragraphs])

                    model.file_text = file_text
                    model.save()

                    # Store in session for chat persistence
                    request.session["file_text"] = file_text

        elif "message" in request.POST:  # Chat message
            message = request.POST.get("message", "")
            context_text = request.session.get("file_text", "")

            if context_text:
                ai_response = ask_gemini(f"Context:\n{context_text}\n\nUser: {message}")
            else:
                ai_response = "No file uploaded yet. Please upload a file first."

    return render(request, "chatbot.html", {
        "form": form,
        "file_text": file_text,
        "ai_response": ai_response
    })

# @csrf_exempt
# def chatbot_chat(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body.decode("utf-8"))
#             user_input = data.get("query", "")
#             return JsonResponse({"reply": f"You said: {user_input}"})
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
#     else:
#         return JsonResponse({"error": "Only POST method allowed"}, status=405)