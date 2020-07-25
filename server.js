
const express = require('express')
const app = express()
const port = 3000
const bodyParser=require('body-parser')
const bcrypt=require('bcrypt')
var admin = require("firebase-admin");

var serviceAccount = require(__dirname+'/activeattendee-firebase-adminsdk-ppvuw-33d8da74b2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://activeattendee.firebaseio.com"
});
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
var firebaseConfig = {
    apiKey: "AIzaSyCA8XO2TBfldvoES7YctGkDTccHvPCROEw",
    authDomain: "activeattendee.firebaseapp.com",
    databaseURL: "https://activeattendee.firebaseio.com",
    projectId: "activeattendee",
    storageBucket: "activeattendee.appspot.com",
    messagingSenderId: "98304474516",
    appId: "1:98304474516:web:566c124ea2fb4c23e26381",
    measurementId: "G-TTH6NL085N"
  };
app.set('view engine','ejs');

firebase.initializeApp(firebaseConfig);
// Get a reference to the database service
var database = admin.database();
function writeUserData(name, time) {
  admin.database().ref('ActiveUsers/' + name).set({
    name: name,
    time:time
  });
}
app.get('/401.jpg',(req,res)=>
{
  res.sendFile(__dirname+'/public/401.jpg');
})
app.get('/background.jpg',(req,res)=>
{
  res.sendFile(__dirname+'/public/background.jpg');
})
app.get('/book.png',(req,res)=>
{
  res.sendFile(__dirname+'/public/book.png');
})
app.get('/styles.css',(req,res)=>{
  res.sendFile(__dirname+'/public/css/styles.css');
})
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', (req, res) =>
{  res.sendFile(__dirname+'/public/index.html');
}
)
app.post('/',function(req,res){
  if(req.body.button=='login')
  res.sendFile(__dirname+'/public/login.html')
  else {
    res.sendFile(__dirname+'/public/register.html');
  }
});
app.get('/errorpage',function(req,res){
  res.sendFile(__dirname+'/public/errorpage.html');
})
app.get('/login',function(req,res){
  var user = firebase.auth().currentUser;
    if(!user)
  res.sendFile(__dirname+'/public/login.html');
else
  res.redirect('/public/docspage');
})
app.get('/register',function(req,res){

  res.sendFile(__dirname+'/public/register.html');

})
   app.get('/docspage',(req,res)=>{
res.sendFile(__dirname+'/public/docspage.html');
});


app.listen(process.env.PORT||3000,function(){
  console.log("Listening to port 3000");
})
