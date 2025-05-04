import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
from typing import List
import rag_chatbot

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#PYDANTIC BASE MODELS
class QuestionRequest(BaseModel):
    userMessage: str
    
class Document(BaseModel):
    content: str

class DocumentPayload(BaseModel):
    documents: List[Document]


#############################
# ROUTES
#############################
@app.post('/rag/get_context')
def get_context_route(request: QuestionRequest):
    try:
        docs = rag_chatbot.get_context(request.userMessage)
        return JSONResponse(
            content = {
                "context": docs,
                "message": "success"
            },
            status_code=200
        )
    except Exception as e:
        print(e)
        return JSONResponse(
            content={
                "message": "failed"
            },
            status_code=400
        )


@app.post('/rag/process_data')
async def process_data_route(payload: DocumentPayload):
    try:
        rag_chatbot.process_data([doc.content for doc in payload.documents])
        return JSONResponse(
            content={
                "message": "success"
            },
            status_code=200
        )
    except Exception as e:
        print(e)
        return JSONResponse(
            content={
                "message": "failed"
            },
            status_code=400
        )
     

if __name__ == "__main__":
    uvicorn.run(app, port=8000)