"use client";
import { useState } from "react";
import Toggle from "./Toggle";
import ActivityForm from "./ActivityForm";
import cx from "classnames";

const Dashboard = ({ categories, activities }: any) => {
  const [actToggle, setActToggle] = useState(false);

  const handleActToggle = () => setActToggle(!actToggle);

  // TODO: pull up list of unfinished activities to edit/add stop time to
  // ^^ tap then swipe to delete/submit updates to avoid modal
  // TODO: place daily check in below until evening, then pull to top

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-4 mb-8 drop-shadow-harsh text-center text-balance">
        How fucked is your head{" "}
        <span
          className={cx(
            "transform-all",
            actToggle ? "text-success" : "text-error"
          )}
        >
          :)
        </span>
      </h1>
      <div className="w-full flex justify-end items-center mb-4">
        <p className="mr-4">
          {actToggle ? "unfinished activities" : "new activity"}
        </p>
        <Toggle isToggled={actToggle} toggleFunc={handleActToggle} />
      </div>
      {actToggle ? (
        activities
          ?.filter((act: any) => !act?.stop)
          .map((act: any, i: number) => (
            <ActivityForm
              key={i}
              targetActivity={act}
              categories={categories}
            />
          ))
      ) : (
        <ActivityForm categories={categories} />
      )}
    </div>
  );
};

export default Dashboard;
