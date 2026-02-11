import app from "./src/app.js";
import DbCannect from "./src/db/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

DbCannect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`server running is failed  port NO${err}`);
  });
