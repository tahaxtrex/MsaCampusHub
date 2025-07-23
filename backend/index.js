const express = require("express");
const app = express();
const Axios = require("axios");
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config();

app.use(cors());

app.get('/prayertime', async (req, res)=>{
    try {
        const data = await Axios.get(process.env.SALAT_API);
        res.json(data.data.data.timings);
    } catch (error) {
        res.status(404).send('data not found');
    }
});


app.listen(process.env.PORT, ()=>{
    console.log("app is listening")
});