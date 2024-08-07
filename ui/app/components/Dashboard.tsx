"use client";
import { useEffect, useState } from "react";
import cx from "classnames";
import Toggle from "./Toggle";
import ActivityForm from "./ActivityForm";
import CheckinForm from "./CheckinForm";
import LocalDate from "../utils/LocalDate";

const Dashboard = ({
  categories,
  activities,
  checkins,
  emotions,
  meals,
}: any) => {
  const [actToggle, setActToggle] = useState<boolean>(false);
  const [confirmTarget, setConfirmTarget] = useState({
    target: "",
    isConfirmed: false,
  });
  const unfinishedActs = activities?.filter((act: any) => !act?.stop);
  useEffect(() => {
    setConfirmTarget({ target: "", isConfirmed: false });
  }, [actToggle, setConfirmTarget]);

  const handleActToggle = () => setActToggle(!actToggle);

  const nightTimestamp = new Date().setHours(21, 30, 0, 0);
  const night = LocalDate(new Date(nightTimestamp));
  const formattedTimeNow = LocalDate(new Date());
  const isEOD = Date.parse(night) < Date.parse(formattedTimeNow);
  const hasTodaysCheck = checkins?.some(
    (c: any) => c?.date?.split("T")?.[0] === formattedTimeNow?.split("T")?.[0]
  );

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-4 mb-8 drop-shadow-harsh text-center text-balance">
        Track
      </h1>
      <div className="w-full flex justify-end items-center mb-4">
        <p className="mr-4">
          {actToggle ? "unfinished activities" : "new activity"}
        </p>
        <Toggle isToggled={actToggle} toggleFunc={handleActToggle} />
      </div>
      {/* vv - for some reason this fixes horseshit ios safari date bug - vv*/}
      <div className="hidden">
        {formattedTimeNow}
        {night}
      </div>
      <div
        className={cx("w-full flex flex-col", {
          "flex-col-reverse": !hasTodaysCheck && isEOD,
        })}
      >
        {actToggle ? (
          unfinishedActs?.length ? (
            unfinishedActs.map((act: any, i: number) => (
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
            <p className="mt-44 text-dark text-center">
              {"You don't have any unfinished business"}
            </p>
          )
        ) : (
          <ActivityForm
            categories={categories}
            confirmTarget={confirmTarget}
            setConfirmTarget={setConfirmTarget}
          />
        )}
        <span
          className={cx("w-full mb-4 border-4 border-success", {
            "mt-14": !actToggle,
            "mt-10": actToggle,
          })}
        />
        <CheckinForm
          number={0}
          emotions={emotions}
          meals={meals}
          checkins={checkins}
          confirmTarget={confirmTarget}
          setConfirmTarget={setConfirmTarget}
        />
      </div>
    </div>
  );
};

export default Dashboard;
