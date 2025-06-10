import os

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "asd"))

system_instruction = {
    "role": "system",
    "content": "Use the following context to answer the user's question.",
}


def query_openai(
    context_chunks: list[str], user_query: str, model="gpt-4o-mini"
):
    context = "\n\n".join(context_chunks)
    messages = [
        system_instruction,
        {
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion: {user_query}",
        },
    ]
    response = client.chat.completions.create(
        model=model, messages=messages, max_tokens=1024, temperature=0.2
    )
    return response.choices[0].message.content
