from api.models import Chunk
from utils import (
    chunk_paragraphs_with_limit,
    embed_chunks,
    parse_document,
    store_vectors,
)


def store_chunks(doc_id: str, chunks: list):
    Chunk.objects.bulk_create(
        [
            Chunk(document_id=doc_id, content=chunk, chunk_number=i)
            for i, chunk in enumerate(chunks)
        ]
    )


def delete_chunks(doc_id: str):
    Chunk.objects.filter(document_id=doc_id).delete()


def delete_embeddings(doc_id: str):
    from utils.embed import client

    collection = client.get_collection("documents")
    collection.delete(where={"doc_id": doc_id})


def process_document(path: str, doc_id: str):
    pages = parse_document(path)
    chunks = chunk_paragraphs_with_limit(pages)

    store_chunks(doc_id, chunks)

    embeddings = embed_chunks(chunks)
    ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
    metadatas = [
        {"doc_id": doc_id, "chunk_index": i} for i in range(len(chunks))
    ]

    store_vectors("documents", ids, embeddings, metadatas, chunks)
