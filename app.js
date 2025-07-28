const express = require("express");
const app = express();
const mongoose = require("mongoose");
//require for new rout

const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require(`method-override`);
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

//we are create a database 

// simple variable

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
//call main function

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

//create a function
async function main() {
    await mongoose.connect(MONGO_URL);
}

//for index.ejs  in views
//view engine setup

app.set("view engine","ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//we are create a basic api 
app.get("/", (req, res) => {
    res.send("Hi I am root");
});

// Index Route

app.get("/listings/", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//Create  a new router for new.ejs

app.get("/listings/new", (req, res) => {
   // ab ham here we are render a new form
   res.render("listings/new.ejs");
});

//show Route
app.get("/listings/:id", wrapAsync(async (req, res)=>{
    let{ id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//Creat route
app.post("/listings",wrapAsync(async(req, res, next) =>{
    //let={title,description, image, price, country, location}
    //let listing = req.body.listing;
         const newListing = new Listing(req.body.listing);
         await newListing.save();
         res.redirect("/listings");
})
    //console.log(listing);
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res)=>{
   let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});  
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req , res) =>{
 let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//Create a Delete Route
 app.delete("/listings/:id", wrapAsync(async(req,res) =>{
   let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
 }));

//create a new rout("this is sample url jiske under ham simple document ko add karke  test kar rahe he ")
//app.get("/testListing",async (req, res) => {
    //create new documents 
   // let sampleListing = new Listing({
       // title: "My New Villa",
       // description: "By the beach",
       // price: 1500,
       // location: "Calangut , Goa",
        //country: "India",
   // });
    //now save this samplelisting in the Database
    //await sampleListing.save();
    //after saving then print the console 
    //console.log("sample was saved");
    //again send the response in sever
   // res.send("Successful tesing");
//});

app.all("*",(req, res, next) =>{
    next(new ExpressError(404,"Page Not Found!"));
})
app.use((err, req, res, next) => {
    let{statusCode, message} = err;
    res.status(statusCode).send(message);
    // res.send("something went to wrong!");
});

app.listen(8080, () => {
    console.log("sever is listening to port 8080");
});