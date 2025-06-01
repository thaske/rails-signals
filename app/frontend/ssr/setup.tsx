import { QueryClient, dehydrate } from "@tanstack/solid-query";
import App from "../components/App";

export default function setup(url: string, props: Record<string, any>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: false,
        staleTime: 1000 * 60 * 5,
        retry: false,
      },
    },
  });

  const { query_data = [] } = props;
  query_data.forEach(
    ({ key, data }: { key: readonly string[]; data: unknown }) =>
      queryClient.setQueryData(key, data)
  );
  const state = dehydrate(queryClient);
  console.log(state);

  const app = (
    <>
      <App queryClient={queryClient} url={url} />
      <template id="state" data-state={JSON.stringify(state)} />
    </>
  );

  return { app, queryClient };
}
