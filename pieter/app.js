//NPM packages
console.log('APP.js started');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


//local packages
const dosentRoute = require('./api/routes/dosente');
const vakkeRoute = require('./api/routes/subjects');
const demiRoute = require('./api/routes/Demi');
const userRoute = require('./api/routes/user');
const anounceRoute = require('./api/routes/anounce');
const applicationRoute = require('./api/routes/application');
const imageRoute = require('./api/routes/images');
const hoursRoute = require('./api/routes/hours');


console.log('APP.js net voor middleware');
app.use(morgan('combined', { stream: accessLogStream }));

//CORS ERROR HANDLING INGEBOU***********(2)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
res.header('Access-Control-Allow-Origin','*');
res.header('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-Type,Accept, Authorization');
if(req.method === 'OPTIONS')
{
  res.header('Access-Control-Allow-Methods','PUT,POST,PATCH, DELETE,GET');
  return res.status(200).json({});
}
next();
});
//CORS ERROR HANDLING EINDE******************(2)
//routes to handle requests///////(3)

app.use('/dosente',dosentRoute);
app.use('/subjects',vakkeRoute);
app.use('/demi',demiRoute);
app.use('/user',userRoute);
app.use('/anounce',anounceRoute);
app.use('/application',applicationRoute);
app.use('/image',imageRoute);
app.use('/hours',hoursRoute);

app.use('./uploads',express.static('uploads'));
//********************(3) */
//algemene errors hanteer soos 500 internal server errors*******(4)
app.use((req,res,next)=>{
  const error = new Error('not found');
  error.status = 404;
  next(error);


});
app.use((error,req,res,next)=>{
  res.status(error.status || 500);
  console.log(error);
  res.json({
    error:{ message: error.message}

  });

});
//**************************** (4)*/
module.exports = app;
// mongod.exe --dbpath /Users/User/mongodata      C:\Program Files\MongoDB\Server\4.0
