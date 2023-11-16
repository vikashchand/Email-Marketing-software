const express =require('express')
const env=require('dotenv').config()


const dbConfig=require('./config/dbConfig')
//const cors=require("cors");

const app=express()
const fs = require('fs');
const path = require('path');

const user=require('./Routes/userRouter')
const webRouter=require('./Routes/webRoutes')
const templateRoutes = require('./Routes/templateRoutes');

const customerRoutes = require('./Routes/customerRoutes');


const bodyParser = require('body-parser')
const mailRoutes = require('./Routes/mailRoutes');


// Use your routes

// const corsOptions = {
//    origin: 'https://localhost:3000',
//    credentials: true,
//    optionSuccessStatus: 200,
//  };
//  app.use(cors(corsOptions));


const cors = require('cors');
const corsOptions ={
    origin:'https://email-marketing-software.vercel.app', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/template', templateRoutes);
app.use('/user', user);
app.use('/mail', mailRoutes);
app.use('/', webRouter);
app.use('/', customerRoutes);
const PORT =process.env.PORT

app.listen(PORT,console.log(`server is listening on ${PORT}`))
