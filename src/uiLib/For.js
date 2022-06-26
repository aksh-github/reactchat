import React from "react";
import { getObjectProperty } from "./util";
import { useGlobal } from "./GlobalContext";
import { buildUI } from "./UIBuilder";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "" };
  }

  componentDidCatch(error) {
    this.setState({ error: `${error.name}: ${error.message}` });
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <div style={{ backgroundColor: "red" }}>{error}</div>;
    }
    return <>{this.props.children}</>;
  }
}

const For = (props) => {
  const globalContext = useGlobal();
  const { custom, ...newProps } = props;
  // console.log(props, globalContext);

  let _data = custom.each || [];

  const arr = _data.map((dataItem, idx) => {
    // console.log(el);
    // _current = el;
    // return React.createElement(el.$, el.props, el.children)

    if (newProps.children[0] && newProps.children[0].props)
      newProps.children[0].props.key = "fk" + idx;
    else return null;

    return (
      <React.Fragment key={"k" + idx}>
        {buildUI(newProps.children[0], {
          ...globalContext,
          localData: dataItem,
          idx: idx,
        })}
      </React.Fragment>
    );
  });
  // console.log(arr);

  return React.createElement(custom.as, newProps, arr);
};

export { For, ErrorBoundary };
