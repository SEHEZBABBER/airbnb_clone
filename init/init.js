const dotenv = require("dotenv");
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require('mongoose');
const data = require('./data.js');
const list = require('../models/listings.js')
main().then(()=>{
    console.log("Conenction Succesful");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    const MONGO_URL = process.env.MONGO_URL; 
    await mongoose.connect(MONGO_URL);
}
const initDb = async()=>{
    await list.deleteMany({});
    let arr = data.data;
    arr = arr.map((dat)=>({...dat,owner:"67d343e673cd45145ba242fa"}));
    console.log(arr);
    await list.insertMany(arr);
    console.log("data saved succesfuly");
}
initDb();