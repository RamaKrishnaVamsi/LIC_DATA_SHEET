require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// app.use(cors());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));

app.get("/" , (req , res) =>{
    res.json({
        message : "Backend is running succesfully"
    })
})

//router
const authRouter = require("./src/router/authRouter.js");
app.use("/api/auth" , authRouter)

const insuranceRouter = require("./src/router/insuranceRouters.js")
app.use("/api/insurance" , insuranceRouter)

//DataBase Connection
require("./src/config/db.js")

const port = Number(process.env.PORT) || 8080

app.listen(port ,"0.0.0.0", ()=>{
    console.log("Server is running at ",port);
})