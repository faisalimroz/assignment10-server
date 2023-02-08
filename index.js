const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app=express();
const port =process.env.PORT|| 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tort7uo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
         await client.connect()
         const productCollection=client.db('assignment10').collection('products');
         const orderCollection=client.db('assignment10').collection('order')
         app.get('/product',async(req,res)=>{
            const query={}
            const cursor =productCollection.find(query)
            const products= await cursor.toArray();
            res.send(products)
         })
         //post
         app.post('/addproduct',async(req,res)=>{
            const newProduct=req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
         })

         //delete a product
         app.delete('/product/:id',async(req,res)=>{
            const id= req.params.id;
            const query={_id:(ObjectId(id))};
            const result= await productCollection.deleteOne(query)
            res.send(result);
         })


         app.get('/order',async(req,res)=>{
            console.log(req.query);
            let query={};
            if(req.query.email){
                query={
                    email:req.query.email
                }
            }
            const cursor=orderCollection.find(query);
            const orders=await cursor.toArray();
            res.send(orders)
         })
         //order api
         app.post('/order',async(req,res)=>{
            const order=req.body;
            const result=await orderCollection.insertOne(order);
            res.send(result)
         })
    }
    finally{

    }
}
run().catch(console.dir)
//middleware

app.use(cors())
app.use(express.json())


app.get('/',(req,res)=>{
    res.send('running server')
})
app.listen(port,()=>{
    console.log('listening to port')
})