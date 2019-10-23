import React, { useState } from "react";

const useLoginForm = callback => {
  const [inputs, setInputs] = useState({});

  const handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    // console.log(inputs);
    callback();
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
