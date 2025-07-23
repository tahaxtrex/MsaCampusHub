import express from "express"
import Axios from "axios"


const router = express.Router();

router.get('/', async (req, res)=>{
    try {
        res.send("hello")
    } catch (error) {
        res.status(404).send('data not found');
    }
});


export default router