import React from "react";
import Select from "react-select";
import { OmitProps } from "antd/lib/transfer/renderListBody";

const MultiSelect = props => {
  return <Select options={props.options}></Select>;
};

export default MultiSelect;
