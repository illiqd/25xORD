const fs = require("fs");
const axios = require("axios");
const _ = require("underscore");
const { MongoClient } = require("mongodb");

require("dotenv").config();

const client = new MongoClient(process.env.DB_URI);
const database = client.db("ordinals");
const inscriptions = database.collection("inscriptions");

// look at the index for every instance of penis without key:value of 25x: done.
// when there is 25 results with content-type png, jpg, or webp, then...
// for each one, download it's image file into a folder.

const lastIncluded = 1232370; // The last penis included in a 25x
const ORD_URL = "https://turbo.ordinalswallet.com";



const printPenis = async () => {
  const database = client.db("ordinals");
  const inscriptions = database.collection("inscriptions");

  // create an array (called "data") of instances of penis within the DB, which are at a greater inscription height than the last included penis
  const cursor = await inscriptions.find({
    penis: true,
    num: { $gte: lastIncluded },
  });
  const data = await cursor.toArray();


  // for each one of the DB enteries that have penis...
  for (const item of data) {

    // a function to fetch the filetype of the inscription that's being submitted
    const fetchSubmissionFiletype = async (id) => {
      const res = await axios.get(`${ORD_URL}/inscription/${id}`);
      return res.data.content_type;
    };

    // passing the above function the submissions ID 
    const submissionFiletype = await fetchSubmissionFiletype(item.content.id);

    // if an item within our DB has penis, and the content type of the inscription it references is an image...
    if (item.penis === true && (submissionFiletype === "image/png" || submissionFiletype === "image/jpeg" || submissionFiletype === "image/webp")) {
      console.log(item.content.id);
    }
  }

  process.exit();
};

printPenis();

// NEXT
// do all image processing

// NEXT 
// yeet to blockchain 

// NEXT
// upon verification, update the index 



