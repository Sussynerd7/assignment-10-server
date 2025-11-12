const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
// var admin = require("firebase-admin");
const port = 3000;
app.use(cors());
app.use(express.json());

const logger = (req,res,next)=>{
  console.log('login info')
  next();
}
const verifyFirebase = (req,res,next)=>{
const token = req.headers.authorization.split(' ')[1]
// console.log(token)

if(!token){
  return res.send({message: "error with access"})
}
next();
}



// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

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
    const foodcol1 = db.collection("Foods-test-3-forposting")
    const foodrequests = db.collection("requested")
    const foodslist = db.collection("Foods")
    const foodslist1 = db.collection("Foods-test-1")
    const foodslist2 = db.collection("Foods-test-2")
    console.log(" Successfully connected hoise to MongoDB!");

    app.get('/', (req, res) => {
      res.send('Ping hoise!');
    });
    // app.get('/testget', async (req, res) => {
    //   const query = await foodcol1.find().toArray();
    //   res.send(query);
    // });
    app.patch('/request/:id', async (req, res) => {
      const foodid = req.params.id;

      const query = { _id: new ObjectId(foodid) }
      const { status,requestername,
             requesterimg,
               requestedfoodid } = req.body;

      const update = {
        $set: {
          status: status,
          requestername:requestername,
         requesterimg:requesterimg,
         requestedfoodid:requestedfoodid,
        }
      };

      const updatefood = await foodslist1.updateOne(query, update);

      const updatedfood = await foodslist1.findOne(query);

      const finalize = await foodrequests.insertOne(updatedfood);

      res.send({ message: 'we are done' })
      // .catch(err=>({message:'we are done'},err))
    });
    app.get('/allfoods', async (req, res) => {
      const foods = await foodslist1.find().toArray();
      res.send(foods)
    })
    app.post('/create', async (req, res) => {
      const newfood = req.body;

      const result = await foodcol1.insertOne(newfood);
      res.send(result)
    })
    app.get('/details/:id',logger,verifyFirebase, async (req, res) => {
      //data is in foodlist
      const foodid = req.params.id;

      const query = { _id: new ObjectId(foodid) }

      const food = await foodslist1.findOne(query);

      res.send(food)
    })
    app.get('/presorted', async (req, res) => {
      const foodsorted = await foodslist1.find().sort({ "capability": -1 }).toArray();
      res.send(foodsorted)
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
