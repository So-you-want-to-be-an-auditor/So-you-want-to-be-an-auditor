from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root_dir():
    return {"Query": "Another Endpoint"}


@app.post("/v1/query")
def query_chatbot():
    return {"query": "test", "scores": "test"}