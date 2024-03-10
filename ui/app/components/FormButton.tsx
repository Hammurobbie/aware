"use client";
import cx from "classnames";

interface FormButtonProps {
  id?: number;
  type: string;
  confirmTarget: any;
  setSubmitter: (id: string) => void;
}

const FormButton = ({
  type,
  confirmTarget,
  setSubmitter,
  id,
}: FormButtonProps) => {
  const isDelete = type === "delete";
  const isEdit = type === "edit";
  const buttonId = `${isDelete ? "delete" : "submit"}-button-${id || ""}`;
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
          <div className="animate-bounce-right text-light">{">>"}</div>
        </div>
      </div>
    );
  };

  return (
    <button
      id={buttonId}
      onClick={() => setSubmitter(buttonId)}
      className={cx(
        "relative button p-2 mt-5 mb-2",
        isConfirming ? `${shadow} active:transform-none` : "",
        confirmTarget?.target === buttonId && confirmTarget?.isConfirmed
          ? `bg-${accentColor} text-light animate-glow`
          : "bg-light"
      )}
    >
      {isConfirming
        ? " You sure?"
        : `${isEdit ? "Edit" : isDelete ? "Delete" : "Add"} activity`}
      {isConfirming && swipeBox()}
    </button>
  );
};

export default FormButton;
