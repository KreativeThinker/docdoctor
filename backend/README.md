🧠 DocDoctor

A full-stack RAG-powered web app to upload documents (PDF/DOCX/TXT) and ask natural language questions. Built with Django REST Framework, MySQL, ChromaDB, Next.js, and TailwindCSS.
🚀 Features

    📄 Upload & process documents (PDF, DOCX, TXT)

    🔍 Ask natural language questions

    🧠 RAG pipeline (chunking, embeddings, similarity search, LLM answering)

    📚 Dashboard for managing documents

    📥 Upload page with drag-and-drop

    🤖 Uses LM Studio with llama-cpp for local LLM answering

    🐳 Dockerized fullstack setup (MySQL + ChromaDB + frontend + backend)

📸 Screenshots

Add screenshots of your UI here (dashboard, upload, Q&A pages)
🧪 Sample Questions

Doc: "Intro to ML.pdf"
Q: What is the difference between supervised and unsupervised learning?
A: Supervised learning uses labeled data, while unsupervised does not. [Page 3]
🧱 Tech Stack

    Frontend: Next.js, TailwindCSS

    Backend: Django REST Framework

    Vector DB: ChromaDB

    Auth: JWT, Supabase Auth (optional)

    LLM: LM Studio + llama-cpp

    DB: MySQL

    DevOps: Docker, Docker Compose

🛠️ Setup Instructions

git clone https://github.com/yourname/doc-intel-platform.git
cd doc-intel-platform

1. Start full app with Docker:

docker-compose up --build

Runs:

    Frontend at localhost:3000

    MySQL at localhost:3001

    ChromaDB at localhost:3002

    Backend at localhost:3003

2. LM Studio Setup (for LLM answers)

   Install LM Studio: https://lmstudio.ai

   Load a compatible model like Llama 3 Instruct

   Run server at localhost:1234

📬 API Reference
GET /api/documents

Returns list of uploaded documents
POST /api/upload

Upload and process a document
POST /api/query

Ask a question (params: doc_id, question, top_k)
📂 Folder Structure

/frontend → Next.js app  
/backend → Django REST API  
/docker → docker-compose.yaml

🧾 Requirements

requirements.txt (backend)
package.json (frontend)
.env.example

📄 License

MIT
