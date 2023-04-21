const fs = require("fs");
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

const printPenis = async () => {
  const database = client.db("ordinals");
  const inscriptions = database.collection("inscriptions");

  const cursor = await inscriptions.find({
    penis: true,
    num: { $gte: lastIncluded },
  });
  const data = await cursor.toArray();

  for (const item of data) {
    console.log("penis to be included in next 25x:");

    if (item.penis === true) {
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



