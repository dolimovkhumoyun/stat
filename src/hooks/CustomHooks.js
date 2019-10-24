import React, { useState } from "react";

const useLoginForm = (props, callback) => {
  const [inputs, setInputs] = useState({});

  const handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    callback(props);
  };

  const handleInputChange = e => {
    e.persist();
    setInputs(inputs => ({
      ...inputs,
      [e.target.name]: e.target.value
    }));
  };
  return { handleSubmit, handleInputChange, inputs };
};

export default useLoginForm;
