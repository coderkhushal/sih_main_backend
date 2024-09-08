// write a express app
import express from 'express';
import { Request, Response } from 'express';
import cors from "cors"
import bodyParser from 'body-parser';
const app = express()
app.use(express.json())
app.use(cors({
    credentials: true,
    allowedHeaders:"*",
    origin:"*"
}));
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
// app.use(ratelimiter)
app.use("/auth", require("./routes/auth"))
app.use("/startup"  , require("./routes/startup"))
app.use("/patent"  , require("./routes/patents"))
app.use("/grants", require("./routes/grants"))
app.use("/investor", require("./routes/investors"))
app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})