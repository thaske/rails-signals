import { hydrate as hydrateQuery, QueryClient } from "@tanstack/solid-query";
import { hydrate, render } from "solid-js/web";
import App from "../components/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const root = document.getElementById("app");

if (!root) {
  throw new Error("Root element not found");
}

if (root.children.length) {
  const stateEl = document.getElementById("state");
  const state = JSON.parse(stateEl?.dataset.state ?? "{}");
  stateEl?.remove();
  hydrateQuery(queryClient, state);
  hydrate(
    () => <App queryClient={queryClient} url={window.location.pathname} />,
    root
  );
} else {
  render(
    () => <App queryClient={queryClient} url={window.location.pathname} />,
    root
  );
}
