const express = require("express") ;
const app = express() ;
require("dotenv").config() ; 
const cookieParser = require("cookie-parser") ;
const cors = require("cors") ;

const main = require("./config/database") ; 
const redisClient = require("./config/redis") ;
const authRouter = require("./routes/Auth") ;
const problemRouter = require("./routes/problem") ;
const submitRouter = require("./routes/submit") ;
const aiRouter = require("./routes/chatAi");

app.use( express.json() ) ;
app.use( cookieParser() ) ;


app.use( cors({
    origin : "http://localhost:5173" , 
    credentials : true
})) 


app.use( "/user" , authRouter ) ;
app.use( "/problem" , problemRouter ) ;
app.use("/submission" , submitRouter ) ; 
app.use("/ai" , aiRouter ) ;








const InitializeConnection = async ()=>{

    try{

        await Promise.all([ main() , redisClient.connect() ]) ;
        console.log("DB connected ...... ") ;

        app.listen( process.env.PORT , ()=>{
            console.log("App listening at PORT : " + process.env.PORT ) ;
        })
    }
    catch(err ){
        console.log("Err : " + err.message ) ;
    }
}

InitializeConnection() ;
