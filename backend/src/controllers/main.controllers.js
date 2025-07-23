import Axios from "axios"


export const getPrayerTime = async (req, res)=>{
    try {
        const data = await Axios.get(process.env.SALAT_API);
        res.json(data.data.data.timings);
    } catch (error) {
        res.status(404).send('data not found');
    }
}