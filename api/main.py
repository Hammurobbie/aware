from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from routes import register_routes
from sqlmodel import SQLModel
from db import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    SQLModel.metadata.create_all(bind=engine)


app = FastAPI(lifespan=lifespan)

# TODO: Update these after prod backend is set up
origins = [
    "http://localhost",
    "http://localhost:3000/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


internal_router = APIRouter()

register_routes(app, internal_router)
