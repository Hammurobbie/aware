"use client";
import cx from "classnames";
import { useState } from "react";

const MultiItemSelect = ({
  errors,
  meals,
  emotions,
  handleFormInput,
  mealsId,
  emotionsId,
  checkin,
}: any) => {
  const [description, setDescription] = useState(null);
  const targetStr = `updated_${emotionsId ? "emotions" : "meals"}`;
  const targetData = emotionsId ? emotions : meals;
  const updatedTarget = emotionsId
    ? checkin?.updated_emotions
    : checkin?.updated_meals;

  const handleDescription = (tar: any) => {
    if (!tar?.description) return;
    if (description !== tar?.description) {
      setDescription(tar?.description);
      setTimeout(() => setDescription(null), 10000);
    } else setDescription(null);
  };

  return (
    <>
      <label className="mt-2 text-start text-bg-secondary" htmlFor={targetStr}>
        {emotionsId ? "Emotions" : "Meals"}
      </label>
      <div className="mb-4 mt-1">
        <select
          id={emotionsId ?? mealsId}
          name={targetStr}
          onChange={handleFormInput}
          defaultValue="select"
          className={cx(
            "w-full bg-light p-2 h-10 border-r-8 border-transparent",
            errors?.includes(targetStr) && "ring ring-error"
          )}
        >
          <option disabled value="select">
            Select
          </option>
          {targetData?.map((tar: any) => (
            <option key={tar?.id} value={tar?.name}>
              {tar?.name}
            </option>
          ))}
        </select>
        <div className="flex justify-between flex-wrap">
          {updatedTarget?.map((tar: any) => (
            <div className="relative">
              <button
                key={tar?.id}
                onClick={() => handleDescription(tar)}
                className="py-1 px-2 mt-2 bg-bg-secondary text-grayscale rounded-md"
              >
                {tar?.name}
              </button>
              {description && description === tar?.description && (
                <div className="absolute z-10 bg-text text-light -bottom-7 -right-4 px-1 rounded-sm shadow-md pointer-events-none">
                  {description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MultiItemSelect;
