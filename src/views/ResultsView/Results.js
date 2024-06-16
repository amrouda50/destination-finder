import React, { useState, useEffect, useRef } from "react";
import Accordion from "react-bootstrap/Accordion";
import "../../styles/App.css";
import useTravelRecommenderStore from "../../store/travelRecommenderStore";
import { useAuthContext } from "../../context/AuthContext";
import ResultItem from "./ResultItem";
import {capitalize} from "lodash";
export const Results = ({ activeResult}) => {
  const {user} = useAuthContext();
  const results = useTravelRecommenderStore((state) => state.results);
  const [activeIndex, setActiveIndex] = useState(-1);
  const accordElem = useRef(null);

  useEffect(() => {
    if (results.length > 0) {
      if (activeResult === activeIndex) {
        setActiveIndex(-1);
      } else {
        setActiveIndex(activeResult);
        accordElem.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeResult]);

  return (
    <div className={'py-2 h-100 overflow-y-scroll'}>
      <p className={'m-0'} style={{ textAlign: "left" }}>
        Best destinations for {capitalize(user.username ?? "you")}
      </p>
      {results.length > 0 ? (
        <div ref={accordElem}>
          <Accordion activeKey={activeIndex}>
            {results?.map((item, index) => (
              <ResultItem
                key={index}
                item={item}
                accordElem={accordElem}
                index={index}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            ))}
          </Accordion>
        </div>
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column",
          }}
        >
          <p style={{ fontWeight: "bold", color: "red" }}>No results found!</p>
        </div>
      )}
    </div>
  );
};
