export const getWeekDays = () => {
  const date = new Date();
  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const nowDay = date.getDay() === 6 ? 0 : date.getDay() + 1;

  if (nowDay < 6) {
    return days.slice(nowDay);
  } else {
    return ["friday", ...days];
  }
};

// date.fns

export const getOptionsOfWeekDays = () => {
  const weekDays = getWeekDays();
  return weekDays.map((day, index) => {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );

    if (index !== 0) {
      date.setDate(date.getDate() + index);
    }
    const value = date.toDateString();

    return {
      text: value === new Date().toDateString() ? day + " ( Today )" : day,
      value: value,
    };
  });
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
