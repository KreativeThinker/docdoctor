from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import document
from app.core import config
from app.utils import init_client
from prisma import Prisma

app = FastAPI()
db = Prisma(auto_register=True)
print(config.MEDIA_DIR)
print(list(config.MEDIA_DIR.iterdir()))


@asynccontextmanager
async def lifespan(_: FastAPI):

    app.mount(
        "/media",
        StaticFiles(directory=str(config.MEDIA_DIR.resolve())),
        name="media",
    )
    await db.connect()
    await init_client()
    yield
    await db.disconnect()


app = FastAPI(lifespan=lifespan)
app.include_router(document.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
