from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def land():
    return "Welcome to Awarenest!"


@router.get("/healthcheck")
async def read_root():
    return {"status": "ok"}
