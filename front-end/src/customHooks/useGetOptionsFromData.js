const useGetOptionsFromData =
  () =>
  (data, text = "name", value = "id") => {
    return [
      { text: "choose", value: "" },
      ...data.map((data) => ({ text: data[text], value: data[value] })),
    ];
  };

export default useGetOptionsFromData;
