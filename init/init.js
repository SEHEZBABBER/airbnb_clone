const mongoose = require('mongoose');
const data = require('./data.js');
const list = require('../models/listings.js')
main().then(()=>{
    console.log("Conenction Succesful");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    const MONGO_URL = 'mongodb://127.0.0.1:27017/wander_lust'; 
    await mongoose.connect(MONGO_URL);
}
const initDb = async()=>{
    await list.deleteMany({});
    let arr = data.data;
    arr = arr.map((dat)=>({...dat,owner:"67cc52779c9a8010feaa2841"}));
    console.log(arr);
    await list.insertMany(arr);
    console.log("data saved succesfuly");
}
initDb();