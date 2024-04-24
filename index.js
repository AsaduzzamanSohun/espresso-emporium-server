const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.k7dzav4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        // Send a ping to confirm a successful connection

        const coffeeCollection = client.db('espressoDB').collection('espresso');

        app.get('/coffees', async(req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        });

        app.get('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const result = await coffeeCollection.findOne(filter);
            res.send(result)
        });


        app.post('/coffees', async(req, res) => {
            const coffeeDetails = req.body;
            const result = await coffeeCollection.insertOne(coffeeDetails);
            res.send(result);
        });

        app.put('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updatedCoffee = req.body;
            const update = {
                $set: {
                    name: updatedCoffee.name, 
                    quantity: updatedCoffee.quantity, 
                    supplier: updatedCoffee.supplier, 
                    taste: updatedCoffee.taste, 
                    category: updatedCoffee.category, 
                    details: updatedCoffee.details, 
                    photo: updatedCoffee.photo, 
                    price: updatedCoffee.price
                }
            }
            const result = await coffeeCollection.updateOne(filter, update, options);
            res.send(result)
        })


        app.delete('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {_id: new ObjectId(id)};
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('espresso emporium server is running');
})

app.listen(port, () => {
    console.log(`This server is running on: ${port}`);
})