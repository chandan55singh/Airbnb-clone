const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//we are creating listing
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String ,
    image: {
        filename:String, 
        url:{
            type: String,
            // default:"https://unsplash.com/photos/mountains-reflect-in-a-still-blue-lake-Wr0vLdN3roE",

        set: function (v) {
           return v.trim() ==="" 
        ? "https://unsplash.com/photos/mountains-reflect-in-a-still-blue-lake-Wr0vLdN3roE": v;
       },
    },
  },
    price: Number,
    location: String ,
    country: String ,
});
//es Schema ki help se ham es model ko create karenge
const Listing = mongoose.model("Listing",listingSchema ); //now we  this model exports in app.js inside
module.exports = Listing;