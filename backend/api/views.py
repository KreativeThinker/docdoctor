from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def ping(_):
    return Response({"message": "pong"})


@api_view(["GET"])
def get_all_documents(_):
    return Response({"documents": []})


@api_view(["GET"])
def get_document_metadata(_, document_id):
    return Response(
        {
            "document_id": document_id,
            "metadata": {
                "created_at": "2023-10-01T12:00:00Z",
            },
        }
    )


@api_view(["POST"])
def upload_document(request):
    # Simulate document upload logic
    document = request.data.get("document")
    if not document:
        return Response({"error": "No document provided"}, status=400)

    # Here you would typically save the document and return its ID
    return Response(
        {"message": "Document uploaded successfully", "document_id": 1}
    )


@api_view(["POST"])
def ask_question(request):
    question = request.data.get("question")
    if not question:
        return Response({"error": "No question provided"}, status=400)

    # Simulate answering the question
    answer = f"Answer to '{question}'"
    return Response({"question": question, "answer": answer})


@api_view(["GET", "DELETE"])
def document_action(_, document_id):
    if _.method == "GET":
        return get_document_by_id(_, document_id)
    elif _.method == "DELETE":
        return delete_document(_, document_id)


def get_document_by_id(_, document_id):
    return Response(
        {"document_id": document_id, "content": "Sample content for document."}
    )


def delete_document(_, document_id):
    # Simulate document deletion logic
    if not document_id:
        return Response({"error": "Document ID not provided"}, status=400)

    # Here you would typically delete the document and confirm deletion
    return Response(
        {"message": f"Document {document_id} deleted successfully"}
    )
