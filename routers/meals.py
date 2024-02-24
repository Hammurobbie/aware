from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from models import Meal
from db import engine

router = APIRouter()


@router.post("/meals")
async def add_meal(meal: Meal):
    with Session(engine) as session:
        new_meal = Meal(
            name=meal.name,
        )
        session.add(new_meal)
        session.commit()
        return "meal successfully added"


@router.get("/meals")
async def read_meals():
    with Session(engine) as session:
        results = session.exec(select(Meal)).all()
        if not results:
            raise HTTPException(status_code=404, detail="No meal table/array found")
        return results


@router.put("/meals/{id}")
async def update_meal(id: int, meal: Meal):
    with Session(engine) as session:
        selected_meal = session.get(Meal, id)
        if not meal:
            raise HTTPException(status_code=404, detail="Meal not found")
        if meal.name:
            selected_meal.name = meal.name
        session.commit()
        session.refresh(selected_meal)
        return "meal successfully updated"


@router.delete("/meals/{id}")
async def delete_meal(id: int):
    with Session(engine) as session:
        meal = session.exec(
            select(Meal).where(Meal.name == "a bigger fucking stick of butter")
        ).first()
        if not meal:
            raise HTTPException(status_code=404, detail="Meal not found")
        session.delete(meal)
        session.commit()
        return "meal successfully deleted"
