# https://developers.cloudflare.com/workers-ai/models/text-embeddings/
# https://redis.io/docs/get-started/vector-database/
# https://medium.com/@dan_43009/how-to-give-your-chatbot-more-memory-f5d64dbd2a3c
# https://redis-py.readthedocs.io/en/stable/examples/search_vector_similarity_examples.html
import os
import dotenv
import requests
import json
import time

import numpy as np
import pandas as pd
import redis
from redis.commands.search.field import (
    NumericField,
    TagField,
    TextField,
    VectorField,
)
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import Query
from sentence_transformers import SentenceTransformer
from textSplitter import *
import tiktoken

dotenv.load_dotenv()

CF_API_KEY = os.environ["CLOUDFLARE_API_KEY"]
API_BASE_URL = os.environ["API_BASE_URL"]
REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]
REDIS_PASSWORD = os.environ["REDIS_PASSWORD"]
headers = {"Authorization": f"Bearer {CF_API_KEY}"}
# INFORMATION_INDEX = "idx:information_vss"
INFORMATION_INDEX = "information"
DOC_PREFIX = "doc:"


def run(model, input):
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input)
    return response.json()


def generate_embeds(inputs):
    model = "@cf/baai/bge-base-en-v1.5"
    output = run(model, inputs)
    return output


def chat(prompt: str):
    model = "@cf/meta/llama-2-7b-chat-int8"
    inputs = {
        "messages": [
            {"role": "system", "content": "You are a friendly assistant that specializes in finance"},
            {"role": "user", "content": prompt}
        ]
    }
    output = run(model, inputs)
    return output


def connect_redis():
    client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD, decode_responses=True)
    return client


def initialize_database(client):
    # Fetching sample data
    url = "https://gist.githubusercontent.com/jamesliangg/7f6155ebea0fbd30932676c944019d21/raw/69a16f71e39f5e00b7b1f179e20c79969457bbea/sample_data.json"
    response = requests.get(url)
    information = response.json()
    # print(json.dumps(information[0], indent=2))

    # Storing data in database
    pipeline = client.pipeline()
    j = 1
    for info in information:
        # Split descriptions to be within Cloudflare token limit (512)
        descriptions = split_string_with_limit(info['description'], 300, tiktoken.get_encoding("cl100k_base"))
        for description in descriptions:
            redis_key = f"information:{j:03}"
            json_info = {
                "source_url": info['source_url'],
                "description": description,
                "date_modified": info['date_modified']
            }
            pipeline.json().set(redis_key, "$", json_info)
            j += 1
    pipeline.execute()
    # res = client.json().get("information:002", "$.model")
    # print(res)

    # Create and store vector embeddings
    keys = sorted(client.keys("information:*"))
    print(keys)
    descriptions = client.json().mget(keys, "$.description")
    descriptions = [item for sublist in descriptions for item in sublist]
    embeddings = generate_embeds({"text": descriptions})['result']['data']
    VECTOR_DIMENSION = len(embeddings)
    print(VECTOR_DIMENSION)
    pipeline = client.pipeline()
    for key, embedding in zip(keys, embeddings):
        pipeline.json().set(key, "$.description_embeddings", embedding)
    pipeline.execute()
    # res = client.json().get("information:002")
    # print(res)

    # Create schema
    # schema = (
    #     TextField("$.source_url", as_name="source_url"),
    #     TextField("$.description", as_name="description"),
    #     TextField("$.date_modified", as_name="date_modified"),
    #     VectorField(
    #         "$.description_embeddings",
    #         "FLAT",
    #         {
    #             "TYPE": "FLOAT32",
    #             "DIM": VECTOR_DIMENSION,
    #             "DISTANCE_METRIC": "COSINE",
    #         },
    #         as_name="vector",
    #     ),
    # )
    # definition = IndexDefinition(prefix=["information:"], index_type=IndexType.JSON)
    # res = client.ft(INFORMATION_INDEX).create_index(
    #     fields=schema, definition=definition
    # )
    # # Verify success
    # info = client.ft(INFORMATION_INDEX).info()
    # num_docs = info["num_docs"]
    # indexing_failures = info["hash_indexing_failures"]
    # print(f"{num_docs} documents indexed with {indexing_failures} failures")


def query_embeds(client):
    queries = [
        "Taxable amount of dividends for Canadian companies"
    ]
    embeddings = np.array(generate_embeds({"text": queries})['result']['data'][0], dtype=np.float32)
    # print(encoded_queries)
    VECTOR_DIMENSIONS = 768
    query = (
        Query('(*)=>[KNN 3 @vector $query_vector AS vector_score]')
        .sort_by('vector_score')
        .return_fields('vector_score', 'id', 'source_url', 'date_modified', 'description')
        .dialect(2)
    )
    # create_query_table(client, query, queries, encoded_queries)
    # result_docs = client.ft(INFORMATION_INDEX).search(query, {'query_vector': np.array(encoded_queries[0], dtype=np.float32).tobytes()}).docs
    # print(result_docs)
    query = (
        Query("*=>[KNN 2 @vector $vec as score]")
        .sort_by("score")
        .return_fields("id", "score")
        .paging(0, 2)
        .dialect(2)
    )

    query_params = {
        "vec": embeddings.tobytes()
    }
    print(client.ft(INFORMATION_INDEX).search(query, query_params).docs)


def create_query_table(client, query, queries, encoded_queries, extra_params={}):
    results_list = []
    for i, encoded_query in enumerate(encoded_queries):
        result_docs = (
            client.ft(INFORMATION_INDEX)
            .search(
                query,
                {
                    "query_vector": np.array(
                        encoded_query, dtype=np.float32
                    ).tobytes()
                }
                | extra_params,
            )
            .docs
        )
        for doc in result_docs:
            vector_score = round(1 - float(doc.vector_score), 2)
            results_list.append(
                {
                    "query": queries[i],
                    "score": vector_score,
                    "id": doc.id,
                    "source_url": doc.source_url,
                    "date_modified": doc.date_modified,
                    "description": doc.description,
                }
            )
    print(results_list)

    # Optional: convert the table to Markdown using Pandas
    # queries_table = pd.DataFrame(results_list)
    # queries_table.sort_values(
    #     by=["query", "score"], ascending=[True, False], inplace=True
    # )
    # queries_table["query"] = queries_table.groupby("query")["query"].transform(
    #     lambda x: [x.iloc[0]] + [""] * (len(x) - 1)
    # )
    # queries_table["description"] = queries_table["description"].apply(
    #     lambda x: (x[:497] + "...") if len(x) > 500 else x
    # )
    # queries_table.to_markdown(index=False)



def create_index(client, vector_dimensions: int):
    try:
        # check to see if index exists
        client.ft(INFORMATION_INDEX).info()
        print("Index already exists!")
    except:
        # schema
        schema = (
            TextField("$.source_url", as_name="source_url"),
            TextField("$.description", as_name="description"),
            TextField("$.date_modified", as_name="date_modified"),
            VectorField(
                "$.description_embeddings",
                "FLAT",
                {
                    "TYPE": "FLOAT32",
                    "DIM": vector_dimensions,
                    "DISTANCE_METRIC": "COSINE",
                },
                as_name="vector",
            ),
        )
        # index Definition
        definition = IndexDefinition(prefix=[DOC_PREFIX], index_type=IndexType.HASH)
        # create Index
        client.ft(INFORMATION_INDEX).create_index(fields=schema, definition=definition)


example_input = {"text": "Tell me a joke about Cloudflare"}
example_prompt = "Tell me a joke about Cloudflare"
# print(generate_embeds(example_input)['result']['data'])
# print(chat(example_prompt))
client = connect_redis()
# initialize_database(client)
query_embeds(client)
# create_index(client, 768)