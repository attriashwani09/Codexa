import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useSelector , useDispatch } from "react-redux" ; 
import { fetchAllProblems } from "../store/problemSlice" ;

const AdminDelete = () => {
  
  const dispatch = useDispatch() ;

  const { allProblems , loading , fetchError } = useSelector( (state) => state.problem ) ; 


  const [error, setError] = useState("");


  useEffect(() => { 
    dispatch( fetchAllProblems() ) ;
  }, [dispatch]);


  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Delete "${title}" ?`
    );

    if (!confirmDelete) return;

    try {
      await axiosClient.delete(
        `/problem/delete/${id}`
      );

      // to Update on UI 
     dispatch( fetchAllProblems() ) ;

    } catch (err) {
      console.error(err);
      setError("Failed to delete problem");
    }
  }; 


  if (fetchError) return <p className="text-red-500">{error}</p>; 


  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-300 text-green-700";

      case "medium":
        return "bg-yellow-300 text-yellow-700";

      case "hard":
        return "bg-red-300 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-base-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-base-content">
        Delete Problems
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg px-4 py-3 mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-base-300 shadow-sm">
        <table className="min-w-full text-left border-collapse">

          <thead className="bg-base-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-base-content">#</th>
              <th className="px-4 py-3 text-sm font-semibold text-base-content">Title</th>
              <th className="px-4 py-3 text-sm font-semibold text-base-content">Difficulty</th>
              <th className="px-4 py-3 text-sm font-semibold text-base-content">Tags</th>
              <th className="px-4 py-3 text-sm font-semibold text-base-content">Action</th>
            </tr>
          </thead>

          <tbody>
            {allProblems.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-base-content"
                >
                  No Problems Found
                </td>
              </tr>
            ) : (
              allProblems.map((problem, index) => (
                <tr
                  key={problem._id}
                  className="border-t border-base-300 even:bg-base-200 hover:bg-base-300/50 transition-colors"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3">{problem.title}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full border border-base-300 text-base-content"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                      onClick={() =>
                        handleDelete(
                          problem._id,
                          problem.title
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminDelete;