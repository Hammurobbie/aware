import { useEffect } from "react";

const ConfirmSlider = ({ confirmTarget, setConfirmTarget, targetId }: any) => {
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
    const id = targetId?.split("_")?.[1];
    const swipeContainer = document?.getElementById(`swipe-box-${id}`);
    if (swipeContainer && id === confirmTarget?.target?.split("-")?.[2])
      draggable(swipeContainer);
  }, [confirmTarget, setConfirmTarget, targetId]);
};

export default ConfirmSlider;
