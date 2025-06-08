from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import document
from app.core import config
from app.utils import init_client
from prisma import Prisma

app = FastAPI()
db = Prisma(auto_register=True)


@asynccontextmanager
async def lifespan(_: FastAPI):
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
