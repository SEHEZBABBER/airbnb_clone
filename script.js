const express = require('express');
const app = express();
const mongoose = require('mongoose');
const list = require('./models/listings.js')
main().then(()=>{
    console.log("Conenction Succesful");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    const MONGO_URL = 'mongodb://127.0.0.1:27017/wander_lust'; 
    await mongoose.connect(MONGO_URL);
}
app.listen(8080,()=>{
    console.log("listening through port 8080");
});
app.get('/',(req,res)=>{
    res.send("home root working");
});
app.get('/testconnection',async(req,res)=>{
    let sample = new list({
        title : "Property1",
        description : "This is Wonderful Property",
        price:7000,
        location:"punjab",
        country:"india"
    });
    await sample.save();
    console.log("save succesful");
    res.send("working well");
});