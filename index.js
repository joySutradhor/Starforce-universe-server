const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// console.log(process.env.DB_PASS)

// MidleWare 

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.40yptof.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();
        const database = client.db("starUniverse");
        const comicsCollection = database.collection("comicsCollections")



        app.get("/comics", async (req, res) => {
            const cursor = comicsCollection.find().limit(20);
            const comics = await cursor.toArray();
            res.send(comics);
        })

        app.get("/comics/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await comicsCollection.findOne(query);
            res.send(result)
        })

        app.get("/myComics", async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const options = {
                sort: { "price": 1 }
            }
            const result = await comicsCollection.find(query, options).toArray();
            res.send(result)
        })
        // app.get("/search", async (req, res) => {
        //     let query = {};
        //     if (req.query?.email) {
        //         query = { email: req.query.email }
        //     }
        //     const result = await comicsCollection.find(query).toArray();
        //     res.send(result)
        // })

        app.get("/search/:text", async (req, res) => {
            const text = req.params.text;
            const Alldata = await comicsCollection.find().toArray();
            const result = Alldata.filter((data) => data.name.toLowerCase().includes(text.toLowerCase()));
            res.send(result);
          });

        app.get("/superHero" , async(req, res) => {
            const query = {cetegory : "SuperHero"} ;
            const data = comicsCollection.find(query)
            const result = await data.toArray();
            res.send(result)
        })
        app.get("/adventure" , async(req, res) => {
            const query = {cetegory : "Adventure"} ;
            const data = comicsCollection.find(query)
            const result = await data.toArray();
            res.send(result)
        })
        app.get("/ScienceFiction" , async(req, res) => {
            const query = {cetegory : "Science Fiction"} ;
            const data = comicsCollection.find(query)
            const results = await data.toArray();
            res.send(results)
        })

        


        app.put("/comics/:id", async (req, res) => {
            const id = req.params.id;
            const newComic = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    price: newComic.price,
                    quantity: newComic.quantity,
                    description: newComic.description,
                }
            }
            const updatedComic = await comicsCollection.updateOne(filter, updateDoc, options)
            res.send(updatedComic)
        })

        app.post("/comics", async (req, res) => {
            const newComic = req.body;
            const result = await comicsCollection.insertOne(newComic);
            res.send(result)
        })

        app.delete("/comics/:id" ,async (req, res) => {
            const id = req.params.id ;
            const query = {_id : new ObjectId(id)};
            const result = await comicsCollection.deleteOne(query)
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(" successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.connect();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello pain!')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})