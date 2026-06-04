require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/' , (req,res)=>{
    res.send("Working fine");
})
app.use((req,res)=>{
    res.status(404).json({message:"Page Not Found"});
})

const PORT = process.env.PORT ;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})