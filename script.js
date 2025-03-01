const express = require('express');
const app = express();
const mongoose = require('mongoose');
const list = require('./models/listings.js');
const path = require('path');
const methodOverride = require('method-override');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded(true));
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
app.get('/listings',async(req,res)=>{
    const data = await list.find();
    res.render("listings",{data});
});
app.get('/listings/edit/:id',async(req,res)=>{
    let {id} = req.params;
    let obj = await list.find({_id:id});
    res.render("edit",{obj : obj[0]});
})
app.patch('/listings', async (req, res) => {
    try {
        let obj = req.body;
        delete obj.__v;
        let result = await list.updateOne({ _id: obj._id }, { $set: obj });
        res.redirect(`/listings/${obj._id}`);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.delete('/listings/:id',async(req,res)=>{
    let {id} = req.params;
    await list.deleteOne({_id:id});
    res.redirect('/listings');
})
app.get('/listings/:id',async(req,res)=>{
    let {id} = req.params;
    let obj = await list.find({_id:id});
    res.render("prop_view",{obj : obj[0]});
})
// app.get('/testconnection',async(req,res)=>{
//     let sample = new list({
//         title : "Property1",
//         description : "This is Wonderful Property",
//         price:7000,
//         location:"punjab",
//         country:"india"
//     });
//     await sample.save();
//     console.log("save succesful");
//     res.send("working well");
// });