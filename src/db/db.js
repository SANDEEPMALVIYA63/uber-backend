import mongoose from "mongoose";

const DbCannect = async () => {
  try {
    const DbName = process.env.DBName 
    const url = process.env.MONGODB_URL 
    //|| "mongodb://localhost:27017";

    const MongoURl = `${url}/${DbName}`;
    await mongoose.connect(`${MongoURl}`);
    console.log(`db connection successfully  ${MongoURl}`);
  } catch (error) {
    console.log(`db cannection failed ${error}`);
    process.exit(1);
  }
};

export default DbCannect;
