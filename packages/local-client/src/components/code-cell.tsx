import { useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { LoadingButton } from "@atlaskit/button";
import "./code-cell.css";
import { useCumulativeCode } from "../hooks/use-cumulative-code";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  // go through state object and find the cell with the id of the cell we are currently working with
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    // debouncing the bundle function
    if (!bundle) {
      // this ensures that bundle is created as soon as the cell is created
      createBundle(cell.id, cumulativeCode);
      return;
    }
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
  }, [cumulativeCode, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <LoadingButton appearance="primary" isLoading>
                Loading
              </LoadingButton>
            </div>
          ) : (
            //use bundle && to make sure code and error is not shown if undefined
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
