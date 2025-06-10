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
    col = await client.get_or_create_collection(name=collection_name)
    await col.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas,
        documents=documents,
    )


async def retrieve_top_chunks(
    collection_name: str,
    query_embedding: list[float],
    document_id: str,
    top_k: int = 3,
) -> list[str]:
    col = await client.get_collection(name=collection_name)
    results = await col.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents"],
        where={"document_id": document_id},
    )
    docs = results.get("documents")
    return docs[0] if docs else []


async def delete_embeddings(document_id: str):
    col = await client.get_collection(name="documents")
    await col.delete(where={"document_id": document_id})
