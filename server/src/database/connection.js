import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({path:'../.env'})

// const connection1 = mongoose.connect(`${process.env.CONNECTION_STRING}`)
//   .then(() => {
//     console.log("Database connected");
//   })
//   .catch((e) => console.log(e));

const connection=async ()=>{
  try{
    const connectionInstance=await mongoose.connect(`${process.env.CONNECTION_STRING}`)
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  }catch(err){
    console.log("MONGODB connection FAILED ", error);
    process.exit(1)
  }
}
export {connection}