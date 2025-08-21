import sass from "./Spinner.module.scss";

const Spinner = ({
  size = "small",
  showLabel = false,
  label = "loading...",
}) => {
  return (
    <div className={`${sass.inlineSpinnerCont} ${sass[size]}`}>
      <div className={sass.spinner}></div>
      {showLabel && <span className={sass.label}>{label}</span>}
    </div>
  );
};

export default Spinner;
