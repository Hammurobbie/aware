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


@app.get("/v0/version")
def version():
    print("version", app.version)


version()


origins = [
    "http://localhost:3000",
    "https://aware-puce.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


internal_router = APIRouter()

register_routes(app, internal_router)
