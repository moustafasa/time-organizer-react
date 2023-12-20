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
