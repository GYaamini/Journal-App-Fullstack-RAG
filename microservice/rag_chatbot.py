from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.docstore.document import Document
from typing import List
from collections import OrderedDict

DEVICE = "cpu"
conversation_retrieval_chain = None
embeddings = None
db = None

def init():
    global embeddings
    
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device":DEVICE}
    )

def process_data(texts: List[str]):
    global db

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=64)
    documents = []
    
    # Create Metadata before embedding
    for txt in texts:
        lines = txt.split('\n')
        try:
            title = lines[0].replace("Title: ", "").strip()
            date = lines[1].replace("Date: ", "").strip()
            tags = lines[2].replace("Tags: ", "").strip().split(",")
            content = "\n".join(lines[4:])  # Skip "Content:" line and blank line

            tags_str = ", ".join(tags)
            
            doc = Document(
                page_content=f"Title: {title}\nDate: {date}\nTags: {tags_str}\n\n{content}",
                metadata={
                    "title": title,
                    "date": date,
                    "tags": tags_str
                }
            )
            
            chunks = text_splitter.split_documents([doc])
            documents.extend(chunks)

        except Exception as e:
            print(e)
            return
        
    db = Chroma.from_documents(documents, embedding=embeddings)
    

def get_context(question):
    if not db:
        return []
    
    # docs = db.as_retriever(
    #     search_type="mmr",
    #     search_kwargs={'k': 6, 'lambda_mult': 0.25}
    # ).get_relevant_documents(question)
    
    docs = db.as_retriever(
        search_type="similarity",
        search_kwargs={'k': 4}
    ).invoke(question)
    
    def actual_context(page_content):
        if "Content:" in page_content:
            return 'Content: ' + str(page_content).split('Content:')[1].strip()
        return page_content
            
    context_with_metadata = OrderedDict()
    for doc in docs:
        key = (doc.metadata.get("title"),doc.metadata.get("date"))
        if key not in context_with_metadata:
            context_with_metadata[key] = {
                "title": doc.metadata.get("title"),
                "date": doc.metadata.get("date"),
                "tags": doc.metadata.get("tags"),
                "content": actual_context(doc.page_content)
            }

    return list(context_with_metadata.values())
    
init()