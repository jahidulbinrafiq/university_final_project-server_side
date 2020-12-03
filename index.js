const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');


const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();

const port = 5000

const app = express();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());

app.use(express.static('serviceImage'));



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ilj5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri,{useUnifiedTopology: true,useNewUrlParser: true });

client.connect(err => {

  const serviceCollection = client.db("creative").collection("services");

  const ordersCollection = client.db('creative').collection("orders");

  const adminCollection = client.db("creative").collection("admin");

  const feedbacksCollection = client.db("creative").collection("feedback");

  //services section

  app.post('/addService', (req, res) => {
   const addservice=req.body
   serviceCollection.insertOne(addservice)
   .then(result=>res.send(result.insertedCount>0))
  });

  app.get('/services',(req, res)=>{
    serviceCollection.find({})
    .toArray((error,document)=>{
        res.send(document)
      })
  })


  //feedback:

  app.post('/addFeedback',(req, res)=>{

     const feedback=req.body;
     feedbacksCollection.insertOne(feedback)
     .then(result =>res.send(result.insertedCount>0))
  })
  

  app.get('/feedbackUser',(req, res)=>{
    feedbacksCollection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  

  //order section
   app.post('/addOrder',(req, res)=>{
     const addOrder1=req.body
     ordersCollection.insertOne(addOrder1)
     .then(result=>res.send(result.insertedCount>0))

   })

   app.get('/orders', (req, res) => {
    const email = req.query.email
    ordersCollection.find({customerEmail:email})
    .toArray((err,documents) =>(
      res.status(200).send(documents)
    ))
     });

   
     app.get('/allOrder',(req, res)=>{
      ordersCollection.find({})
      .toArray((err,documents) =>{
        res.send(documents)
      })
     })
   


     //admin section
   
    app.post('/addAdmin',(req,res) =>{
      const addNewAdmin=req.body;
      console.log(addNewAdmin)
      adminCollection.insertOne(addNewAdmin)
      .then(result =>res.send(result.insertedCount>0))
    })

    app.post('/isAdmin',(req,res) =>{
      const email=req.body.email;
      adminCollection.find({email:email})
      .toArray((err,admin)=>{
        res.send(admin.length>0)
      })
    })

});

app.get('/', (req, res) => {
  res.send('creative agency server Successfully Connected')
})

app.listen(process.env.PORT||port)