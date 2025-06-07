import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import MEDIA_DIR

ALLOWED_MIME_TYPES = {"application/pdf", "text/plain"}


async def save_upload_file(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise ValueError("Unsupported file type")

    if not file.filename:
        raise ValueError("Filename is required")
    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    destination = MEDIA_DIR / filename

    with destination.open("wb") as buffer:
        while content := await file.read(1024 * 1024):
            buffer.write(content)

    return str(destination)
