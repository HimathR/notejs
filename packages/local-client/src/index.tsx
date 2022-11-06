import ReactDOM from "react-dom";
import CellList from "./components/cell-list";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Provider } from "react-redux";
import { store } from "./state";
import "./index.css";
import "bulmaswatch/superhero/bulmaswatch.min.css";
// import png from notejslogo.png
import png from "./notejslogo.png";
import MDEditor from "@uiw/react-md-editor";
import "./components/text-editor.css";
import { useEffect, useState } from "react";

const initcontents = `# Welcome to NoteJS!\nA JavaScript + Markdown editor! 
Click on a **code** or **text** button to get started. 
This application was built with React + TypeScript. 
Redux was used for state management and many of the components were taken from the AtlasKit UI 
from the Atlassian Design System.\n## Information: \n- [Github Repo](https://github.com/)\n
- [My LinkedIn](https://www.linkedin.com/in/himath-ratnayake/)\n
- [Portfolio Website](https://www.himathsprojects.xyz/)\n 
### PS: Click the NoteJS logo to close this modal!`;

const Results = () => (
  <div className="text-editor-card" id="intro">
    <div className="card-content">
      <MDEditor.Markdown source={initcontents || "Click To Edit"} />
    </div>
  </div>
);

const App = () => {
  const [showResults, setShowResults] = useState(true);
  const onClick = () => setShowResults(!showResults);

  // store showResults in local storage
  useEffect(() => {
    const showResults = JSON.parse(
      localStorage.getItem("showResults") || "true"
    );
    setShowResults(showResults);
  }, []);

  useEffect(() => {
    localStorage.setItem("showResults", JSON.stringify(showResults));
  }, [showResults]);

  return (
    <div className="main">
      <Provider store={store}>
        <div>
          <div className="title">
            <img
              src={png}
              className="notejsimg"
              alt="notejslogo"
              onClick={onClick}
            />
          </div>
          <div>{showResults ? <Results /> : null}</div>
          <CellList />
        </div>
      </Provider>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
