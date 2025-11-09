const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.json());

const uri = "mongodb+srv://sifatforpc999:sifatforpc999@server1.qmz0oye.mongodb.net/?appName=server1";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const db = client.db('cfs-assignment-10')
    const foodcol1 = db.collection("foosie")
    const foodslist = db.collection("Foods")
    console.log(" Successfully connected hoise to MongoDB!");

    app.get('/', (req, res) => {
      res.send('Ping hoise!');
    });
    app.get('/testget', async (req, res) => {
      const query = await foodcol1.find().toArray();
      res.send(query);
    });
   app.get('/allfoods',async (req,res) => {
     const foods =await foodslist.find().toArray();
     res.send(foods)
   })
    app.post('/test', (req, res) => {

      const cursor = foodcol1.insertOne(req.body)

      res.send(cursor)
    })

    app.listen(port, () => {
      console.log(`🚀 Server chole hene at http://localhost:${port}`);
    });

  } catch (error) {
    console.error(" Error hoise re bhai:", error);
  }
}

run().catch(console.dir);
