//required packages
const fetch = require("node-fetch");
const express = require("express");
const res = require("express/lib/response");
require("dotenv").config();

//create express server
const app= express();

//server port number 
const PORT = process.env.PORT || 3000;

//set template engine
app.set("view engine","ejs");
app.use(express.static("public"));

//parse html -- request
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json());

//get route
app.get("/",(req, res)=>{
    res.render("index");
})

//post route
app.post("/convert", async(req, res)=>{
     const videoid = req.body.vidlink;
     if(videoid === "undefined"|| videoid === null || videoid === ""){
        return res.render("index",{success : false, message : "enter a video link"});
     }else{
        const fetchapi = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoid}`,{
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        });
        const fetchres = await fetchapi.json();

        if(fetchres.status === "ok")
           return res.render("index", {success : true, video_title : fetchres.title, vidlink : fetchres.link});
        else
           return res.render("index",{success : false, message : fetchres.msg})
     }
})

//start server
app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`);
})
