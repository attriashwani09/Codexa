import { useState , useEffect } from 'react'
import { useSelector , useDispatch } from "react-redux"

import './App.css' 

import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import HomePage from './Pages/HomePage'
import Admin from './Pages/Admin' 
import AdminCreatePanel from './components/AdminCreate' 
import AdminDelete from './components/AdminDelete' ;

import {BrowserRouter, Route, Routes , Navigate } from "react-router-dom" ; 
import { checkAuth } from './store/authSlice' 
import ProblemPage from './Pages/Problem'



function App(){ 

  // Get authentication status from Redux store
  const {isAuthenticated , loading , user } = useSelector( (state) => state.auth ) ;

  const dispatch = useDispatch() ;

  // Check if the user is authenticated whenever the component mounts
  // or when the authentication status changes.
  useEffect( ()=> {
    dispatch( checkAuth() )  
  } , [ dispatch ]) ;  // 

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }


  
    return (
      <> 
      <BrowserRouter>
        <Routes>

          <Route path='/' element = { isAuthenticated ? <HomePage/> : <Login/> } ></Route>

          <Route path='/login' element = { isAuthenticated ? <Navigate to = "/" /> : <Login/>} ></Route> 

          <Route path='/signup'  element = {  isAuthenticated ? <Navigate to = "/" /> :<SignUp/>} ></Route> 

          <Route path='/admin' element = { isAuthenticated && user?.role === 'admin'  ? <Admin /> : <Navigate to = "/" /> }></Route> 

          <Route path='/problem/:problemId' element = { isAuthenticated ? <ProblemPage /> : <Login/> }></Route> 

          <Route path='/admin/create'  element = { isAuthenticated && user?.role === 'admin' ?<AdminCreatePanel/> : <Navigate to = "/" /> }></Route> 

          <Route path='/admin/delete'  element = { isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to = "/" /> } ></Route>

        </Routes>
      </BrowserRouter>
      </>
    )
} 


export default App ;