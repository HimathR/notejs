import { useTypedSelector } from "./useTypedSelector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]); // get all the cells in the order they are in
    // in all the cells, give access to the code above the current cell
    const showFunc = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';
        // create a custom show function to display the output of the code in the preview window
        var show = (value) => {
          const root = document.querySelector('#root');
          if (typeof value === 'object') {
            if (value.$$typeof && value.props) { // having props and typeof object values means it is a react element
              _ReactDOM.render(value, root);
            } else {
              root.innerHTML = JSON.stringify(value);
            }
          } else {
            root.innerHTML = value;
          }
        };`;

    const showFuncNoOp = "var show = () => {}";

    const recolorFunc = `
        var recolor = (color) => {
          const root = document.querySelector('#root');
          root.style.color = color;
        }
        `;

    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoOp);
        }
        cumulativeCode.push(recolorFunc);
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};
