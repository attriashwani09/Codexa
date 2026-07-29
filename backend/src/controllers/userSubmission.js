const Submission = require("../models/submissionSchema");
const problem = require("../models/problemSchema") ; 
const { getLanguageById , submitBatch , submitToken } =require("../utils/problemUtility") ;



// 1). When code is Submitted ........ 
const submitCode = async (req , res ) => {

    try{

        const userId = req.result._id ;

        const problemId = req.params.id ;

        const { code , language } = req.body ;

        if( !userId || ! problemId || !code || !language ){
            return res.status(400).send("Some Fields Missing . ") ;
        }  


        const requiredProblem = await problem.findById( problemId ) ;

        if( !requiredProblem ){
            return res.status( 400 ).send("Problem Not found ");
        }

        // Initial storing code and other info in Our DB 
        const submittedCode = await Submission.create({
            userId , 
            problemId , 
            code , 
            language , 
            status : "pending" , 
            testCasesTotal : requiredProblem.hiddenTestCases.length 
        })   


        const { hiddenTestCases } = requiredProblem ;
        const languageId = getLanguageById( language ) ;

        
        const Judge0submission = hiddenTestCases.map( (testcase) => {
            return{
                language_id : languageId , 
                source_code : code , 
                expected_output : testcase.output , 
                stdin : testcase.input 
            }
        }) 


        const submitResult = await submitBatch( Judge0submission ) ; 

        const resultToken = submitResult.map( (value) => value.token ) ;

        const testResult = await submitToken( resultToken ) ;

        let testCasesPassed = 0;
        let memory = 0;
        let runtime = 0;
        let errorMessage = "";
        let status = "accepted";

        for( const test of testResult ){

            if( test.status_id == 3 ){ 
                testCasesPassed++ ;
                memory = Math.max( memory , test.memory ) ;
                runtime = runtime +  parseFloat(test.time) ;

            } 
            else{ 

                if( test.status_id == 4 ){
                    status = "Wrong Answer" 
                    errorMessage = test.status.description;

                } 
                else{ 

                    status = "error" ,
                    errorMessage = test.status.description;

                }

            }
        }  
        
        const testCasesTotal = requiredProblem.hiddenTestCases.length ;

        submittedCode.testCasesPassed = testCasesPassed ;
        submittedCode.memory = memory ;
        submittedCode.runtime = runtime ;
        submittedCode.errorMessage = errorMessage ;
        submittedCode.status = status ;

        await submittedCode.save() ; 

        // Add problemId into UserSolvedProblem (in userSchema ) only if it is not present there 

        if( ! req.result.problemsSolved.includes( problemId ) ){
            req.result.problemsSolved.push( problemId ) ;

            await req.result.save() ;
        } ;

        res.status( 201 ).json( { 
            status ,
            testCasesTotal , 
            testCasesPassed , 
            runtime , 
            memory
        }) ;


    }
    catch( err ){
        res.status( 500 ).send("Err : " + err.message ) ;
    }


}  



// 2). For run Code 
const runCode = async (req , res ) => {

    try{

        const userId = req.result._id ;

        const problemId = req.params.id ;

        const { code , language } = req.body ;

        if( !userId || ! problemId || !code || !language ){
            return res.status(400).send("Some Fields Missing . ") ;
        }  


        const requiredProblem = await problem.findById( problemId ) ;

        if( !requiredProblem ){
            return res.status( 400 ).send("Problem Not found ");
        }


        const { visibleTestCases } = requiredProblem ;
        const languageId = getLanguageById( language ) ;

        
        const Judge0submission = visibleTestCases.map( (testcase) => {
            return{
                language_id : languageId , 
                source_code : code , 
                expected_output : testcase.output , 
                stdin : testcase.input 
            }
        }) 


        const submitResult = await submitBatch( Judge0submission ) ; 

        const resultToken = submitResult.map( (value) => value.token ) ;

        const testResult = await submitToken( resultToken ) ;

        

        res.status( 201 ).send( testResult ) ;


    }
    catch( err ){
        res.status( 500 ).send("Err : " + err.message ) ;
    }


} 






module.exports = { runCode , submitCode } ;








// language_id: 54,
    // stdin: '10',
    // expected_output: 'Even',
    // stdout: 'Even',
    // status_id: 3,
    // created_at: '2026-07-15T19:18:28.650Z',
    // finished_at: '2026-07-15T19:18:29.893Z',
    // time: '0.003',
    // memory: 956,
    // stderr: null,
    // token: '981eb838-b785-4a7c-9fad-a00607eb6d40',
    // number_of_runs: 1,
    // cpu_time_limit: '5.0',
    // cpu_extra_time: '1.0',
    // wall_time_limit: '10.0',
    // memory_limit: 256000,
    // stack_limit: 64000,
    // max_processes_and_or_threads: 128,
    // enable_per_process_and_thread_time_limit: false,
    // enable_per_process_and_thread_memory_limit: false,
    // max_file_size: 5120,
    // compile_output: null,
    // exit_code: 0,
    // exit_signal: null,
    // message: null,
    // wall_time: '0.021',
    // compiler_options: null,
    // command_line_arguments: null,
    // redirect_stderr_to_stdout: false,
    // callback_url: null,
    // additional_files: null,
    // enable_network: true,