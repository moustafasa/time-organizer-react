import {
  add,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfDay,
} from "date-fns";

export const getOptionsOfWeekDays = () => {
  const date = startOfDay(new Date());

  const weekEnd = startOfDay(
    endOfWeek(date.getDay() === 5 ? add(date, { days: 1 }) : date, {
      weekStartsOn: 6,
    })
  );

  const days = eachDayOfInterval({
    start: date,
    end: weekEnd,
  }).map((day) => ({
    text: `${format(day, "eeee")}${isSameDay(day, date) ? " ( Today )" : ""}`,
    value: day.toDateString(),
  }));

  return days;
};

export const formatTime = (time) => {
  const hours = Math.floor(time / (60 * 60))
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % (60 * 60)) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((time % (60 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
