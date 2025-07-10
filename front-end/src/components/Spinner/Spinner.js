import sass from "./Spinner.module.scss";

const Spinner = ({ showP = true }) => {
  return (
    <div className={sass.spinnerCont}>
      <div className={sass.spinner}></div>
      {showP && <p className={sass.label}>loading...</p>}
    </div>
  );
};

export default Spinner;
