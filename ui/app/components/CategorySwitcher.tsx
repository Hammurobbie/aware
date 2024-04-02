"use client";
import { useState } from "react";
import cx from "classnames";
import Categories from "../icons/categories";
import Emotions from "../icons/emotions";
import Meals from "../icons/meals";
import Meditating from "../icons/meditate";
import Running from "../icons/running";

export default function CategorySwitcher(props: any) {
  const [selectedItem, setSelectedItem] = useState("activities");
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
    "calc(50% - 24px)"
  );

  const handleCategoryChange = (menuItem: string) => {
    setSelectedItem(menuItem);
    const itemEl = document?.getElementById(menuItem);
    setSelectedPosition(`calc(${itemEl?.offsetLeft}px - 9.5px)`);
  };

  return (
    <>
      {/* pixelation overlay filter */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="0"
        height="0"
      >
        <defs>
          <filter id="pixelate" x="0" y="0">
            <feFlood x="2" y="2" height="1" width="1" />
            <feComposite width="2" height="2" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius=".4" />
          </filter>
        </defs>
      </svg>

      <div className="flex justify-around w-full relative transition-all">
        <div
          className="absolute top-0 bottom-0 my-auto bg-error h-12 w-12 rounded-full animate-glow-red blur-[1px] duration-500"
          style={{ left: selectedPosition }}
        />
        <button id="checkins" onClick={() => handleCategoryChange("checkins")}>
          <Meditating
            className={cx("adjust-icon duration-500", {
              "fill-bg": selectedItem === "checkins",
              "fill-grayscale": selectedItem !== "checkins",
            })}
            size={30}
          />
        </button>
        <button id="emotions" onClick={() => handleCategoryChange("emotions")}>
          <Emotions
            className={cx("adjust-icon duration-500", {
              "fill-bg": selectedItem === "emotions",
              "fill-grayscale": selectedItem !== "emotions",
            })}
            size={30}
          />
        </button>
        <button
          id="activities"
          onClick={() => handleCategoryChange("activities")}
        >
          <Running
            className={cx("adjust-icon duration-500", {
              "fill-bg": selectedItem === "activities",
              "fill-grayscale": selectedItem !== "activities",
            })}
            size={30}
          />
        </button>
        <button id="meals" onClick={() => handleCategoryChange("meals")}>
          <Meals
            className={cx("adjust-icon duration-500", {
              "fill-bg": selectedItem === "meals",
              "fill-grayscale": selectedItem !== "meals",
            })}
            size={30}
          />
        </button>
        <button
          id="categories"
          onClick={() => handleCategoryChange("categories")}
        >
          <Categories
            className={cx("adjust-icon duration-500", {
              "fill-bg": selectedItem === "categories",
              "fill-grayscale": selectedItem !== "categories",
            })}
            size={30}
          />
        </button>
      </div>
      <div className="max-w-5xl w-full flex justify-center flex-wrap">
        {props[selectedItem]?.map((menuItem: any, key: number) => (
          <div
            key={key}
            className="flex flex-col justify-center items-center p-5 m-5 bg-slate-800 rounded-xl"
          >
            <div>{menuItem?.notes}</div>
            {menuItem?.updated_emotions?.map((e: any, key: number) => (
              <p key={key} className="text-slate-400 pt-2">
                {e.name}
              </p>
            ))}
          </div>
        )) || (
          <p className="mt-44 text-dark text-center">
            coming soon to a phone near you
          </p>
        )}
      </div>
    </>
  );
}
