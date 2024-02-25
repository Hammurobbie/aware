from fastapi import FastAPI, APIRouter
from contextlib import asynccontextmanager
from db import engine
from sqlmodel import SQLModel
from routes import register_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    SQLModel.metadata.create_all(bind=engine)


app = FastAPI(lifespan=lifespan)
internal_router = APIRouter()

register_routes(app, internal_router)
