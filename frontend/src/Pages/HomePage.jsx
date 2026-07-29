import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../store/authSlice" ;
import { NavLink } from "react-router-dom" ;


function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState( {
        difficulty: "all",
        tag: "all",
        status: "all",
      });

  // Fetch Problems and SolvedProblems from backend
  useEffect(() => {
    async function fetchProblems() {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    }

    async function fetchSolvedProblems() {
      try {
        const { data } = await axiosClient.get( "/problem/ProblemSolvedByUser/user" );
        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    }

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);


  // Handle logout feature : 
  const handleLogout = ()=>{
    dispatch( logoutUser() ) ;
    setSolvedProblems([]) ; 
  }  


  console.log("User:", user);
  console.log("Role:", user?.role);


  // Filter Problems : 
  const filteredProblems = problems.filter( (problem) => {
    const difficulityMatch = filters.difficulty === 'all'  || problem.difficulty === filters.difficulty ;
    const tagMatch = filters.tag == 'all' || problem.tags.includes( filters.tag ) ; 
    const  isSolved = solvedProblems.some( (sp) => problem._id === sp._id ) ;  
    const statusMatch = filters.status === 'all' || ( filters.status == 'solved' && isSolved ) ;

    return difficulityMatch && tagMatch && statusMatch ;    
  }) 


  return (
   <div className="min-h-screen bg-base-200 text-base-content">
     {/* Navbar */}
     <nav className="bg-base-100 shadow-md px-5 py-4">
       <div className="mx-auto flex max-w-6xl items-center justify-between">
         <NavLink to="/" className="text-2xl font-bold text-primary">
           CodeMaster
         </NavLink>
 
         <div className="flex items-center gap-3">
           <span className="font-medium">
             Hi, {user?.firstName}
           </span>
 
           {user?.role === "admin" && (
             <NavLink
               to="/admin"
               className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-content"
             >
               Admin Panel
             </NavLink>
           )}
 
           <button
             onClick={handleLogout}
             className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
           >
             Logout
           </button>
         </div>
       </div>
     </nav>
 
     {/* Main Content */}
     <div className="mx-auto max-w-6xl p-6">
 
       {/* Filters */}
       <div className="mb-8 flex flex-wrap gap-4">
 
         <select
           className="rounded-lg border border-gray-300 bg-base-100 px-4 py-2 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
           value={filters.status}
           onChange={(e) =>
             setFilters({ ...filters, status: e.target.value })
           }
         >
           <option value="all">All Problems</option>
           <option value="solved">Solved Problems</option>
         </select>
 
         <select
           className="rounded-lg border border-gray-300 bg-base-100 px-4 py-2 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
           value={filters.difficulty}
           onChange={(e) =>
             setFilters({ ...filters, difficulty: e.target.value })
           }
         >
           <option value="all">All Difficulty</option>
           <option value="easy">Easy</option>
           <option value="medium">Medium</option>
           <option value="hard">Hard</option>
         </select>
 
         <select
           className="rounded-lg border border-gray-300 bg-base-100 px-4 py-2 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
           value={filters.tag}
           onChange={(e) =>
             setFilters({ ...filters, tag: e.target.value })
           }
         >
           <option value="all">All Tags</option>
           <option value="array">Array</option>
           <option value="linkedlist">Linked List</option>
           <option value="graph">Graph</option>
           <option value="dp">DP</option>
           <option value="tree">Tree</option>
           <option value="sorting">Sorting</option>
           <option value="math">Math</option> 
           <option value="hash map">Hash Map</option>
         </select>
 
       </div>
 
       {/* Problem List */}
       <div className="space-y-4">
         {filteredProblems.length === 0 ? (
           <div className="mt-10 text-center text-lg">
             No Problems Found
           </div>
         ) : (
           filteredProblems.map((problem) => {
             const isSolved = solvedProblems.some(
               (sp) => sp._id === problem._id
             );
 
             return (
               <div
                 key={problem._id}
                 className="rounded-xl bg-base-100 p-5 shadow-md transition hover:shadow-lg"
               >
                 <div className="flex items-center justify-between">
                   <NavLink
                     to={`/problem/${problem._id}`}
                     className="text-lg font-semibold transition hover:text-primary"
                   >
                     {problem.title}
                   </NavLink>
 
                   {isSolved && (
                     <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                       Solved
                     </span>
                   )}
                 </div>
 
                 <div className="mt-4 flex flex-wrap gap-2">
 
                   <span
                     className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyBadgeColor(
                       problem.difficulty
                     )}`}
                   >
                     {problem.difficulty}
                   </span>
 
                   {problem.tags?.map((tag) => (
                     <span
                       key={tag}
                       className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white"
                     >
                       {tag}
                     </span>
                   ))}
 
                 </div>
               </div>
             );
           })
         )}
       </div>
     </div>
   </div>
 ); 
 
 
 }  
 
 
 const getDifficultyBadgeColor = (difficulty) => {
   switch (difficulty?.toLowerCase()) {
     case "easy":
       return "bg-green-500 text-white";
     case "medium":
       return "bg-yellow-500 text-white";
     case "hard":
       return "bg-red-500 text-white";
     default:
       return "bg-gray-500 text-white";
   }
 }; 
 
 
 export default Homepage ;