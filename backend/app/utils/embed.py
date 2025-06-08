from chromadb import AsyncHttpClient
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

client = None


async def init_client():
    global client
    if client is None:
        client = await AsyncHttpClient(
            host="localhost",
            port=3002,
        )


async def embed_chunks(chunks: list[str]) -> list[list[float]]:
    return model.encode(chunks).tolist()


async def embed_query(query: str) -> list[float]:
    return model.encode(query).tolist()


async def store_vectors(
    collection_name: str,
    ids: list[str],
    embeddings: list[list[float]],
    metadatas: list[dict],
    documents: list[str],
):
    col = client.get_or_create_collection(collection_name)
    col.add(
        ids=ids,
        embeddings=embeddings,  # type: ignore
        metadatas=metadatas,  # type: ignore
        documents=documents,
    )


async def retrieve_top_chunks(
    collection_name: str,
    query_embedding: list[float],
    document_id: str,
    top_k: int = 3,
) -> list[str]:
    col = client.get_collection(collection_name)
    results = col.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents"],  # type: ignore
        where={"doc_id": document_id},
    )
    __import__("pprint").pprint(results)
    docs = results.get("documents")
    if not docs:
        return []

    return docs[0]
