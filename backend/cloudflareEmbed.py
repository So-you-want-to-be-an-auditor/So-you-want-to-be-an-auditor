# https://developers.cloudflare.com/workers-ai/models/text-embeddings/
# https://redis.io/docs/get-started/vector-database/
# https://medium.com/@dan_43009/how-to-give-your-chatbot-more-memory-f5d64dbd2a3c
# https://redis-py.readthedocs.io/en/stable/examples/search_vector_similarity_examples.html
import hashlib
import os
import dotenv
import requests
import redis
from redis.commands.search.field import TagField, VectorField, TextField
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import Query
import numpy as np
from textSplitter import *
import tiktoken

dotenv.load_dotenv()

CF_API_KEY = os.environ["CLOUDFLARE_API_KEY"]
CLOUDFLARE_ACCOUNT_ID = os.environ["CLOUDFLARE_ACCOUNT_ID"]
API_BASE_URL = os.environ["API_BASE_URL"]
REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]
REDIS_PASSWORD = os.environ["REDIS_PASSWORD"]
headers = {"Authorization": f"Bearer {CF_API_KEY}"}
INFORMATION_INDEX = "information"
VECTOR_DIMENSIONS = 768

INDEX_NAME = "index"
DOC_PREFIX = "doc:"


def connect_redis():
    client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD, decode_responses=True)
    return client


def create_index(client: object, vector_dimensions: int):
    # client.ft(INDEX_NAME).dropindex(delete_documents=True)
    try:
        client.ft(INDEX_NAME).info()
        print("Index already exists!")
    except:
        schema = (
            TagField("tag"),
            TextField("$.url", as_name="url"),
            VectorField("vector",
                        "FLAT", {
                            "TYPE": "FLOAT32",
                            "DIM": vector_dimensions,
                            "DISTANCE_METRIC": "COSINE",
                        }),
        )
        # index Definition
        definition = IndexDefinition(prefix=[DOC_PREFIX], index_type=IndexType.HASH)
        # create Index
        client.ft(INDEX_NAME).create_index(fields=schema, definition=definition)


def run(model: str, input: dict):
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input)
    return response.json()


def generate_embeddings(inputs: dict):
    model = "@cf/baai/bge-base-en-v1.5"
    output = run(model, inputs)
    return output


def write_embeddings(client: object, input: str, url: str):
    # Split descriptions to be within Cloudflare token limit (512)
    split_input = split_string_with_limit(input, 50, tiktoken.get_encoding("cl100k_base"))
    print(split_input)
    response = generate_embeddings({"text": split_input})['result']['data']
    embeddings = np.array(response, dtype=np.float32)

    # Write to Redis
    for i, embedding in enumerate(embeddings):
        client.hset(f"doc:{str((hashlib.sha256(split_input[i].encode('UTF-8'))).hexdigest())}", mapping={
            "vector": embedding.tobytes(),
            "content": split_input[i],
            "tag": "cloudflare",
            "url": url
        })


def query(client: object, user_query: str):
    response = generate_embeddings({"text": user_query})['result']['data']
    query_embedding = np.array(response, dtype=np.float32)

    query = (
        Query("(@tag:{ cloudflare })=>[KNN 2 @vector $vec as score]")
        .sort_by("score")
        .return_fields("content", "tag", "score")
        .paging(0, 2)
        .dialect(2)
    )

    query_params = {"vec": query_embedding.tobytes()}
    print(client.ft(INDEX_NAME).search(query, query_params).docs)


user_query = "Embeddings help you find objects similar to your query"
sample_data = "Embeddings are representations of values or objects like text, images, and audio that are designed to be consumed by machine learning models and semantic search algorithms. They translate objects like these into a mathematical form according to the factors or traits each one may or may not have, and the categories they belong to. Essentially, embeddings enable machine learning models to find similar objects."
sample_url = "https://www.cloudflare.com/learning/ai/what-are-embeddings/"
client = connect_redis()
create_index(client, VECTOR_DIMENSIONS)
write_embeddings(client, sample_data, sample_url)
query(client, user_query)
