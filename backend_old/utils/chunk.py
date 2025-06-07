from langchain.text_splitter import RecursiveCharacterTextSplitter


def chunk_paragraphs_with_limit(
    pages: list[str], chunk_size=500, chunk_overlap=50
) -> list[str]:
    paragraphs = []
    for page in pages:
        paragraphs.extend([p.strip() for p in page.split("\n\n") if p.strip()])

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    return splitter.split_text("\n\n".join(paragraphs))
