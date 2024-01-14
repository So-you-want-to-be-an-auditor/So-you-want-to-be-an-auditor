# https://developers.cloudflare.com/workers-ai/models/text-embeddings/
# https://developers.cloudflare.com/workers-ai/models/text-generation/
# https://developers.cloudflare.com/workers-ai/models/translation/
# https://redis.io/docs/get-started/vector-database/
# https://medium.com/@dan_43009/how-to-give-your-chatbot-more-memory-f5d64dbd2a3c
# https://redis-py.readthedocs.io/en/stable/examples/search_vector_similarity_examples.html
import hashlib
import os
import time
import dotenv
import requests
import redis
from redis.commands.search.field import TagField, VectorField, TextField
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import Query
import numpy as np
from textSplitter import *
import tiktoken
from langdetect import detect

dotenv.load_dotenv()

CLOUDFLARE_API_KEY = os.environ["CLOUDFLARE_API_KEY"]
CLOUDFLARE_ACCOUNT_ID = os.environ["CLOUDFLARE_ACCOUNT_ID"]
API_BASE_URL = os.environ["API_BASE_URL"]
REDIS_INFORMATION_HOST = os.environ["REDIS_INFORMATION_HOST"]
REDIS_INFORMATION_PORT = os.environ["REDIS_INFORMATION_PORT"]
REDIS_INFORMATION_PASSWORD = os.environ["REDIS_INFORMATION_PASSWORD"]
REDIS_CHAT_HOST = os.environ["REDIS_CHAT_HOST"]
REDIS_CHAT_PORT = os.environ["REDIS_CHAT_PORT"]
REDIS_CHAT_PASSWORD = os.environ["REDIS_CHAT_PASSWORD"]
headers = {"Authorization": f"Bearer {CLOUDFLARE_API_KEY}"}
INFORMATION_INDEX = "information"
VECTOR_DIMENSIONS = 768
INDEX_NAME = "index"
DOC_PREFIX = "doc:"


def connect_redis_information():
    """
    Connects to the information vector database
    :return: Redis client object
    """
    client = redis.Redis(host=REDIS_INFORMATION_HOST, port=REDIS_INFORMATION_PORT, password=REDIS_INFORMATION_PASSWORD,
                         decode_responses=True)
    return client


def connect_redis_chat():
    """
    Connects to the conversation history vector database
    :return: Redis client object
    """
    client = redis.Redis(host=REDIS_CHAT_HOST, port=REDIS_CHAT_PORT, password=REDIS_CHAT_PASSWORD,
                         decode_responses=True)
    return client


def create_information_index(client: object, vector_dimensions: int):
    """
    Creates index for vector
    :param client: Redis client object
    :param vector_dimensions: Dimensions of embeddings (768 for Cloudflare)
    :return: None
    """
    # Delete index
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
        client.ft(INDEX_NAME).create_information_index(fields=schema, definition=definition)


def create_chat_index(client: object, vector_dimensions: int):
    """
        Creates index for vector
        :param client: Redis client object
        :param vector_dimensions: Dimensions of embeddings (768 for Cloudflare)
        :return: None
    """
    # Delete index
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
        client.ft(INDEX_NAME).create_information_index(fields=schema, definition=definition)


def run(model: str, input: dict):
    """
    Sends requests to Cloudflare Workers AI API
    :param model: Model to be used
    :param input: Input to be processed
    :return: JSON object of Cloudflare response
    """
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input)
    return response.json()


def generate_embeddings(inputs: dict):
    """
    Generates embeddings using Cloudflare model, vector dimensions are 768
    :param inputs: Formatted JSON input
    :return: Vector embeddings dictionary
    """
    model = "@cf/baai/bge-base-en-v1.5"
    output = run(model, inputs)
    return output


def write_information_embeddings(client: object, input: str, url: str):
    """
    Writes embeddings to the information database
    :param client: Redis client object
    :param input: String to be sliced and stored
    :param url: Source of input information
    :return: None
    """
    # Split descriptions to be within Cloudflare token limit (512)
    split_input = split_string_with_limit(input, 300, tiktoken.get_encoding("cl100k_base"))
    # print(split_input)
    # time.sleep(0.2)
    response = generate_embeddings({"text": split_input})
    while not response['success']:
        response = generate_embeddings({"text": split_input})
    # if response['success']:
    response = response['result']['data']
    embeddings = np.array(response, dtype=np.float32)

    # Write to Redis
    for i, embedding in enumerate(embeddings):
        client.hset(f"doc:{str((hashlib.sha256(split_input[i].encode('UTF-8'))).hexdigest())}", mapping={
            "vector": embedding.tobytes(),
            "content": split_input[i],
            "tag": "cloudflare",
            "url": url
        })


def write_chat_embeddings(client: object, input: str, time_stamp: str):
    """
    Writes embeddings to the conversation history database
    :param client: Redis client object
    :param input: String to be sliced and stored (query)
    :param time_stamp: Timestamp of chat message session
    :return: None
    """
    # Split descriptions to be within Cloudflare token limit (512)
    split_input = split_string_with_limit(input, 300, tiktoken.get_encoding("cl100k_base"))
    # print(split_input)
    response = generate_embeddings({"text": split_input})
    while not response['success']:
        response = generate_embeddings({"text": split_input})
    response = response['result']['data']
    embeddings = np.array(response, dtype=np.float32)

    # Write to Redis
    for i, embedding in enumerate(embeddings):
        client.hset(f"doc:{str((hashlib.sha256(split_input[i].encode('UTF-8'))).hexdigest())}", mapping={
            "vector": embedding.tobytes(),
            "content": split_input[i],
            "tag": "cloudflare",
            "time_stamp": time_stamp
        })


def query_information(client: object, user_query: str):
    """
    Queries information database for closest two vectors. Also logs query into database.
    :param client: Redis client object
    :param user_query: User query message
    :return: Returns first closest vector
    """
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
    return client.ft(INDEX_NAME).search(query, query_params).docs[0]['content']


def query_history(client: object, user_query: str, time_stamp: str):
    """
    Queries history database for closest two vectors relating to the user's query. Also logs query into database.
    :param client: Redis client object
    :param user_query: User query message
    :param time_stamp: Timestamp of chat message session
    :return: Closest two vectors
    """
    return_list = []
    response = generate_embeddings({"text": user_query})['result']['data']
    query_embedding = np.array(response, dtype=np.float32)
    # query_str = "(@tag:{ cloudflare } @time_stamp:{ " + str(time_stamp) + " })=>[KNN 2 @vector $vec as score]"
    # print(query_str)
    query_str = "(@tag:{ cloudflare })=>[KNN 2 @vector $vec as score]"
    try:
        query = (
            Query(query_str)
            .sort_by("score")
            .return_fields("content", "tag", "score", "time_stamp")
            .paging(0, 2)
            .dialect(2)
        )
        query_params = {"vec": query_embedding.tobytes()}
        query_response = client.ft(INDEX_NAME).search(query, query_params).docs
        for item in query_response:
            return_list.append(item['content'])
    finally:
        write_chat_embeddings(client, user_query, str(time_stamp))
    return return_list


def chat(chat_client, data_client, user_query: str, time_stamp: str):
    """
    Chatbot with history
    :param chat_client: Redis chat client object
    :param data_client: Redis information client object
    :param user_query: User query message
    :param time_stamp: Timestamp of chat message session
    :return: JSON response from chatbot
    """
    # larger model, runs slower
    # model = "@cf/meta/llama-2-7b-chat-fp16"
    # smaller faster model
    model = "@hf/thebloke/codellama-7b-instruct-awq"
    language = detect(user_query)
    if language != 'en':
        lang_dict = {"en": "english", "fr": "french"}
        language = lang_dict[language]
        translation_model = "@cf/meta/m2m100-1.2b"
        translation_input = {
            "text": user_query,
            "source_lang": language,
            "target_lang": "english"
        }
        response = run(translation_model, translation_input)
        while not response['success']:
            response = run(translation_model, translation_input)
        user_query = response['result']['translated_text']
    history = query_history(chat_client, user_query, time_stamp)
    query_response = query_information(data_client, user_query)
    input = {
        "messages": [
            {"role": "system", "content": "You are a friendly assistant"},
            {"role": "system",
             "content": "Below are some of the relevant questions from previous conversations" + str(history)},
            {"role": "system", "content": "Here is the answer to the user's query: " + query_response},
            {"role": "system",
             "content": "Write an answer to the query below using the above data and limit your response to 100 words"},
            {"role": "user", "content": user_query}
        ]
    }
    response = run(model, input)
    while not response['success']:
        response = run(model, input)
        empty_return = True
        while empty_return:
            try:
                if len(response['result']['response']) <= 1:
                    response = run(model, input)
                else:
                    empty_return = False
            finally:
                print("Failed")
    if language != 'en':
        translation_model = "@cf/meta/m2m100-1.2b"
        translation_input = {
            "text": response['result']['response'],
            "source_lang": "english",
            "target_lang": language
        }
        response = run(translation_model, translation_input)
        while not response['success']:
            response = run(translation_model, translation_input)
        response['result']['response'] = response['result']['translated_text']
    return response


def sample_chat():
    """
    Sample chat query
    :return: None
    """
    time_stamp = str(1705166849)
    # sample_data = [
    #     "What is an embedding?",
    #     "I still don't understand, could you simply it?",
    #     "What benefit do embeddings have for machine learning?"
    # ]
    sample_query = "What is an embedding and why would I use it?"
    client = connect_redis_information()
    create_information_index(client, VECTOR_DIMENSIONS)
    chat_client = connect_redis_chat()
    create_chat_index(chat_client, VECTOR_DIMENSIONS)
    history = []
    # for question in sample_data:
    #     history = query_history(chat_client, question, time_stamp)
    # print(history)
    print(chat(chat_client, client, sample_query, time_stamp))


if __name__ == "__main__":
    # user_query = "What is an embedding?"
    # sample_data = "Embeddings are representations of values or objects like text, images, and audio that are designed to be consumed by machine learning models and semantic search algorithms. They translate objects like these into a mathematical form according to the factors or traits each one may or may not have, and the categories they belong to. Essentially, embeddings enable machine learning models to find similar objects."
    # sample_url = "https://www.cloudflare.com/learning/ai/what-are-embeddings/"
    # write_embeddings(client, sample_data, sample_url)
    # query(client, user_query)
    # current_GMT = time.gmtime()
    # time_stamp = calendar.timegm(current_GMT)
    # print("Current timestamp:", time_stamp)
    sample_chat()

