import React, { useState } from "react";

const calculateBackgroundColor = ({ value, color }) => {
  return (
    "linear-gradient(to right," +
    color +
    " 0%, " +
    color +
    " " +
    value +
    "%, #fff " +
    value +
    "%, white 100%"
  );
};
const SlideRange = ({ attrName, userData, setUserData, color }) => {
  const [value, setValue] = useState(userData.Attributes[attrName]);
  return (
    <form style={{ width: "100%", display: "flex" }}>
      <input
        id="slider"
        style={{ width: "100%", height: "1.5rem" }}
        type="range"
        step={25}
        value={value}
        onChange={(e) => {
          setValue(e.target.valueAsNumber);
          setUserData({
            ...userData,
            Attributes: {
              ...userData.Attributes,
              [attrName]: e.target.valueAsNumber,
            },
          });
        }}
      ></input>
    </form>
  );
};

export default SlideRange;
