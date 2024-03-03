import { startTransition, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {} from "../../features/AddTasks/AddTasksSlice";

const useScrollChangeValue = (
  id,
  changeFunction,
  elementRef,
  getCurrentElement,
  condition = undefined,
  last,
  index
) => {
  const dispatch = useDispatch();
  const currentElement = useSelector(getCurrentElement);

  useEffect(() => {
    const scrollHandler = (e) => {
      startTransition(() => {
        if (
          elementRef.current &&
          currentElement !== id &&
          (condition === undefined || condition)
        ) {
          const elementRect = elementRef.current.getBoundingClientRect();
          const vh = document.documentElement.clientHeight;

          let factor = 0;

          if (last && condition) {
            factor = 300;
          }

          if (
            elementRect.top < vh / 2 &&
            elementRect.bottom + factor >= vh / 2
          ) {
            dispatch(changeFunction(id));
          }
        }
      });
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition, currentElement]);
};

export default useScrollChangeValue;
