import config from "./config";
import { initDB } from "./db";
import app from "./modules/app";

const main = async () => {
  await initDB();
  app.listen(config.port, () => {
    console.log(`Server is running at port ${config.port}`);
  });
};

main();
