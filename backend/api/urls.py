from django.urls import path

from api import views

urlpatterns = [
    path("ping/", views.ping),
    path("ask/", views.ask_question),
    path("documents/", views.get_all_documents),
    path("documents/upload/", views.upload_document),
    path("documents/<int:document_id>/", views.document_action),
    path("documents/<int:document_id>/metadata/", views.get_document_metadata),
]
