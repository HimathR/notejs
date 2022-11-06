import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";
import { produce } from "immer"; // https://immerjs.github.io/immer/update-patterns/
// immer helps us with array mutations

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    // one for each sell in key value pair
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellsReducer = produce(
  (state: CellsState = initialState, action: Action) => {
    switch (action.type) {
      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;
      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;
        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map((cell) => cell.id); // for each cell in the payload, return the id
        state.data = action.payload.reduce((acc, cell) => {
          // populate the data object with the cell id as the key and the cell as the value
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState["data"]);
        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id); // find index of the cell we want to move
        const targetIndex = direction === "up" ? index - 1 : index + 1; // if direction is up, move up one, if down, move down one
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state; // first cell can't move up, last cell can't move down (invalid state udpate)
        }
        // now, swap the two cells
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;
        return state;
      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);
        return state;
      case ActionType.INSERT_CELL_BEFORE:
        const cell: Cell = {
          content: "",
          type: action.payload.type,
          id: randomId(),
        };
        state.data[cell.id] = cell; // set new id to newly created cell
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id // find index of the cell we want to insert before
        );
        if (foundIndex < 0) {
          state.order.push(cell.id); // if not found, insert at the end
        } else {
          state.order.splice(foundIndex, 0, cell.id); // use immer to insert cell id into order array
        }
        return state;
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload; // destructure the payload for readability
        state.data[id].content = content; // find appropriate cell and update content
        return state;
      default:
        return state;
    }
  },
  initialState
);

const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default cellsReducer;
