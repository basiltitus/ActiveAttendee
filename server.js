
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
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
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

app.get('/background.jpg',(req,res)=>
{
  res.sendFile(__dirname+'/public/background.jpg');
})
app.get('/styles.css',(req,res)=>{
  res.sendFile(__dirname+'/public/css/styles.css');
})
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', (req, res) =>
{var user = firebase.auth().currentUser;
  if(!user)
  res.sendFile(__dirname+'/public/index.html');
else {
  res.redirect('/docspage');
}
})
app.post('/',function(req,res){
  if(req.body.button=='login')
  res.sendFile(__dirname+'/public/login.html')
  else {
    res.sendFile(__dirname+'/public/register.html');
  }
})
app.get('/login',function(req,res){
  var user = firebase.auth().currentUser;
    if(!user)
  res.sendFile(__dirname+'/public/login.html');
else
  res.redirect('/public/docspage');
})
app.post('/login',async(req,res)=>{
  console.log(req.body)
  var email=req.body.email;
  var password=req.body.password;
  await firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
res.render("error",{errorWords:errorMessage});
  // ...
});
res.redirect('/docspage')
})
app.get('/register',function(req,res){
  var user = firebase.auth().currentUser;
    if(!user)
  res.sendFile(__dirname+'/public/register.html');
  else {
    res.render('/docspage');
  }
})
app.post('/register',async(req,res)=>{
var name=req.body.name;
var email=req.body.email;
var password=req.body.password;
console.log(email);
  await firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
res.render("error",{errorWords:errorMessage});

  });
  var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name,

}).then(function() {
  // Update successful.
res.redirect('/docspage');
}).catch(function(error) {
  // An error happened.
});

   })


   app.get('/docspage',(req,res)=>{
     var user = firebase.auth().currentUser;

if (user) {
writeUserData(user.displayName,'online');
res.sendFile(__dirname+'/public/docspage.html')

} else {
  // No user is signed in.
  res.render("error",{errorWords:'You are not authorized to view this page'});
}
   })


app.post('/docspage',(req,res)=>
{ var user = firebase.auth().currentUser;
  writeUserData(user.displayName,'offline');
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  res.redirect('/');
}).catch(function(error) {
  // An error happened.
  res.send(error);
});
})
app.listen(process.env.PORT||3000,function(){
  console.log("Listening to port 3000");
})
