from typing import Optional, List
from sqlmodel import Field, Relationship, SQLModel


class Activity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    start: Optional[str] = None
    stop: Optional[str] = None
    category: Optional[str] = None

    category_id: Optional[int] = Field(default=None, foreign_key="activitycategory.id")


class ActivityCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str


class EmotionCheckLink(SQLModel, table=True):
    wellbeing_check_id: Optional[int] = Field(
        default=None, foreign_key="wellbeingcheck.id", primary_key=True
    )
    emotion_id: Optional[int] = Field(
        default=None, foreign_key="emotion.id", primary_key=True
    )


class MealCheckLink(SQLModel, table=True):
    wellbeing_check_id: Optional[int] = Field(
        default=None, foreign_key="wellbeingcheck.id", primary_key=True
    )
    meal_id: Optional[int] = Field(
        default=None, foreign_key="meal.id", primary_key=True
    )


class Emotion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str] = None
    sentiment: str

    wellbeing_checks: List["WellbeingCheck"] = Relationship(
        back_populates="emotions", link_model=EmotionCheckLink
    )


class Meal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str] = None
    description: Optional[str] = None

    wellbeing_checks: List["WellbeingCheck"] = Relationship(
        back_populates="meals", link_model=MealCheckLink
    )


class WellbeingCheck(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: Optional[str] = None
    notes: Optional[str] = None
    is_intermittent_fasting: Optional[bool] = False
    updated_emotions: Optional[str] = None
    updated_meals: Optional[str] = None

    emotions: List[Emotion] = Relationship(
        back_populates="wellbeing_checks", link_model=EmotionCheckLink
    )
    meals: List[Meal] = Relationship(
        back_populates="wellbeing_checks", link_model=MealCheckLink
    )
