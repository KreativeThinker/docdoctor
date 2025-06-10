import os

from PyPDF2 import PdfReader


def parse_pdf(path):
    reader = PdfReader(path)
    return [page.extract_text() or "" for page in reader.pages]


def parse_txt(path):
    with open(path, "r", encoding="utf-8") as f:
        return [f.read()]


def parse_document(path: str) -> list[str]:
    ext = os.path.splitext(path)[1].lower()
    match ext:
        case ".pdf":
            return parse_pdf(path)
        case ".txt":
            return parse_txt(path)
        case _:
            raise ValueError(f"Unsupported file type: {ext}")
