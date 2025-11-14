const   express = require('express');   
const   app = express();
const   bodyParser = require('body-parser');      
const   cors = require('cors'); 
const   AuthRouter = require('./Routes/AuthRouter'); 
const   ProductRouter = require("./Routes/ProductRouter");

require('dotenv').config();     
require('./Models/db'); 

const   PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('pong');
}); 

app.use(bodyParser.json());
app.use(cors());   



app.use('/auth', require('./Routes/AuthRouter'));

app.use("/products", ProductRouter);

// app.use("/products", require("./Routes/ProductRouter"));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 






app.get('/', (req, res) => {
    res.send('Hello, World!   server is up and running.');
}); 
