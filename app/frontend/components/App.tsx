import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import "./App.scss";
import FlashMessages from "./FlashMessages";
import PostEdit from "./posts/PostEdit";
import PostNew from "./posts/PostNew";
import PostShow from "./posts/PostShow";
import PostsList from "./posts/PostsList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FlashMessages />
      <Router>
        <Route path="/" component={PostsList} />
        <Route path="/posts/new" component={PostNew} />
        <Route path="/posts/:id" component={PostShow} />
        <Route path="/posts/:id/edit" component={PostEdit} />
      </Router>
    </QueryClientProvider>
  );
}
