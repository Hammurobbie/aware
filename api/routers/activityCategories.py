from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from models import ActivityCategory
from db import engine

router = APIRouter()


@router.post("/activity_categories")
async def add_activity_category(category: ActivityCategory):
    with Session(engine) as session:
        new_category = ActivityCategory(name=category.name)
        session.add(new_category)
        session.commit()
        return "Activity category successfully added"


@router.get("/activity_categories")
async def read_activity_categories():
    with Session(engine) as session:
        results = session.exec(select(ActivityCategory)).all()
        if not results:
            raise HTTPException(
                status_code=404, detail="No activity categories table/array found"
            )
        return results


@router.get("/activity_categories/{id}")
async def read_activity_categories(id: int):
    with Session(engine) as session:
        result = session.get(ActivityCategory, id)
        if not result:
            raise HTTPException(status_code=404, detail="Activity category not found")
        return result


@router.put("/activity_categories/{id}")
async def update_activity_category(id: int, category: ActivityCategory):
    with Session(engine) as session:
        selected_category = session.get(ActivityCategory, id)
        if not category:
            raise HTTPException(status_code=404, detail="Activity category not found")
        if category.name:
            selected_category.name = category.name
        session.commit()
        session.refresh(selected_category)
        return "Activity category successfully updated"


@router.delete("/activity_categories/{id}")
async def delete_activity_category(id: int):
    with Session(engine) as session:
        category = session.get(ActivityCategory, id)
        if not category:
            raise HTTPException(status_code=404, detail="Activity category not found")
        session.delete(category)
        session.commit()
        return "Activity category successfully deleted"
