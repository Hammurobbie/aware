from models import WellbeingCheck, Meal, Emotion
from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from db import engine
from sqlalchemy.orm import joinedload

router = APIRouter()


@router.post("/wellbeing_checks")
async def add_wellbeing_check(wellbeing_check: WellbeingCheck):
    with Session(engine) as session:

        new_wellbeing_check = WellbeingCheck(
            date=wellbeing_check.date,
            notes=wellbeing_check.notes,
            emotions=wellbeing_check.emotions,
            meals=wellbeing_check.meals,
            is_intermittent_fasting=wellbeing_check.is_intermittent_fasting,
        )
        session.add(new_wellbeing_check)
        session.commit()
        session.refresh(new_wellbeing_check)

        if wellbeing_check.updated_emotions:
            await update_linked_table(
                new_wellbeing_check.id, wellbeing_check.updated_emotions, Emotion, False
            )
        if wellbeing_check.updated_meals:
            await update_linked_table(
                new_wellbeing_check.id, wellbeing_check.updated_meals, Meal, False
            )
        return "wellbeing check successfully added"


@router.get("/wellbeing_checks")
async def read_wellbeing_checks():
    with Session(engine).no_autoflush as session:
        wellbeing_checks = session.exec(select(WellbeingCheck)).all()
        for wbc in wellbeing_checks:
            wbc.updated_emotions = wbc.emotions
            wbc.updated_meals = wbc.meals
        return wellbeing_checks


@router.get("/wellbeing_checks/{id}")
async def read_wellbeing_check(id: int):
    with Session(engine).no_autoflush as session:
        wellbeing_check = session.get(WellbeingCheck, id)
        if not wellbeing_check:
            raise HTTPException(status_code=404, detail="wellbeing check not found")
        wellbeing_check.updated_emotions = wellbeing_check.emotions
        wellbeing_check.updated_meals = wellbeing_check.meals
        return wellbeing_check


@router.put("/wellbeing_checks/{id}")
async def update_wellbeing_check(id: int, wellbeing_check: WellbeingCheck):
    with Session(engine) as session:
        selected_wellbeing_check = session.get(WellbeingCheck, id)
        if not wellbeing_check:
            raise HTTPException(status_code=404, detail="wellbeing check not found")
        if wellbeing_check.date:
            selected_wellbeing_check.date = wellbeing_check.date
        if wellbeing_check.notes:
            selected_wellbeing_check.notes = wellbeing_check.notes

        selected_wellbeing_check.is_intermittent_fasting = (
            wellbeing_check.is_intermittent_fasting
        )

        session.commit()
        session.refresh(selected_wellbeing_check)
        session.refresh(selected_wellbeing_check)

        if wellbeing_check.updated_emotions:
            await update_linked_table(
                id, wellbeing_check.updated_emotions, Emotion, True
            )
        if wellbeing_check.updated_meals:
            await update_linked_table(id, wellbeing_check.updated_meals, Meal, True)

        return "wellbeing check successfully updated"


@router.delete("/wellbeing_checks/{id}")
async def delete_wellbeing_check(id: int):
    with Session(engine) as session:
        wellbeing_check = session.get(WellbeingCheck, id)
        if not wellbeing_check:
            raise HTTPException(status_code=404, detail="wellbeing check not found")
        session.delete(wellbeing_check)
        session.commit()
        return "wellbeing check successfully deleted"


async def update_linked_table(
    id: int,
    fields_list: str,
    model: any,
    wb_check_update: bool,
):
    with Session(engine) as session:
        add_list = []
        update_list = []
        new_fields = eval(fields_list)
        is_meal = model.__name__ == "Meal"
        for field in new_fields:
            new_field = model(
                name=field["name"],
                description=(
                    None if not "description" in field.keys() else field["description"]
                ),
            )
            if not "id" in field.keys():
                add_list.append(new_field)
            else:
                old_field = session.get(Meal if is_meal else Emotion, field["id"])
                update_list.append(old_field)

        tar_wb_check = session.get(WellbeingCheck, id)
        for field in add_list:
            session.add(field)
        session.commit()
        for field in add_list:
            session.refresh(field)
        new_list = update_list + add_list
        if not wb_check_update:
            for field in new_list:
                if is_meal:
                    tar_wb_check.meals.append(field)
                else:
                    tar_wb_check.emotions.append(field)
        else:
            if is_meal:
                tar_wb_check.meals = new_list
            else:
                tar_wb_check.emotions = new_list
        session.add(tar_wb_check)
        session.commit()
