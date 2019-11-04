import React, { useState } from "react";
import _ from "lodash";

const useLoginForm = (props, callback) => {
  const [inputs, setInputs] = useState({ regions: [] });
  const [isSelectAllClicked, setSelectAll] = useState(false);

  const allRegionIds = _.map(
    _.filter(props.regions, ["isoffline", false]),
    "value"
  );
  const handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    callback(props);
  };

  const handleInputChange = e => {
    e.persist();
    if (
      e.target.name === "regions" &&
      _.indexOf(e.target.value, "-1") != -1 &&
      !isSelectAllClicked
    ) {
      setInputs(inputs => ({
        ...inputs,
        [e.target.name]: allRegionIds
      }));
      setSelectAll(true);
    } else if (
      e.target.name === "regions" &&
      isSelectAllClicked &&
      _.indexOf(e.target.value, "-1") != -1
    ) {
      setInputs(inputs => ({
        ...inputs,
        [e.target.name]: []
      }));
      setSelectAll(false);
    } else {
      setInputs(inputs => ({
        ...inputs,
        [e.target.name]: e.target.value
      }));
    }
  };
  return { handleSubmit, handleInputChange, isSelectAllClicked, inputs };
};

export default useLoginForm;
