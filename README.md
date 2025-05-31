## 🧠 DocDoctor

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

Doc: "OS - Syllabus.pdf"
Q: What are the contents of module 1 - 3
A: Here’s a breakdown of the contents of modules 1 through 7, based on the provided context: _ **Module 1: Virtualization and File System Management (6 hours)** – This module focuses on virtualization technologies like hypervisors and file system interfaces. It covers concepts like virtual machines, container virtualization, file system access methods, directory structures, and implementation details. _ **Module 2: Processes - Structures & Process Creation/Management (9 hours)** – This module delves into process management within Unix systems, including process control blocks, ready lists, process creation, management, and the intricacies of thread models. _ **Module 3: Scheduling (9 hours)** – This module covers CPU scheduling algorithms, including pre-emptive and non-pre-emptive scheduling, multi-processor scheduling, deadlock handling mechanisms, resource allocation, and deadlock recovery strategies. _ **Module 4: Concurrency (8 hours)** – This module explores concurrency methods like file system recovery, journaling, soft updates, log-structured file systems, and distributed file systems. It also covers deadlock handling and related security aspects.

> (Used Gemma 3 1B parameter model via LM-Studio)

🧱 Tech Stack

    Frontend: Next.js, TailwindCSS

    Backend: Django REST Framework

    Vector DB: ChromaDB

    Auth: JWT, Supabase Auth (optional)

    LLM: LM Studio + llama-cpp

    DB: MySQL

    DevOps: Docker, Docker Compose

🛠️ Setup Instructions

````

```bash
git clone https://github.com/KreativeThinker/docdoctor
cd docdoctor
````

1. Start full app with Docker:

```bash
docker-compose up --build

cd frontend
pnpm Install
pnpm run dev

cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver 3003
```

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

