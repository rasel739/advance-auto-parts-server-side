const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
    
    res.send('Wellcome to assignment 12 server');
});


app.listen(port, () => {
    
    console.log('Start on assignment 12 server',port)
})
