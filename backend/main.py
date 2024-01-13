from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cloudflareEmbed import connect_redis_information, connect_redis_chat, create_information_index, create_chat_index, chat

app = FastAPI()

origins = ["*"]
VECTOR_DIMENSIONS = 768

# Deal with CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Chat(BaseModel):
    time_stamp: str
    query: str


@app.get("/")
def root_dir():
    return {"Query": "Another Endpoint"}


@app.post("/v1/query")
def query_chatbot(chat_obj: Chat):
    client = connect_redis_information()
    create_information_index(client, VECTOR_DIMENSIONS)
    chat_client = connect_redis_chat()
    create_chat_index(chat_client, VECTOR_DIMENSIONS)
    response = chat(chat_client, client, chat_obj.query, chat_obj.time_stamp)
    return {"query": chat_obj.query, "time_stamp": chat_obj.time_stamp, "result": response['result']}
