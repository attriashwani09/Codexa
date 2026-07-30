import { createAsyncThunk , createSlice } from "@reduxjs/toolkit" ; 
import axiosClent from "../utils/axiosClient";  


//1. fetching all Problems 
export const fetchAllProblems = createAsyncThunk(
    "problem/fetchAllProblems" ,
    async  ( _ , {rejectWithValue}) => { 

        try{
            const response = await axiosClent.get("/problem/getAllProblem") ;
            return response.data ;
        } 
        catch( error ){
            return rejectWithValue( error.response?.data ) ;
        }
        
    }
) 


//2. fetching Solved Problems by user 
export const fetchSolvedProblems = createAsyncThunk(
    "problem/fetchSolvedProblems" , 
    async ( _ , {rejectWithValue}) => {
        try{
            const response = await axiosClent.get("/problem/ProblemSolvedByUser/user" ) ;
            return response.data ;
        } 
        catch( error ){
            return rejectWithValue( error.response?.data ) ;
        }
    }
) 




const problemSlice = createSlice({
    name : "problem" , 

    initialState : {
        allProblems : [] , 
        solvedProblems : [] , 
        loading : false  ,
        fetchError : null
    }, 

    reducers : {} , 

    extraReducers : ( builder ) => {
        builder 

        .addCase( fetchAllProblems.pending , (state) => {
            state.loading = true ;
            state.fetchError = null ;
        })
        
        .addCase( fetchAllProblems.fulfilled , ( state , action) => {
            state.loading = false ;
            state.allProblems = action.payload  ;
        } )  

        .addCase( fetchAllProblems.rejected , ( state , action ) => {
            state.loading = false ; 
            state.fetchError = action.payload?.message || 'Failed to fetch Problem'
        })

        // solvedProblem cases 

        .addCase( fetchSolvedProblems.fulfilled , (state , action) => {
            state.solvedProblems = action.payload
        }) 
    }
})

export default problemSlice.reducer ;