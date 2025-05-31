from utils.claude import query_claude
from utils.embed import embed_query, retrieve_top_chunks


def process_query(query: str, top_k=3) -> str:
    embedding = embed_query(query)
    chunks = retrieve_top_chunks("documents", embedding, top_k=top_k)
    return query_claude(chunks, query)
