const url = 'http://localhost:3000/api/products';
import axios from "axios";

const testing = async (req, res) => {
    console.log('Testing Product Controller...');
    try {
        const res = await axios.get(`${url}/69257dd69d07967e804b1197`);
        const data = await res.data;
        res.status(200).json(data);
        console.log(res);
    } catch (error) {
        console.log(error.message);
    }
}
testing()