# 🔍 AI-Powered Source Code Analysis with LLMs

This project introduces an **AI-driven source code analysis system** that leverages **Large Language Models (LLMs)** and **Graph-based Retrieval-Augmented Generation (RAG)** to enhance code understanding, bug detection, and semantic query answering. It provides developers with intelligent insights into large-scale codebases, enabling improved maintainability, debugging, and software comprehension.

---

## 🚀 Project Overview

Traditional static code analysis tools are limited to syntactic or rule-based checks.  
This project goes beyond by combining **LLMs**, **code embeddings**, and **knowledge graphs** to perform **semantic analysis**, **function-level search**, and **bug reasoning**.  

The system integrates:
- **AST parsing (Abstract Syntax Tree)** for structural understanding.  
- **Graph-based code representation** using `networkx` and `Neo4j`.  
- **LLM reasoning layer** for contextual code explanations and query responses.  
- **Retrieval-Augmented Generation (RAG)** for precise code snippet retrieval.  

---

## 🧠 Key Features

✔ **Graph-Augmented RAG Engine** – Combines semantic embeddings with knowledge graph traversal for context-aware retrieval.  
✔ **LLM-Powered Code Understanding** – Uses models like GPT, Llama, or CodeT5 for function-level reasoning and explanation.  
✔ **Bug and Anomaly Detection** – Identifies potential vulnerabilities and logic flaws using trained models.  
✔ **Code Summarization** – Generates natural language summaries of source code modules.  
✔ **Multi-language Support** – Works with Python, Java, and C++ source code.  
✔ **Interactive Query System** – Allows natural language questions like *“Where is memory allocation handled in this module?”*  

---

## 🏗️ Tech Stack

| Component | Technology |
|------------|-------------|
| **Language** | Python |
| **Frameworks** | PyTorch, Hugging Face Transformers |
| **LLMs** | GPT, CodeT5, Llama 3 |
| **Graph Tools** | Neo4j, NetworkX |
| **Embeddings** | Sentence Transformers |
| **Backend API** | FastAPI |
| **Vector Store** | ChromaDB |
| **Containerization** | Docker |
| **MLOps** | ClearML for experiment tracking |

---

## 📁 Project Structure

AI-Code-Analysis/
│
├── src/
│ ├── data_preprocessing.py
│ ├── graph_builder.py
│ ├── llm_query_engine.py
│ ├── rag_pipeline.py
│ ├── api_server.py
│
├── notebooks/
│ ├── exploration.ipynb
│ └── visualization.ipynb
│
├── configs/
│ └── model_config.yaml
│
├── requirements.txt
├── Dockerfile
├── README.md
└── LICENSE
