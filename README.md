# 🚀 RAG-Based Knowledge Assistant

> Chat with your PDFs using AI-powered Retrieval-Augmented Generation (RAG), semantic search, vector embeddings, and real-time streaming responses.

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)
![OpenRouter](https://img.shields.io/badge/OpenRouter-LLM-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Live Demo**

- Frontend: [https://rag-knowledge-assistant-omega.vercel.app](https://rag-knowledge-assistant-omega.vercel.app)
- Backend: [https://rag-knowledge-assistant-psxy.onrender.com](https://rag-knowledge-assistant-psxy.onrender.com)

---

## 📖 Overview

RAG-Based Knowledge Assistant is a full-stack AI application that allows users to upload PDF documents and ask natural language questions about their contents.

Instead of relying on general AI knowledge, the application retrieves relevant information directly from uploaded documents using vector search and uses that context to generate accurate answers with source citations.

Think of it as:

**"ChatGPT for your own PDFs."**

---

## ✨ Features

### 📄 Document Management

* Upload PDF documents
* Automatic PDF text extraction
* Smart document chunking
* Document dashboard
* Delete documents
* User-specific document isolation

### 🤖 AI-Powered Question Answering

* Retrieval-Augmented Generation (RAG)
* Semantic similarity search
* Context-aware responses
* Grounded answers from uploaded documents only
* Source citations

### ⚡ Real-Time Experience

* Streaming AI responses
* ChatGPT-like typing effect
* Interactive chat interface
* Modern responsive UI

### 🔒 Authentication & Security

* JWT Authentication
* Password hashing with bcrypt
* Protected routes
* User-scoped data access
* CORS configuration for production deployments

---

## 🏗️ Architecture

```text
PDF Upload
    ↓
Multer
    ↓
pdf-parse
    ↓
LangChain Chunking
    ↓
Embeddings
    ↓
MongoDB Atlas Vector Search
    ↓
User Question
    ↓
Question Embedding
    ↓
Vector Search
    ↓
Top Relevant Chunks
    ↓
OpenRouter LLM
    ↓
Streaming Response + Citations
```

---

## 🧠 How RAG Works

### 1. Document Ingestion

```text
Upload PDF
     ↓
Extract Text
     ↓
Split Into Chunks
     ↓
Generate Embeddings
     ↓
Store Vectors In MongoDB
```

### 2. Question Answering

```text
User Question
      ↓
Generate Question Embedding
      ↓
Vector Search
      ↓
Retrieve Top Chunks
      ↓
Build Context
      ↓
Send To LLM
      ↓
Generate Grounded Answer
```

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router
* Axios
* Tailwind CSS
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express.js
* Multer
* pdf-parse
* LangChain Text Splitters
* JWT Authentication
* bcryptjs

### Database

* MongoDB Atlas
* MongoDB Atlas Vector Search
* Mongoose

### AI & ML

* OpenRouter (embeddings + LLM)
* `sentence-transformers/all-MiniLM-L6-v2` Embeddings
* GPT-3.5 Turbo / Llama 3.1 (with Groq fallback for streaming)

### Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

## 📂 Project Structure

```text
rag-knowledge-assistant/

├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── routes/
│   ├── App.jsx
│   └── main.jsx
│
└── server/
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── services/
        ├── utils/
        └── uploads/
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Optional LLM fallbacks
GEMINI_API_KEY=your_gemini_key
HF_API_KEY=your_huggingface_key
GROQ_API_KEY=your_groq_key

# Frontend URL for CORS
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```env
# Server origin only — do NOT include /api (added automatically)
VITE_API_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://rag-knowledge-assistant-psxy.onrender.com
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/NishadDamale1010/rag-knowledge-assistant.git

cd rag-knowledge-assistant
```

---

### Backend Setup

```bash
cd server

npm install

npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 📌 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Documents

```http
POST   /api/documents/upload
GET    /api/documents
DELETE /api/documents/:id
```

### Chat

```http
POST /api/chat/ask
POST /api/chat/stream
```

---

## 🎯 Key Challenges Solved

### Semantic Search

Implemented vector similarity search using MongoDB Atlas Vector Search to retrieve contextually relevant chunks from uploaded PDFs.

### Streaming Responses

Built real-time AI response streaming using Server-Sent Events (SSE), providing a ChatGPT-like user experience.

### RAG Pipeline

Designed a complete Retrieval-Augmented Generation workflow that grounds AI responses in user-provided documents.

### User Isolation

Implemented secure JWT-based authentication ensuring users can only access their own uploaded documents.

---

## 📸 Screenshots

### Authentication

(Add Screenshot Here)

### Dashboard

(Add Screenshot Here)

### PDF Upload

(Add Screenshot Here)

### Chat Interface

(Add Screenshot Here)

---

## 🎥 Demo Video

(Add Loom / YouTube Demo Link Here)

---

## 📈 Resume Bullet

Built a RAG-Based Knowledge Assistant SaaS using React, Node.js, MongoDB Atlas Vector Search, and OpenRouter, enabling semantic PDF Q&A with real-time streaming responses, source citations, and JWT-authenticated multi-user document isolation.

---

## 🔮 Future Improvements

* Multi-document querying
* Chat history persistence
* Google OAuth
* Dark mode
* Document summarization
* Conversation memory
* Team workspaces
* Support for DOCX and TXT files
* Advanced citation highlighting

---

## 👨‍💻 Author

**Nishad Damale**

Computer Engineering Student

Passionate about Full-Stack Development, AI Applications, and Building Products.

---

⭐ If you found this project interesting, consider giving it a star!
