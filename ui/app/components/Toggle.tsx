import React from "react";
import cx from "classnames";

interface ToggleProps {
  isToggled?: boolean;
  toggleFunc: () => void;
}

const Toggle = ({ isToggled, toggleFunc }: ToggleProps) => {
  return (
    <button
      onClick={() => toggleFunc()}
      className={cx(
        "w-14 h-7 py-0.5 px-1 shadow-harsh-tight rounded-sm transition-all",
        isToggled ? "bg-error" : "bg-success"
      )}
    >
      <div
        className={cx("h-5 w-5 bg-dark rounded-sm transition-all", {
          "ml-7": isToggled,
        })}
      />
    </button>
  );
};

export default Toggle;
