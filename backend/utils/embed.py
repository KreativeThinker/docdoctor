import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_chunks(chunks: list[str]) -> list[list[float]]:
    return model.encode(chunks).tolist()


client = chromadb.Client(
    Settings(
        chroma_api_impl="rest",
        chroma_server_host="localhost",  # or your host IP
        chroma_server_http_port=3002,
    )
)


def store_vectors(
    collection_name: str,
    ids: list[str],
    embeddings: list[list[float]],
    metadatas: list[dict],
    documents: list[str],
):
    col = client.get_or_create_collection(collection_name)
    col.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas,
        documents=documents,
    )
