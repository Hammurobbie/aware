"use client";
import { useState } from "react";
import IconButton from "./IconButton";
import UpdateFormMapper from "../utils/UpdateFormMapper";

export default function CategorySwitcher(props: any) {
  const [selectedItem, setSelectedItem] = useState("activities");
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
    "calc(10% - 23.5px)"
  );
  const [confirmTarget, setConfirmTarget] = useState({
    target: "",
    isConfirmed: false,
  });

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

      <div className="relative flex justify-around w-full transition-all mb-4">
        <div
          className="absolute z-0 top-0 bottom-0 my-auto bg-error h-12 w-12 rounded-full animate-glow-red blur-[1px] duration-500"
          style={{ left: selectedPosition }}
        />
        {Object.keys(props)?.map((v, i) => (
          <IconButton
            key={i}
            type={v}
            setSelectedItem={setSelectedItem}
            setSelectedPosition={setSelectedPosition}
            isSelected={selectedItem === v}
          />
        ))}
      </div>
      <div className="max-w-5xl w-full flex justify-center flex-wrap">
        <UpdateFormMapper
          data={props[selectedItem]}
          categories={props?.categories}
          emotions={props?.emotions}
          meals={props?.meals}
          type={selectedItem}
          confirmTarget={confirmTarget}
          setConfirmTarget={setConfirmTarget}
        />
      </div>
    </>
  );
}
