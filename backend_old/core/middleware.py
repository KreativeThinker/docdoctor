from core import settings


class FrameOptionsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["X-Frame-Options"] = f"ALLOW-FROM {settings.FRONTEND_URL}"
        return response
