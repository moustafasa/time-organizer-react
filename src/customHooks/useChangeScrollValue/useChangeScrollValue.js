import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {} from "../../features/AddTasks/AddTasksSlice";

const useScrollChangeValue = (id, changeFunction, elementRef) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const scrollHandler = (e) => {
      const elementRect = elementRef.current.getBoundingClientRect();
      const vh = document.documentElement.clientHeight;
      if (elementRect.top < vh / 2) {
        dispatch(changeFunction(id));
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);
};

export default useScrollChangeValue;
