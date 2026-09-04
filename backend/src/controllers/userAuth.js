const User = require("../models/userSchema") ; 
const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken") ;
const validate = require("../utils/validate") ;
const redisClient = require("../config/redis");
const Submission = require("../models/submissionSchema");


const register = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validate(req.body);

    req.body.password = await bcrypt.hash(password, 10);

    req.body.role = 'user' ;

    const user = await User.create(req.body); // create user in DB

    const token = await jwt.sign( { _id: user._id, emailId: user.emailId , role : user.role }, process.env.JWT_KEY, { expiresIn: 3600 } );

    res.cookie("token", token, { 
      maxAge: 3600 * 1000 ,
      httpOnly: true, 
      secure: true,
      sameSite: "none"
    }); // Here we multiplied by 1000 because maxAge uses milisecond value

    // send reply to user : { _id , emailId , firstName} 

    const reply = {
      _id : user._id , 
      firstName : user.firstName , 
      emailId : user.emailId , 
      role : user.role 
    }

    res.status(201).json( { 
      user : reply , 
      message : "User created successfully " 
    }); 


  } 
  catch (err) {
    console.log(err);
    console.log(err.message);
    res.status(400).json({
        error: err.message,
    });
}
};



const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId) {
      throw new Error("Please enter a valid email address ");
    }

    if (!password) {
      throw new Error("Please enter your password ");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error("Invalid credentials ...... ");

    const token = jwt.sign( { _id: user._id, emailId: user.emailId , role : user.role }, process.env.JWT_KEY, { expiresIn: 3600 } );

     res.cookie("token", token, { 
      maxAge: 3600 * 1000 ,
      httpOnly: true, 
      secure: true,
      sameSite: "none"
    });
  
    // send reply to user : { _id , emailId , firstName} 
    const reply = {
      _id : user._id , 
      firstName : user.firstName , 
      emailId : user.emailId , 
      role : user.role
    }

    res.status(200).json( { 
      user : reply , 
      message : "User created successfully " 
    }); 

    
  } 
  catch (err) {
    res.status(400).send("Err: " + err.message);
  }
}; 



const logout = async ( req , res ) => {

  try{

    const { token } = req.cookies ;
    
    const payload = jwt.verify(token, process.env.JWT_KEY);

    await redisClient.set( `token:${token}` , "Blocked" ) ;
    await redisClient.expireAt( `token:${token}` , payload.exp ) ;

    res.cookie( "token" , null , {expires : new Date( Date.now())}) ;
    res.status( 200 ).send("Logout Successfull ") ;

  }

  catch( err ){
    res.status( 400 ).send("Err : " + err.message ) ;
  }

} 


const adminRegister = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validate(req.body);

    req.body.password = await bcrypt.hash(password, 10);

    req.body.role = 'admin' ;

    const user = await User.create(req.body); // create user in DB

    const token = await jwt.sign( { _id: user._id, emailId: user.emailId  , role : user.role }, process.env.JWT_KEY, { expiresIn: 3600 } );

    res.cookie("token", token, { maxAge: 3600 * 1000 }); // Here we multiplied by 1000 because maxAge uses milisecond value

    res.status(201).send("Admin created successfully ");
  } 
  catch (err) {
    res.status(400).send("Err: " + err.message);
  }
}; 



// 5). To delete a user Profile 
const deleteProfile = async ( req , res ) => {

  try{ 

    const userId = req.result._id ;

    await User.findByIdAndDelete( userId ) ;


    // also delete all the sumbissions related to that Id 

    // await Submission.deleteMany({userId}) ;  

    // instead of this , we can also create a post function for deletesubssion for user , after its profile deletion is done , That post function will automatically delete its all submissionns .

    res.status( 200 ).send("Profile Deleted Successfully") ;

  } 
  catch( err ){
    res.status( 500 ).send("Err : " + err.message ) ;
  }
} 


// 6). CheckUser : It helps to authenticate the user , when try to relogin with same cookie 
const checkUser = ( req , res ) => {

  const reply = {
    _id : req.result._id , 
    firstName : req.result.firstName , 
    emailId : req.result.emailId ,
    role : req.result.role 
  } 

  res.status( 200 ).json({
    user : reply , 
    message : "Valid User"
  })

}




module.exports = { register , login , logout , adminRegister , deleteProfile , checkUser } ;
