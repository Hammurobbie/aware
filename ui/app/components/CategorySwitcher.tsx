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
    "calc(50% - 23.5px)"
  );

  const handleCategoryChange = (menuItem: string) => {
    setSelectedItem(menuItem);
    const itemEl = document?.getElementById(menuItem);
    setSelectedPosition(`calc(${itemEl?.offsetLeft}px - 8.5px)`);
  };

  console.log(selectedItem, props[selectedItem]);

  return (
    <>
      {/* pixelation overlay filter / most break in safari */}
      <svg height={0} width={0} xmlns="http://www.w3.org/2000/svg">
        <filter id="pixelate">
          <feGaussianBlur
            stdDeviation="0.1"
            in="SourceGraphic"
            result="smoothed"
          />
          <feComposite operator="in" in2="SourceGraphic" />
          {/* <feFlood x="2" y="2" height="1" width="1" />
          <feComposite width="2" height="2" />
          <feTile result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
          <feMorphology operator="dilate" radius=".4" /> */}
        </filter>
      </svg>

      <div className="relative flex justify-around w-full transition-all">
        <div
          className="absolute z-0 top-0 bottom-0 my-auto bg-error h-12 w-12 rounded-full animate-glow-red blur-[1px] duration-500"
          style={{ left: selectedPosition }}
        />
        <button
          className="z-10"
          id="checkins"
          onClick={() => handleCategoryChange("checkins")}
        >
          <Meditating
            className={cx("adjust-icon duration-500 h-8 mb-px", {
              "fill-bg": selectedItem === "checkins",
              "fill-grayscale": selectedItem !== "checkins",
            })}
          />
        </button>
        <button
          className="z-10"
          id="emotions"
          onClick={() => handleCategoryChange("emotions")}
        >
          <Emotions
            className={cx("adjust-icon duration-500 h-8", {
              "fill-bg": selectedItem === "emotions",
              "fill-grayscale": selectedItem !== "emotions",
            })}
          />
        </button>
        <button
          className="z-10"
          id="activities"
          onClick={() => handleCategoryChange("activities")}
        >
          <Running
            className={cx("adjust-icon duration-500 h-8", {
              "fill-bg": selectedItem === "activities",
              "fill-grayscale": selectedItem !== "activities",
            })}
          />
        </button>
        <button
          className="z-10"
          id="meals"
          onClick={() => handleCategoryChange("meals")}
        >
          <Meals
            className={cx("adjust-icon duration-500 h-8", {
              "fill-bg": selectedItem === "meals",
              "fill-grayscale": selectedItem !== "meals",
            })}
          />
        </button>
        <button
          className="z-10"
          id="categories"
          onClick={() => handleCategoryChange("categories")}
        >
          <Categories
            className={cx("adjust-icon duration-500 h-8", {
              "fill-bg": selectedItem === "categories",
              "fill-grayscale": selectedItem !== "categories",
            })}
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
