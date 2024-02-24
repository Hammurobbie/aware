from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from models import Activity, ActivityCategory
from db import engine

router = APIRouter()


@router.post("/activities")
async def add_activity(activity: Activity):
    with Session(engine) as session:
        has_new_cat = not activity.category_id and activity.category
        new_activity = Activity(
            name=activity.name,
            category=None,
            category_id=(
                await add_activity_category(activity.category)
                if has_new_cat
                else activity.category_id
            ),
            start=activity.start,
            stop=activity.stop,
        )
        session.add(new_activity)
        session.commit()
        return "activity successfully added"


@router.get("/activities")
async def read_activities():
    with Session(engine) as session:
        statement = select(Activity, ActivityCategory).join(
            ActivityCategory, isouter=True
        )
        results = session.exec(statement).all()
        result = []
        for act, act_cat in results:
            act.category = None if not act_cat else act_cat.name
            result.append(act)
        if not results:
            raise HTTPException(status_code=404, detail="No activity table/array found")
        return result


@router.get("/activities/{id}")
async def read_activity(id: int):
    with Session(engine) as session:
        statement = (
            select(Activity, ActivityCategory)
            .join(ActivityCategory, isouter=True)
            .where(Activity.id == id)
        )
        result = session.exec(statement).first()
        if not result:
            raise HTTPException(status_code=404, detail="Activity not found")
        act, act_cat = result
        act.category = None if not act_cat else act_cat.name
        return act


@router.put("/activities/{id}")
async def update_activity(id: int, activity: Activity):
    with Session(engine) as session:
        selected_activity = session.get(Activity, id)
        if not activity:
            raise HTTPException(status_code=404, detail="Activity not found")
        if activity.name:
            selected_activity.name = activity.name
        if activity.start:
            selected_activity.start = activity.start
        if activity.stop:
            selected_activity.stop = activity.stop
        if activity.category_id:
            selected_activity.category_id = activity.category_id
        elif activity.category:
            selected_activity.category_id = await add_activity_category(
                activity.category
            )
        session.commit()
        session.refresh(selected_activity)
        return "activity successfully updated"


@router.delete("/activities/{id}")
async def delete_activity(id: int):
    with Session(engine) as session:
        activity = session.get(Activity, id)
        if not activity:
            raise HTTPException(status_code=404, detail="Activity not found")
        session.delete(activity)
        session.commit()
        return "activity successfully deleted"


async def add_activity_category(category: str):
    with Session(engine) as session:
        new_category = ActivityCategory(name=category)
        session.add(new_category)
        session.commit()
        session.refresh(new_category)
        return new_category.id
