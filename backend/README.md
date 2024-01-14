## Getting Started
### Folder Structure
```yaml
.
├── cloudflareEmbed.py    # All embedding and chatbot functions
├── main.py               # FastAPI main file
├── README.md
├── requirements.txt
├── sample_data.json      # Sample data to import
└── textSplitter.py       # Splits text into smaller pieces

```
### Preparing Redis Databases
1. Create two Redis Cloud databases (one for history, one for information)
### Preparing Environment
1. `cd` into this directory and create a virtual environment `python3.11 -m venv venv`
2. Activate the environment `source venv/bin/activate`
3. Install all modules `pip install -r requirements.txt`
4. Create a `.env` file in the root directory similar to below
```markdown
CLOUDFLARE_API_KEY=<CLOUDFLARE_API_KEY>
CLOUDFLARE_ACCOUNT_ID=<CLOUDFLARE_ACCOUNT_ID>
API_BASE_URL=<API_BASE_URL>
REDIS_INFORMATION_HOST=<REDIS_INFORMATION_HOST>
REDIS_INFORMATION_PORT=<REDIS_INFORMATION_PORT>
REDIS_INFORMATION_PASSWORD=<REDIS_INFORMATION_PASSWORD>
REDIS_CHAT_HOST=<REDIS_CHAT_HOST>
REDIS_CHAT_PORT=<REDIS_CHAT_PORT>
REDIS_CHAT_PASSWORD=<REDIS_CHAT_PASSWORD>
```
> The first three environment variables are from Cloudflare. Must create a [Workers AI API key](https://developers.cloudflare.com/workers-ai/get-started/rest-api/).
### Importing the Dataset to Redis
1. Change `url` in `cloudflareEmbed.py` to the where the sample JSON is
1. Run `python cloudflareEmbed.py` and wait for completion
   - If you have many examples, you may want to add a sleep timer to not barrage Redis and the embedding API
### Running the Server
1. Run `uvicorn main:app  --reload --host 0.0.0.0 --port 8000`
### Getting Results
1. The server is hosted on port `8000`. Send POST request to `http://127.0.0.1:8000/v1/query`

Example JSON body
```json
{
    "query": "Why would I use an embedding?",
    "time_stamp": "1705166849"
}
```
## Docker
### Building Container
1. Run `docker buildx build --platform=linux/amd64 --output type=docker -t jamesliangg/<CONTAINER_NAME> .`
1. Push to Docker Hub using `docker push jamesliangg/<CONTAINER_NAME>`
### Running Container
1. Create a `.env` file in the directory you're running the `run`, example is in [Preparing Environment](#Preparing Environment)
1. Run `docker run -p 8000:8000 --env-file ./.env --platform linux/amd64 -d jamesliangg/<CONTAINER_NAME>`