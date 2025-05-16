const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anxcgnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("userManagementDB").collection("users");

    //get single user data from data base
    app.get("/users/:id", async (req, res) => {
        const id = req.params.id;
        const singleUser = {_id: new ObjectId(id)}
        const result = await userCollection.findOne(singleUser)
        res.send(result)
    })

    //get all user from database
    app.get("/users", async (req, res) => {
        const result = await userCollection.find().toArray()
        res.send(result)
    })

    //post user data in backend
    app.post("/users", async (req, res) => {
        const newUser = req.body
        const result = await userCollection.insertOne(newUser)
        res.send(result)
    })

    //delete user data from database
    app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("user management server successfully running")
})

app.listen(port, () => {
    console.log("Our user management system is running on:", port);
})