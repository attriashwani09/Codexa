const { getLanguageById , submitBatch , submitToken } = require("../utils/problemUtility") ;
const problem = require("../models/problemSchema") ;
const User = require("../models/userSchema") ;
const { patch } = require("../routes/submit"); 
const submission = require("../models/submissionSchema") ;



// 1). createProblem in DB ( by admin only )
const createProblem = async( req , res ) => {

    const { title , description , difficulty , tags , visibleTestCases , hiddenTestCases , startCode , referenceSolution , problemCreator  }  =  req.body ;


    try{

        for( const { language , completeCode}  of referenceSolution ){

            const languageId = getLanguageById( language ) ;
            
            const submissions = visibleTestCases.map( (testcase ) => {
                return {
                    source_code : completeCode , 
                    language_id : languageId , 
                    stdin : testcase.input , 
                    expected_output : testcase.output 
                }
            }) 

            // console.log( submissions ) ;
            const submitResult = await submitBatch( submissions ) ;   // it will return an array of objects that have token value inside it 

            const resultToken = submitResult.map( (value) => value.token ) ;

            const testResult = await submitToken( resultToken ) ;  // now , it will return us whole output , alongwith status_id 's and everything
             
            console.log( testResult ) ;
             // checking if every testcase passed or not 
            for( const test of testResult ){

                if( test.status_id != 3 )
                    throw new Error("Error Ocuuered ...... ") ;
            } 
 

        } 

        // after clearing all test cases , now we can create the problem in database 
        await problem.create( { ...req.body , problemCreator : req.result._id }) ;
        res.status( 201 ).send("Problem saved successfully ") ;

    } 
    catch( err ){
        res.status( 400 ).send("Err : " + err.message ) ;
    }
} ;  



// 2). updateProblem : 
const updateProblem = async ( req , res ) => {

    try { 

        const { id } = req.params ;

        if( !id ){
            return res.status(400).send("Missing Id Field ........ ") ;
        }   

        const dsaProblem = await problem.findById( id ) ;

        if( !dsaProblem ){
            return res.status( 400 ).send("Id is not present in Database") ;
        }

        const { title , description , difficulty , tags , visibleTestCases , hiddenTestCases , startCode , referenceSolution , problemCreator  }  =  req.body ; 


        // Now , same process that was done in creation of problem : check all necessary things are present and checking if the reference solution is corrrect or not

        // creatng a batch sumbission 
        for( const { language , completeCode}  of referenceSolution ){

            const languageId = getLanguageById( language ) ;
            
            const submissions = visibleTestCases.map( (testcase ) => {
                return {
                    source_code : completeCode , 
                    language_id : languageId , 
                    stdin : testcase.input , 
                    expected_output : testcase.output 
                }
            }) 

            // console.log( submissions ) ;
            const submitResult = await submitBatch( submissions ) ;   // it will return an array of objects that have token value inside it 

            const resultToken = submitResult.map( (value) => value.token ) ;

            const testResult = await submitToken( resultToken ) ;  // now , it will return us whole output , alongwith status_id 's and everything
             
             // checking if every testcase passed or not 
            for( const test of testResult ){

                if( test.status_id != 3 )
                    throw new Error("Error Ocuuered ...... ") ;
            } 
 

        }   


        // after checking all testcases , now we can update the problem 

        const updatedDsaProblem = await problem.findByIdAndUpdate( id , { ...req.body} , { runValidators : true , returnDocument: "after" }) ; 

        res.status( 200 ).send( updatedDsaProblem ) ;

    } 
    catch( err ){ 
        res.status( 400 ).send("Err : " + err.message ) ;

    }
} 


// 3). DeleteProblem : 
const deleteProblem = async (req, res) => {

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Id Field Missing");
    }

    const deletedDsaProblem = await problem.findByIdAndDelete(id);

    if ( !deletedDsaProblem) {
      return res.status(404).send("Problem not found");
    }

    res.status(200).send("Problem deleted Successfully");

  } 
  catch (err) {

    res.status(400).send("Err : " + err.message);

  }
}; 



// 4). getProblem by Id : 
const getProblemById = async ( req , res ) => { 

    try{

        const { id } = req.params ;

        if( !id ){
            return res.status(400).send("Id Field Missing");  
        } 

        const requiredProblem = await problem.findById( id ).select("title description difficulty tags visibleTestCases startCode referenceSolution") ;

        if( !requiredProblem ){
            return res.status( 404 ).send("Problem Don't exist is Database ") ;
        } 

        res.status( 200 ).send( requiredProblem ) ; 

    } 
    catch( err ){
        res.status( 400 ).send("Err : " + err.message ) ;
    }
}  


// 5). getAllProblem 
const getAllProblems = async( req , res ) => { 

    try{

        const allDsaProblems = await problem.find({}).select("_id title difficulty tags") ; 

       
        if (allDsaProblems.length === 0) {
            return res.status(200).json({
                message: "No problems found",
                problems: []
            });
        } 

        res.status( 200 ).send( allDsaProblems ) ; 

    } 
    catch( err ){
        res.status( 400 ).send("Err : " + err.message ) ;
    }
} 


// 6). getAllSolvedProblem 
const getAllSolvedProblem = async ( req , res ) => {

    try{ 

        const userId = req.result._id ;
 
        const user = await User.findById( userId ).populate( { 
            path : "problemsSolved" ,
            select : " _id title difficulity tags" 
        }) ;

        res.status( 200 ).send( user.problemsSolved ) ;



    } 
    catch( err ){
        res.status( 400 ).send("Err : " + err.message ) ;
    }

} 


// 7). submittedProblem : it will give all the User's submission of any Problem 

const submittedProblem = async ( req , res ) => { 

    try{

        const userId = req.result._id ;
        const problemId = req.params.pid ;

        const requiredSumbissions = await submission.find({ userId , problemId }) ;  

        if( requiredSumbissions.length === 0 ){
            return res.status(200).send("No submission exists for this Problem") ;
        } 

        res.status( 200 ).send( requiredSumbissions ) ;
        
    } 
    catch( err ){
        res.status( 500 ).send("Err : " + err.message ) ;
    }

}






module.exports = { createProblem , updateProblem , deleteProblem , getProblemById , getAllProblems , getAllSolvedProblem , submittedProblem } ;