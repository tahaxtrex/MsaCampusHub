const express = require("express");
const app = express();
const   Axios = require("axios");



app.get('/prayertime', async (req, res)=>{
    try {
        const data = await Axios.get("https://api.aladhan.com/v1/timingsByCity?city=Bremen&country=Germany&method=12")
        res.json(data.data.data.timings)  
    } catch (error) {
        res.status(404).send('data not found')
    }
    
})


app.listen(8001, ()=>{
    console.log("app is listening")
})