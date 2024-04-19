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

  return (
    <>
      <div className="relative flex justify-around w-full transition-all mb-4">
        <div
          className="absolute z-0 top-0 bottom-0 my-auto bg-error h-12 w-12 rounded-full animate-glow-red blur-[1px] duration-500"
          style={{ left: selectedPosition }}
        />
        {props?.[selectedItem]
          ? Object.keys(props)?.map((v, i) => (
              <IconButton
                key={i}
                type={v}
                setSelectedItem={setSelectedItem}
                setSelectedPosition={setSelectedPosition}
                isSelected={selectedItem === v}
              />
            ))
          : // TODO: delete - for no data debugg
            ["activities", "categories", "checkins", "meals", "emotions"]?.map(
              (v, i) => (
                <IconButton
                  key={i}
                  type={v}
                  setSelectedItem={setSelectedItem}
                  setSelectedPosition={setSelectedPosition}
                  isSelected={selectedItem === v}
                />
              )
            )}
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
