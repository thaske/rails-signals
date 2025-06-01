import { render } from "solid-js/web";
import App from "../components/App";

const root = document.getElementById("app");

if (!root) {
  throw new Error("Root element not found");
}

render(() => <App />, root);
