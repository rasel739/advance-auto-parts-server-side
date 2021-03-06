const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8drhn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {

    try {
        client.connect();

        const database = await client.db('advance-car-parts');
        const carPartsCollection = await database.collection('car-parts-all');
        const addToCartCollection = await database.collection('add-to-cart');
        const userCollection = await database.collection('user');
        const userReviewCollection = await database.collection('user-review');
        const populerCollection = await database.collection( "populer_Catagory" );
                                                      
        //add-car-parts
        app.post('/addCarParts',async(req,res)=>{

            const item = req.body;
            const result = await carPartsCollection.insertOne(item);
            res.send(result.acknowledged);
        })

        //get-car-parts-all
        app.get('/carPartsAll', async (req, res) => {
            
            const result = await carPartsCollection.find({}).toArray();

            res.send(result)
        })

        //get-car-parts single details
        app.get('/carPartsSingle/:id', async (req, res) => {

            const detailsId = req.params.id;

            const result = await carPartsCollection.find({ _id: ObjectId(detailsId) }).toArray();
            
            res.send(result)

        })

        //Car Parts Add to Cart
        app.post('/carPartsAddToCart', async (req, res) => {

            const product = req.body;

            const result = await addToCartCollection.insertOne(product)

           res.send(result.acknowledged)

        })

        // my order
        app.get("/myOrder/:email", async (req, res) => {

            const email = req.params.email;

            const result = await addToCartCollection.find({ email: email }).toArray();
            
            res.send(result)
        });

        //delete my Order
        app.delete("/deleteMyOrder/:id", async (req, res) => {

            const id = req.params.id;

            const result = await addToCartCollection.deleteOne({ _id:id });


           res.send(result);

        });

        //all order admin panel

        app.get('/allOrder', async (req, res) => {
            
            const result = await addToCartCollection.find({}).toArray();

            res.send(result);
        })

        //add user login data

        app.post('/userLoginData', async (req, res) => {

            const userData = req.body;

            const result = await userCollection.insertOne(userData);

           res.send(result.acknowledged);

        })
        //add user login data

        app.put('/userLoginData', async (req, res) => {

            const user = req.body;

            const filter = { name: user.name, email: user.email }
            
            const options = { upsert: true }
            
            const updateUser = { $set: user }

            const result = await userCollection.updateOne(filter, updateUser, options);

            res.send(result);

        });

        //make admin 

        app.put('/makeAdmin', async (req, res) => {

            const user = req.body;

            const filter = { email: user.email }
            
            const admin = { $set: { role: 'admin' } }
            
            const result = await userCollection.updateOne(filter, admin);
            
            res.send(result);
           
        });

        // search admin

        app.get("/userAdmin/:email", async (req, res) => {
            
            const email = req.params.email

            const result = await userCollection.find({ email: email }).toArray();

            res.send(result);
        });

        // add user Review 
        app.post("/addReview", async (req, res) => {

            const reviewItem = req.body;
            const result = await userReviewCollection.insertOne(reviewItem);

            res.send(result)

        });

        //get user Review
        app.get("/getReview", async (req, res) => {

            const result = await userReviewCollection.find({}).toArray();

            res.send(result)
        });

        //order update status

        app.put("/updateStatus/:id", async (req, res) => {

            const status = req.body;
            const id = req.params.id;
           
            const result = await addToCartCollection.updateOne({ _id: id }, {
               
                $set: {
                    status: status.status
                }

            })

            res.send(result.acknowledged)
        });

        //get populer Catagory

        app.get("/populerCatagory", async (req, res) => {
            
            const result = await populerCollection.find({}).toArray();

            res.send(result)
        });

    } finally {

        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    
    res.send('Wellcome to assignment 12 server');
});


app.listen(port, () => {
    
    console.log('Start on assignment 12 server',port)
})
