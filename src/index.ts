import { app } from "./app";
import { runDb } from "./db-mongo";
import {emailAdapter} from "./adapters/email-adapter";

const port = 3000;
app.listen(port, async () => {
  await runDb();
  console.log(`Example app listening on port ${port}`);
});
