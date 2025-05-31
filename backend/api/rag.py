from utils import embed_query, query_lm_studio, retrieve_top_chunks


def process_query(query: str, top_k=3) -> str:
    embedding = embed_query(query)
    chunks = retrieve_top_chunks("documents", embedding, top_k=top_k)
    return query_lm_studio(chunks, query)
