import "./add-cell.css";
import { useActions } from "../hooks/use-actions";
import Button from "@atlaskit/button";

interface AddCellProps {
  nextCellId: string | null;
}

const AddCell: React.FC<AddCellProps> = ({ nextCellId }) => {
  // put out action creators
  const { insertCellBefore } = useActions();
  return (
    <div className="add-cell">
      <div className="add-buttons">
        <Button
          onClick={() => insertCellBefore(nextCellId, "code")}
          appearance="primary"
        >
          Code
        </Button>
        <Button
          onClick={() => insertCellBefore(nextCellId, "text")}
          appearance="primary"
        >
          Text
        </Button>
      </div>
    </div>
  );
};
export default AddCell;
