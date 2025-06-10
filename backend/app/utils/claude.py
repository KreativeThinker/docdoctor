import os

from anthropic import AI_PROMPT, HUMAN_PROMPT, Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


async def query_claude(
    context_chunks: list[str], user_query: str, model="claude-3-opus-20240229"
):
    context = "\n\n".join(context_chunks)
    prompt = (
        f"{HUMAN_PROMPT} Use the following context to answer the question.\n\n"
        f"Context:\n{context}\n\nQuestion: {user_query}{AI_PROMPT}"
    )

    response = client.completions.create(
        model=model, prompt=prompt, max_tokens_to_sample=1024, temperature=0.2
    )
    return response.completion
