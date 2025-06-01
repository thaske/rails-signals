import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

const PostEdit = lazy(() => import("./posts/PostEdit"));
const PostNew = lazy(() => import("./posts/PostNew"));
const PostShow = lazy(() => import("./posts/PostShow"));
const PostsList = lazy(() => import("./posts/PostsList"));

import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import "./App.scss";

export default function App({
  queryClient,
  url,
}: {
  queryClient: QueryClient;
  url: string;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router url={url}>
        <Route path="/" component={PostsList} />
        <Route path="/posts/new" component={PostNew} />
        <Route path="/posts/:id" component={PostShow} />
        <Route path="/posts/:id/edit" component={PostEdit} />
      </Router>
    </QueryClientProvider>
  );
}
