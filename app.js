var express = require('express');
var app = express();
const https = require("https");
var mysql = require('mysql');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
const fs = require("fs");
path = require('path');
const cors = require('cors');
appRoot = __dirname;


app.use(useragent.express());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // support encoded bodies

// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token,usr_id,clnt_id,appname');
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     // Pass to next layer of middleware
//     next();
// });

const corsOptions = {
    origin: '*', // or specific domains ['http://localhost:8100']
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions)); // ✅ AFTER defining corsOptions

app.use(logErrors);

app.use('/nodeapp', require('./routes/routes'));

app.use('/dashboard_api', require('./dashboard_api/routes/routes'));

app.use('/public_app', require('./public_app/routes/public_routes'));

app.use('/delivery_boy', require('./delivery_boy/routes/delivery_routes'));

app.use('/vendor_app', require('./vendor_app/routes/vendor_routes'));

var sch = require('./utils/schedules');

sch.scheduleScripts(function (err) {

});



function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

app.get('/', function (req, res) {
    const http = require('http');

http.get('http://ec2-13-126-76-184.ap-south-1.compute.amazonaws.com:80', (rrr) => {
  console.log('STATUS:', rrr.statusCode);
  console.log('HEADERS:', rrr.headers);
  res.on('data', (chunk) => {
    console.log('BODY:', chunk.toString());
  });
}).on('error', (e) => {
  console.error('Got error:', e.message);
});
    res.send("RareYourWear Server ");
});

var server = app.listen(2410, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('RareYourWear Server is listening at http://%s:%s', host, port);
});

// https.createServer({
//     key: fs.readFileSync('./privatekey.pem'),
//     cert: fs.readFileSync('./cert.crt'),
//     passphrase: '123456'
// }, app)
//     .listen(2022);
// console.log('ProductBase is listening at http://%s:%s 2024');


const socket = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// socket.on('connection', socket => {
//   console.log('✅ Socket connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('❌ Socket disconnected:', socket.id);
//   });
// });

socket.on('connection', (socket) => {
  console.log('✅ Browser connected via socket:', socket.id);
});

// Make Socket.IO global
global.io = socket;