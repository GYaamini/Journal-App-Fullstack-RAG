# 📝 Journal Journey - AI-Powered Reflective Journal

| Dark Theme | Light Theme |
| ------ | ------ |
| ![Journal Journey Dark](https://github.com/user-attachments/assets/da676633-3e2b-4f61-9848-c9c78a99b76c) | ![Journal Journey Light](https://github.com/user-attachments/assets/aef39202-4906-4681-a637-18798feee320) |

---
## ✨ Features
- **Conversational Journal Search** - Ask questions in natural language about past entries
- **Specific Tag Search** - Retrieve journal entries with specific tag/tags
- **Automatic Tag Suggestion** - Dynamically generates tags in real-time as the user types, using keyword extraction from the content input
- **Timeline** - Visualize Journal Journey with dynamic year-timeline
- **CRUD Functionality** - Create, Manipulate, and Query journal entries
- **CI/CD using GitHub Actions** - Containerized with **Docker** and Deployed on **Render** 
- **Light and Dark Mode** - Personalized user interface experience with light and dark mode options.

| Chatbox | Tag Search |
| ------ | ------ |
| ![Chatbox Dark](https://github.com/user-attachments/assets/bec0c662-4b7c-4696-9175-739429ed47f3) <br> ![Chatbox Light](https://github.com/user-attachments/assets/9ca83a20-c269-423c-888d-c50dc5e88789) | ![Tag Search](https://github.com/user-attachments/assets/83b7eff2-0701-4f78-bf90-54b6d698a532) |

| Create | View | Edit |
| ------ | ------ | ------ |
| ![Journal Create](https://github.com/user-attachments/assets/f9898889-12c2-4584-a942-7150b91db697) | ![Journal View](https://github.com/user-attachments/assets/cae843ba-0de5-48d9-a05f-98f52a1a5cf8) | ![Journal Edit](https://github.com/user-attachments/assets/111c5e24-87bc-4b2d-a219-daa11c3d93ab) |

---
## 🛠 Tech Stack
### Frontend
- React (Vite) + JavaScript
- Context API (State Management)

### Backend
- Express.js
- MongoDB + Mongoose (Journal Storage)

### RAG Microservice
- FastAPI (Python ML Service)
- LangChain (Content Processing)
- ChromaDB (Vector Store)
- GPT-4o LLM(Conversational AI)

### Keyword Extraction
- GPT-4o LLM with Sonar-Reasoning as fallback model

---
## ⚙️ Conversational RAG Architecture
### RAG processing Journal data
```mermaid
graph TD
A[New or modified Journal entry] --> B[FastAPI]
B --> C[Chunking]
C --> D[Embedding with Metadata]
D --> E[ChromaDB]
```

### User query handling
```mermaid
graph LR
F[User Question] --> G[Express]
G --> H[FastAPI]
H --> I[Semantic Search]
I --> J[LLM Processing]
J --> K[Contextual Answer]
```

---
## Run the App Locally

1. Clone the repository

2. Navigate to the project directory
    ```bash
    cd Journal-App-Fullstack-RAG
    ```

3. Set up Frontend
    ```bash
    cd frontend
    ```
   * App.jsx under ./src
        * For development BASE_URL, set VITE_BASE_URL = http://127.0.0.1:5000 under .env in the frontend root folder
        * For Vite, import statement: import.meta.env.VITE_BASE_URL
        * For production BASE_URL, set VITE_BASE_URL = https://repo-name.onrender.com under environmental variables on Render 
   
   * Note:  'npm run build' command generated build output in '../backend/dist' folder, as backend is configured to serve React static files. Change output directory (outdir) if necessary.

    ```bash
    npm install
    npm run build
    ```

5. Set up Backend
    ```bash
    cd ../backend
    python3 -m venv venv
    venv\Scripts\activate   ## on MacOS and Linux : source venv/bin/activate
    pip install -r requirements.txt
    ```
    ```bash
    npm install

    nodemon server.js 
    or 
    node server.js
    ```
    * .env in the backend root folder should contain the following
        * DB_PASSWORD, DB_USERNAME: MongoDB password and username
        * PORT=5000
        * RAG_MICROSERVICE_BASE_URL=http://localhost:8000

6. Set up Rag Microservice
    ```bash
    cd ../microservice
    python3 -m venv venv
    venv\Scripts\activate   ## on MacOS and Linux : source venv/bin/activate
    pip install -r requirements.txt

    python -u app.py --reload
    or
    uvicorn app:app --host 127.0.0.1 --port 8000

    ```

7. Open browser and go to `http://localhost:5000/` to view the application


### Run services
docker-compose up -d  # or start each service manually

---
## Acknowledgements
The base structure of this project is inspired by : [Coding with Kevin](https://www.youtube.com/watch?v=D9ByRLPg-J4&list=PLZ81O7amWFO_WotG-TJfjfi3YlSbShPS7&ab_channel=CodingwithKevin)

