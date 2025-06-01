import express, { Request, Response } from "express";

import { dehydrate, QueryClient } from "@tanstack/solid-query";
import { generateHydrationScript, renderToString } from "solid-js/web";
import App from "../components/App";

const app = express();
const port = 3001;

app.use(express.json());

app.post("/", (req: Request, res: Response) => {
  console.log("req.body", req.body);

  const queryClient = new QueryClient();
  req.body.props.query_data.forEach((key: Array<string>, value: unknown) => {
    queryClient.setQueryData(key, value);
  });
  const state = dehydrate(queryClient);

  let html;
  try {
    html = renderToString(() => (
      <App queryClient={queryClient} url={req.body.url} />
    ));
  } catch (err) {
    console.error(err);
  } finally {
    const out = {
      body: html,
      head: generateHydrationScript(),
    };
    res.json(out);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
