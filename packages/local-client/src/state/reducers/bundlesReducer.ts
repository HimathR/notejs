import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";

interface BundlesState {
  [key: string]:
    | {
        loading: boolean; // are we currently bundling the cell?
        code: string;
        err: string;
      }
    | undefined;
}

const initialState: BundlesState = {}; // initially we have no bundles for any cells

const bundlesReducer = produce(
  // produce is what allows us to mutate the state object
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        // mutate the current state object by looking up the cell id and setting the loading property to true
        // we also need to throw away any previous code or error messages (bundles) that exist
        state[action.payload.cellId] = {
          loading: true,
          code: "",
          err: "",
        };
        return state;
      case ActionType.BUNDLE_COMPLETE:
        // mutate the current state object by looking up the cell id and setting the loading property to false
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err,
        };
        return state;
      default:
        return state;
    }
  },
  initialState
);
export default bundlesReducer;
