require('dotenv').config()
const express = require('express');
const dbConnect = require('./src/config/dbConnect');
const app = express()
const port = process.env.PORT || 8888
// const authRouter = require('./src/routes/authRoute')
const initAuthRoutes = require('./src/routes/authRoute')
const brandRouter = require('./src/routes/brandRoute')
const productRouter = require('./src/routes/productRoute')
const categoryRouter = require('./src/routes/categoryRoute')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./src/middewares/errorHandler');
const cors = require('cors')

app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//config req.body
app.use(bodyParser.json({ limit: '50mb' })) // Used to parse JSON bodies
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); //Parse URL-encoded bodies
app.use(cookieParser())

//‘self running’ function.
initAuthRoutes(app)
// app.use('/api/user', authRouter);
app.use('/api', brandRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);

app.use(notFound);
app.use(errorHandler);
(async () => {
    try {
        //using mongoose 
        //--start--

        await dbConnect()

        //--end--

        //using mongodb driver
        //-- start--

        //--end--
        app.listen(port, () => {
            console.log(`Backend Nodejs is Running on the port: ${port}`)
        })
    } catch (error) {
        console.log("Error connect to DB: ", error);
    }
})()  