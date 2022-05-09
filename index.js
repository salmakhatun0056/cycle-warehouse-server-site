const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const ObjectId = require('mongodb').ObjectId
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000

//middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adbmu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db('warehouse').collection('items');

        app.get('/items', async (req, res) => {
            const query = {}
            const cursor = itemsCollection.find(query)
            const items = await cursor.toArray()
            res.send(items)
        })

        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.findOne(query);
            res.send(result);
        });

        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('running my project')
})

app.listen(port, () => {
    console.log('Listening to  Port', port)
})