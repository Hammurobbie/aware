from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from models import Emotion
from db import engine

router = APIRouter()


@router.post("/emotions")
async def add_emotion(emotion: Emotion):
    with Session(engine) as session:
        new_emotion = Emotion(
            name=emotion.name,
        )
        session.add(new_emotion)
        session.commit()
        return "emotion successfully added"


@router.get("/emotions")
async def read_emotions():
    with Session(engine) as session:
        results = session.exec(select(Emotion)).all()
        if not results:
            raise HTTPException(status_code=404, detail="No emotion table/array found")
        return results


@router.put("/emotions/{id}")
async def update_emotion(id: int, emotion: Emotion):
    with Session(engine) as session:
        selected_emotion = session.get(Emotion, id)
        if not emotion:
            raise HTTPException(status_code=404, detail="Emotion not found")
        if emotion.name:
            selected_emotion.name = emotion.name
        session.commit()
        session.refresh(selected_emotion)
        return "emotion successfully updated"


@router.delete("/emotions/{id}")
async def delete_emotion(id: int):
    with Session(engine) as session:
        emotion = session.get(Emotion, id)
        if not emotion:
            raise HTTPException(status_code=404, detail="Emotion not found")
        session.delete(emotion)
        session.commit()
        return "emotion successfully deleted"
