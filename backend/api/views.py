from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.document import delete_chunks, delete_embeddings, process_document
from api.models import Document, Tags
from api.rag import process_query
from api.serializers import DocumentSerializer


@api_view(["GET"])
def get_all_documents(_):
    documents = Document.objects.all()
    return Response(
        {"documents": DocumentSerializer(documents, many=True).data},
        status=200,
    )


@api_view(["POST"])
def upload_document(request):
    file = request.data.get("document")
    tags = request.data.getlist("tags")
    title = request.data.get("title")

    if not file:
        return Response({"error": "No document provided"}, status=400)

    document = Document.objects.create(file=file, title=title, size=file.size)
    process_document(document.file.path, str(document.id))

    if tags:
        for tag_name in tags:
            tag, _ = Tags.objects.get_or_create(name=tag_name.strip())
            document.tags.add(tag)

    return Response(
        {
            "message": "Document uploaded successfully",
            "document_id": document.id,
            "file_url": document.file.url,
        },
        status=201,
    )


@api_view(["POST"])
def ask_question(request):
    question = request.data.get("question")
    if not question:
        return Response({"error": "No question provided"}, status=400)

    # Simulate answering the question
    answer = process_query(question, top_k=3)
    return Response({"question": question, "answer": answer}, status=200)


@api_view(["GET", "DELETE"])
def document_action(_, document_id):
    if _.method == "GET":
        return get_document_by_id(_, document_id)
    elif _.method == "DELETE":
        return delete_document(_, document_id)


def get_document_by_id(_, document_id):
    document = get_object_or_404(Document, id=document_id)
    return Response(
        {"metadata": DocumentSerializer(document).data}, status=200
    )


def delete_document(_, document_id):
    document = get_object_or_404(Document, id=document_id)
    delete_chunks(document_id)
    delete_embeddings(document_id)
    document.file.delete(save=False)
    document.delete()

    return Response(
        {"message": f"Document {document.id} deleted successfully"}, status=200
    )


@api_view(["GET"])
def search_documents(request):
    query = request.query_params.get("q", "")
    tag_filter = request.query_params.getlist("tag")

    documents = Document.objects.all()

    if query:
        documents = documents.filter(title__icontains=query)

    if tag_filter:
        documents = documents.filter(tags__name__in=tag_filter).distinct()

    return Response(
        {"documents": DocumentSerializer(documents, many=True).data},
        status=200,
    )
