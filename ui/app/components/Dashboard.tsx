"use client";
import { useEffect, useState } from "react";
import Toggle from "./Toggle";
import ActivityForm from "./ActivityForm";
import cx from "classnames";

const Dashboard = ({ categories, activities }: any) => {
  const initConfirm = { target: "", isConfirmed: false };
  const [actToggle, setActToggle] = useState<boolean>(false);
  const [confirmTarget, setConfirmTarget] = useState(initConfirm);

  useEffect(() => {
    setConfirmTarget(initConfirm);
  }, [actToggle, setConfirmTarget]);

  const handleActToggle = () => setActToggle(!actToggle);

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
              confirmTarget={confirmTarget}
              setConfirmTarget={setConfirmTarget}
              setActToggle={setActToggle}
            />
          ))
      ) : (
        <ActivityForm
          categories={categories}
          confirmTarget={confirmTarget}
          setConfirmTarget={setConfirmTarget}
        />
      )}
    </div>
  );
};

export default Dashboard;
