import { useEffect } from "react";

const ConfirmSlider = ({
  confirmTarget,
  setConfirmTarget,
  activityId,
}: any) => {
  useEffect(() => {
    function draggable(swipeContainer: any) {
      const swipeBox = swipeContainer?.firstElementChild;
      ["touchstart", "mousedown"].forEach((event) => {
        swipeBox.addEventListener(event, (e: any) => {
          let start = "mousemove";
          let end = "mouseup";
          if (e?.touches?.[0]?.clientX) {
            start = "touchmove";
            end = "touchend";
          }
          const offsetX =
            (e?.touches?.[0]?.clientX || e.clientX) -
            parseInt(getComputedStyle(swipeBox).left);
          const buttonLeftPos = swipeContainer?.getBoundingClientRect()?.left;
          const buttonRightPos = swipeContainer?.getBoundingClientRect()?.right;
          const swipeBoxLeftPos = swipeBox?.getBoundingClientRect()?.left;

          function mouseMoveHandler(e: any) {
            const xPos = e?.touches?.[0]?.clientX || e.clientX;
            // console.log(buttonLeftPos, " d ", xPos);
            if (xPos >= buttonRightPos) {
              removeEventListener(start, mouseMoveHandler);
              removeEventListener(end, reset);
              setConfirmTarget({
                target: confirmTarget?.target,
                isConfirmed: true,
              });
            } else if (
              xPos > buttonLeftPos &&
              swipeBoxLeftPos >= buttonLeftPos &&
              xPos < buttonRightPos
            ) {
              swipeBox.style.left = xPos - offsetX + "px";
            } else {
              swipeBox.style.left = 0;
            }
          }

          function reset() {
            removeEventListener(start, mouseMoveHandler);
            removeEventListener(end, reset);
            swipeBox.style.left = 0;
          }

          addEventListener(start, mouseMoveHandler);
          addEventListener(end, reset);
        });
      });
    }

    const swipeContainer = document?.getElementById(`swipe-box-${activityId}`);
    if (
      swipeContainer &&
      (!activityId ||
        activityId === Number(confirmTarget?.target?.split("-")?.[2]))
    )
      draggable(swipeContainer);
  }, [confirmTarget, setConfirmTarget, activityId]);
};

export default ConfirmSlider;
