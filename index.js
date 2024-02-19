var express =require('express');
var bodyparser=require('body-parser');
const path =require('path');
var session = require('express-session');
const cookieParser = require('cookie-parser');
var multer = require('multer');
var upload=multer();
var app =express();


let portnumber =process.env.port || 5000;

//setup view engine
//app.set('views/register',path.join(__dirname));
//app.set('view engine','ejs');
app.set('views','./views');
app.set('view engine','pug');


// body-parser middleware
// to parse URL encoded data
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(express.static('public'));// serve the static files
app.use(upload.array() );   // for handling multipart/form-data, which is used by the login form

app.use(cookieParser()); // for parsing cookies
app.use(session({secret:'It is a secret message.'}));    // for session management


var users=[];

// to parse json data
//app.use(bodyparser.json());


// app.get('/',function (req,res) {
//     res.render('form');
// });
// app.post('/savedetails',(req,res)=>{
//     console.log('body-parser calles',req.body.uname);
//     console.log('body-parser calles',req.body.nsti);
//     console.log('body-parser calles',req.body.num);
// });


app.get('/', function(req, res){
    res.send(`
        <h1>Home page</h1>
        <button onclick="location.href='/register'">Register</button>
        <button onclick="location.href='/Signin'">Login</button>
    `);
});


app.get('/register', function(req,res){
    console.log("Register page opened");
    res.render('register');
});

app.post('/register',function(req,res){
    if(!req.body.uname || !req.body.pwd){
        res.status("400");
        res.send("Invalid data");
    }
    else{
        users.filter(function(user){
            if(user.uname === req.body.uname){
                console.log("user already present")
                res.render('register',{message:"User already exists. Please login."});
            }
        });
    var newUser = {uname:req.body.uname,pwd:req.body.pwd,email:req.body.email};
    users.push(newUser);
    req.session.user = newUser;
    console.log("new user added")
    res.redirect('/test');    
    }
});

/*app.get('/test',function(req,res){
    res.render('test');
});*/

function loginCheck(req,res,next){
    if(req.session.user){
        console.log("If the user is already logged in, proceed to the webpage");
        next(); // If the user is already logged in, proceed to the webpage
    }
    else{
        var err = new Error("Not logged in");
        console.log(req.session.user);
        next(err); // Unauthorized access to the page
    }
}


app.get('/test', loginCheck, function(req,res){
    res.render('test', {uname: req.session.user.uname});
});

app.get('/Signin',function(req,res){
    console.log("entered signin page");
    res.render('loginpage');
});

app.post('/Signin', function(req,res){
    console.log(users);
    if(!req.body.uname || !req.body.pwd)
    {
        console.log("enter both the uname and password");
        res.render('loginpage',{message:"Enter both the details username and password"});
    }
    else{
        users.filter(function(user){
            if(user.uname===req.body.uname && user.pwd===req.body.pwd){
                req.session.user = user;
                console.log("data logged in");
                //res.send(Username: ${user.uname} Password: ${user.pwd});
                res.redirect('/test');
            }
        })
        res.render('loginpage',{message:"Invalid details"});
    }
});

app.get('/logout',function(req,res){
    req.session.destroy(function(){
        console.log("user has been logged out.");
    });
    res.redirect('/Signin');
});

app.use('/test', function(err, req, res, next){
        console.log(err);
       //User should be authenticated! Redirect him to log in.
       res.redirect('/Signin');
    });


// Cookies

// app.get('/',function(req,res){
//     res.cookie('name','test-cookie',{expires:3600 + Date.now()}).send("cookie set");
// });

// Sessions

// app.get('/', function(req,res){
//     if(req.session.pagecount){
//         req.session.pagecount++;
//         res.send('Page view count '+req.session.pagecount);
//     }else{
//         req.session.pagecount = 1;
//         res.send('visiting for the first time.') ;
//     }
// });

// Clear cookies

// app.get('/clearcookie',function(req,res){
//     res.clearCookie('testkey');
//     res.send('cookie name deleted successfully');
// });

app.listen(portnumber ,function(error){
    if(error) throw error;
    console.log('Server Created on the port 5000 successfully');
});





// var routing_page= require("./routingpage");
// app.use('/routingpage',routing_page);

// var jsonparser=bodyparser.json();
// var urlencodedparser=bodyparser.urlencoded( { extended: false } ); 
// app.post('/login/:username',urlencodedparser,function (req,res) {
//     res.send('Welcome to '+req.params.username);
// });
// app.get('/users',jsonparser,function(req,res){
    
// });
// app.get('/routingpage/:value',function(req,res){
//     res.send('value is :'+req.params.value);
// });

//middlewar
// app.use(function(req,res,next){
//     console.log('Start Logged in at :'+Date.now());
//     next(); // next middleware which tells us that move on to the next request
// });
// app.get('/routing',function(req,res){
//     res.send('Middle page');
// });
// app.use('/',function(req,res){
//     // res.send('End Process');
//     console.log('End Process');
// });

// // to parse URL encoded data
// app.use(bodyparser.urlencoded({extended:false}));

// // to parse json data
// app.use(bodyparser.json());

// app.listen(5050);
