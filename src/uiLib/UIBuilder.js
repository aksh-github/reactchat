import React from "react";
import { inject, startsWithCapital, getProp } from "./util";
import jsonLogic from "json-logic-js";
import { For, ErrorBoundary } from "./For";
import { useGlobal } from "./GlobalContext";

const CompoObject = {};

export const buildUI = (elementSchema, extras) => {
  let arr = null;

  // 1.
  if (typeof elementSchema === "string") {
    // if (elementSchema.includes("${"))
    //   console.log(elementSchema, extras, inject(elementSchema, extras));
    elementSchema = inject(elementSchema, extras);
    return elementSchema;
  }

  // create copy
  let newProps = {
    ...elementSchema.props,
  };

  let show = true;
  let rule = show;

  if (elementSchema.props) {
    Object.keys(newProps).forEach((prop, idx) => {
      // console.log(elementSchema);
      if (prop != "custom" && newProps[prop].includes("${")) {
        // console.log(inject(elementSchema.props[prop], extras));
        newProps[prop] = inject(newProps[prop], extras);
      }
    });

    if (newProps.custom) {
      // newProps.custom = inject(newProps.custom, extras);

      if (typeof newProps.custom === "string")
        newProps = {
          ...newProps,
          custom: JSON.parse(newProps.custom, (key, value) => {
            if (value?.startsWith?.("${@l")) {
              const k = value.replace("${@l", "localData").replace("}", "");
              // console.log(getProp(extras, k.split(".")));
              return getProp(extras, k.split("."));
            } else if (value?.startsWith?.("${@g")) {
              const k = value.replace("${@g", "data").replace("}", "");
              // console.log(getProp(extras, k.split(".")));
              return getProp(extras, k.split("."));
            } else return value; // return the unchanged property value.
          }),
        };

      // decide to hide or not
      rule = newProps.custom.hide;
      show = !jsonLogic.apply(rule);
    }
  }

  // what to do for custom components
  // if (!["For", "MixMatch", "Count"].includes(elementSchema.$)) {
  if (!startsWithCapital(elementSchema.$ || "")) {
    delete newProps.custom;
    // console.log(extras);
  }

  if (elementSchema.$ !== "For" && elementSchema.children instanceof Array) {
    // if (elementSchema.children instanceof Array) {
    //vv imp decision point (if parent is hidden no need to iterate n process children)
    if (!show) {
      return null;
    }

    arr = elementSchema.children.map((el, idx) => {
      if (el.props) {
        // console.log(el.props);
        // el.props.key = "k" + idx;
        el.key = "k" + idx;
      }

      return (
        <React.Fragment key={"k" + idx}>{buildUI(el, extras)}</React.Fragment>
      );
    });
  }

  switch (elementSchema.$) {
    case "div":
    case "span":
    case "p":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "header":
    case "footer":
    case "ul":
    case "li":
      return show && <elementSchema.$ {...newProps}>{arr}</elementSchema.$>;
    // return show && React.createElement(elementSchema.$, newProps, arr);

    case "button":
      // console.log(newProps);
      // newProps.onClick = () => extras.fns.setCount((c) => c + 1);
      newProps.disabled = newProps.disabled === "true" ? true : false;
      newProps.onClick = (e) => extras.fns.buttonClicked(e);
      return show && React.createElement(elementSchema.$, newProps, arr);

    case "input":
      if (newProps.type === "text" || !newProps.type)
        newProps.onChange = (e) => extras.fns.textChanged(e);

      return show && React.createElement(elementSchema.$, newProps, null);
    case "textarea":
      newProps.onChange = (e) => extras.fns.textChanged(e);

      return show && React.createElement(elementSchema.$, newProps, null);
    case "space":
      return show && " ";

    case "template":
      if (!typeof elementSchema.version) throw Error("Invalid JSON format");

      return React.createElement(React.Fragment, {}, arr);
    case "For":
      return show && <For {...newProps}>{elementSchema.children}</For>;
    // case "Count":
    //   return show && <Count {...newProps}>{elementSchema.children}</Count>;
    default:
      // No further processing reqd
      if (!show) return null;

      let LazyComponent = CompoObject[elementSchema.$];

      // console.log(extras);
      const { data, ...newExtras } = extras;

      if (newProps.custom && newProps.custom.fetchFrom) {
        LazyComponent =
          CompoObject[elementSchema.$] ||
          React.lazy(() =>
            import(`${newProps.custom.fetchFrom}`)
              .then((module) => {
                // console.log(module);
                // return module;
                return module.default
                  ? module
                  : { default: module[elementSchema.$] };
              })
              .catch((err) => {
                console.log(err);
              })
          );

        if (!CompoObject[elementSchema.$])
          CompoObject[elementSchema.$] = LazyComponent;

        return (
          <ErrorBoundary>
            <React.Suspense fallback={<div>Loading...</div>}>
              {LazyComponent && (
                <LazyComponent {...newProps} extras={newExtras}>
                  {elementSchema.children}
                </LazyComponent>
              )}
            </React.Suspense>
          </ErrorBoundary>
        );
      } else {
        return React.createElement(
          "div",
          { style: { backgroundColor: "red" } },
          `${elementSchema.$} type not implemented yet.`
        );
      }
  }
};

export const UIBuilder = ({ Ui }) => {
  const globalContext = useGlobal();

  // console.log(Ui, globalContext);
  return buildUI(Ui, { ...globalContext });
};
