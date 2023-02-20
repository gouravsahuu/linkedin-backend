const express = require("express");
require("dotenv").config();
const port = process.env.port;
const {connection} = require("./Configs/db");
const {userRoute} = require("./Routes/user.routes");
const {postRoute} = require("./Routes/post.route");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users",userRoute);
app.use("/posts",postRoute);

app.listen(port, async () => {
    try{
        await connection;
        console.log("Connected to Database");
    }
    catch(err){
        console.log(err.message);
    }
    console.log(`Server is running at port ${port}`);
})