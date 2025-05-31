import requests

system_instruction = {
    "role": "system",
    "content": "Use the following context to answer the user's question.",
}


def query_lm_studio(
    context_chunks: list[str], user_query: str, model="local-model"
):
    context = "\n\n".join(context_chunks)
    messages = [
        system_instruction,
        {
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion: {user_query}",
        },
    ]

    response = requests.post(
        "http://localhost:1234/v1/chat",
        headers={"Content-Type": "application/json"},
        json={
            "model": model,
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": 1024,
        },
    )

    return response.json()["choices"][0]["message"]["content"]
