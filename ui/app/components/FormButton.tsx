"use client";
import cx from "classnames";

interface FormButtonProps {
  id?: number;
  action?: string;
  type: string;
  confirmTarget: any;
  setSubmitter: (id: string) => void;
}

const FormButton = ({
  id,
  action,
  type,
  confirmTarget,
  setSubmitter,
}: FormButtonProps) => {
  const isDelete = type === "delete";
  const isEdit = type === "edit";
  const buttonId = `${
    action ? action.replace(" ", "_") + "_" : ""
  }${type}-button-${id}`;
  const isConfirming =
    confirmTarget?.target === buttonId && !confirmTarget?.isConfirmed;
  const accentColor = isDelete ? "error" : "success";
  const shadow = isDelete
    ? "!shadow-[var(--error)_0_0_7px_7px]"
    : "!shadow-[var(--success)_0_0_7px_7px]";

  const swipeBox = () => {
    const bg = isDelete ? "bg-error" : "bg-success";
    return (
      <div
        id={`swipe-box-${id}`}
        className="absolute w-full h-full top-0 left-px"
      >
        <div
          className={cx(
            "absolute w-9 h-[95%] mt-px flex justify-center items-center rounded-sm",
            bg
          )}
        >
          <p className="mt-px animate-bounce-right text-light">{">>"}</p>
        </div>
      </div>
    );
  };

  return (
    <button
      id={buttonId}
      onClick={() => setSubmitter(buttonId)}
      className={cx(
        "relative button p-2 mt-2 mb-2",
        isConfirming ? `${shadow} active:transform-none` : "",
        confirmTarget?.target === buttonId && confirmTarget?.isConfirmed
          ? `bg-${accentColor} text-light animate-glow`
          : "bg-light"
      )}
    >
      {isConfirming
        ? " You sure?"
        : `${isEdit ? "Edit" : isDelete ? "Delete" : "Add"} ${
            action || "activity"
          }`}
      {isConfirming && swipeBox()}
    </button>
  );
};

export default FormButton;
