import { app } from "./app";
import { runDb } from "./infrastructure/repostitories/db-mongo";
import {emailAdapter} from "./infrastructure/adapters/email-adapter";

const port = 3000 ;
app.listen(port, async () => {
  await runDb();
  console.log(`Example app listening on port ${port}`);
});
