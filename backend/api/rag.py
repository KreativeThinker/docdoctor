from utils import embed_query, query_lm_studio, retrieve_top_chunks


def process_query(query: str, document_id: str, top_k=5) -> str:
    embedding = embed_query(query)
    chunks = retrieve_top_chunks(
        "documents", embedding, document_id, top_k=top_k
    )
    return query_lm_studio(chunks, query)
