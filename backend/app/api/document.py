import os
from typing import List, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from prisma.models import Document, Tag

from app.utils import (
    chunk_paragraphs_with_limit,
    delete_embeddings,
    embed_chunks,
    parse_document,
    save_upload_file,
    store_vectors,
)

router = APIRouter(prefix="/api")


@router.get("/documents/")
async def get_all_documents():
    documents = await Document.prisma().find_many(include={"tags": True})
    return {"documents": documents}


@router.post("/documents/upload/")
async def upload_document(
    document: UploadFile = File(...),
    title: str = Form(...),
    tags: Optional[List[str]] = Form(None),
):
    save_path = await save_upload_file(document)
    doc = await Document.prisma().create(
        data={"file": save_path, "title": title, "size": document.size}
    )

    if tags:
        for name in tags:
            tag = await Tag.prisma().upsert(
                where={"name": name.strip()},
                data={"create": {"name": name.strip()}, "update": {}},
            )
            await Document.prisma().update(
                where={"id": doc.id},
                data={"tags": {"connect": [{"id": tag.id}]}},
            )

    await process_document(save_path, str(doc.id))
    return {
        "message": "Uploaded",
        "document_id": doc.id,
        "file_url": save_path,
    }


@router.post("/ask/")
async def ask_question(data: dict):
    document_id = data.get("document_id")
    question = data.get("question")

    if not document_id or not question:
        raise HTTPException(
            status_code=400, detail="Missing document_id or question"
        )

    answer = process_query(question, document_id, top_k=5)
    return {"question": question, "answer": answer}


@router.get("/documents/{document_id}/")
async def get_document_by_id(document_id: int):
    document = await Document.prisma().find_unique(
        where={"id": document_id}, include={"tags": True}
    )
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"metadata": document}


@router.delete("/documents/{document_id}/")
async def delete_document(document_id: int):
    doc = await Document.prisma().find_unique(where={"id": document_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    await delete_chunks(str(document_id))
    await delete_embeddings(str(document_id))

    try:
        os.remove(doc.file)
    except Exception:
        pass

    await Document.prisma().delete(where={"id": document_id})
    return {"message": f"Document {document_id} deleted successfully"}


@router.get("/documents/search/")
async def search_documents(q: str = "", tag: Optional[List[str]] = None):
    filters = []
    if q:
        filters.append({"title": {"contains": q}})
    if tag:
        filters.append({"tags": {"some": {"name": {"in": tag}}}})

    documents = await Document.prisma().find_many(where={"AND": filters})
    return {"documents": documents}


async def store_chunks(document_id: str, chunks: list):
    print(f"Storing {len(chunks)} chunks for document {document_id}")
    from prisma.models import Chunk

    return await Chunk.prisma().create_many(
        data=[
            {
                "document_id": int(document_id),
                "content": chunk,
                "chunk_number": i,
            }
            for i, chunk in enumerate(chunks)
        ]
    )


async def delete_chunks(document_id: str):
    from prisma.models import Chunk

    return await Chunk.prisma().delete_many(
        where={"document_id": int(document_id)}
    )


async def process_document(path: str, document_id: str):
    pages = parse_document(path)
    chunks = await chunk_paragraphs_with_limit(pages)
    await store_chunks(document_id, chunks)

    embeddings = await embed_chunks(chunks)
    ids = [f"{document_id}_{i}" for i in range(len(chunks))]
    metadatas = [
        {"document_id": document_id, "chunk_index": i}
        for i in range(len(chunks))
    ]
    await store_vectors("documents", ids, embeddings, metadatas, chunks)


async def process_query(query: str, document_id: str, top_k=5) -> str:
    from utils import embed_query, query_lm_studio, retrieve_top_chunks

    embedding = await embed_query(query)
    chunks = await retrieve_top_chunks(
        "documents", embedding, document_id, top_k=top_k
    )
    return await query_lm_studio(chunks, query)
