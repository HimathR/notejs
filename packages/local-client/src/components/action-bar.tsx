import { useActions } from "../hooks/use-actions";
import Button from "@atlaskit/button";
import "./action-bar.css";
interface ActionBarProps {
  //   actions: Action[];
  //   className?: string;
  //   onAction: (action: Action) => void;
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="action-bar">
      <Button onClick={() => moveCell(id, "up")} appearance="primary">
        <span className="icon is-small">
          <i className="fas fa-arrow-up"></i>
        </span>
      </Button>
      <Button onClick={() => moveCell(id, "down")} appearance="primary">
        <span className="icon is-small">
          <i className="fas fa-arrow-down"></i>
        </span>
      </Button>
      <Button onClick={() => deleteCell(id)} appearance="danger">
        <span className="icon is-small">🗑️</span>
      </Button>
    </div>
  );
};
export default ActionBar;
