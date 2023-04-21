const axios = require("axios");
const { MongoClient } = require("mongodb");
const _ = require("underscore");

require("dotenv").config();

const client = new MongoClient(process.env.DB_URI);
const FIRST_INSCRIPTION_NUM = 1232370; // 1 inscription before the penis.json test
const ORD_URL = "https://turbo.ordinalswallet.com";

const fetchContent = async (id) => {
  const res = await axios.get(`${ORD_URL}/inscription/content/${id}`);
  return res.data;
};

const fetchMetadata = async (id) => {
  const res = await axios.get(`${ORD_URL}/inscription/${id}`);
  return res.data;
};

const index = async () => {
  const database = client.db("ordinals");
  const inscriptions = database.collection("inscriptions");

  const cursor = await inscriptions.find({
    penis: { $exists: false },
    content_type: { $in: ["text/plain;charset=utf-8", "application/json"] },
    num: { $gte: FIRST_INSCRIPTION_NUM },
  });
  const data = await cursor.toArray();

  for (const item of data) {
    console.log("Updating database for item:");
    console.log(item);

    const content = await fetchContent(item.id);
    const metadata = await fetchMetadata(item.id);

    let penis = false;

    if (typeof content === "object" && content.p === "penis") {
      penis = true;

      await inscriptions.updateOne(
        { _id: item._id },
        { $set: { content, metadata, penis } }
      );

    }
  }

  process.exit();
};

index();
