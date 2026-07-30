import { z }  from "zod" ;
import { zodResolver }  from "@hookform/resolvers/zod" ;
import {  useNavigate }  from "react-router-dom" ;
import { useFieldArray, useForm } from "react-hook-form"; 

import axiosClient from "../utils/axiosClient"


const TAGS = [ "array", "linkedlist", "graph" , "dp", "tree", "math", "sorting", "hash map" ];

const problemSchema = z.object({
   title : z.string().min( 1 , "Title is required") , 

   description : z.string().min( 1 , "Description is required ") ,

   difficulty : z.enum(["easy" , "medium" , "hard"]) ,  

   tags : z.array( z.enum(TAGS)).min(1 , "Select at least one tag") , 

   visibleTestCases : z.array(
    z.object({
        input : z.string().min(1) ,
        output : z.string().min(1) , 
        explanation : z.string().optional()
    })
    ).min(1) , 

    hiddenTestCases : z.array(
        z.object({
            input : z.string().min(1) , 
            output : z.string().min(1) ,
        })
    ).min(1) , 

    startCode : z.array(
        z.object({
            language : z.string() , 
            initialCode : z.string().min( 1 )
        })
    ) , 

    referenceSolution : z.array(
        z.object({
            language : z.string() , 
            completeCode : z.string().min(1) ,
        })
    )
}) 



function AdminCreatePanel(){

    const navigate = useNavigate() ; 

    const { register ,control , handleSubmit , formState : { errors } , } = useForm({ resolver : zodResolver( problemSchema ) , 
        defaultValues : {
            tags : ["array"] , 
            
            visibleTestCases : [{
                input : "" , 
                output : "" , 
                explanation : ""
            }] , 

            hiddenTestCases : [{
                input : "" , 
                output : ""
            }] , 

            startCode : [
                {
                    language : "cpp" , 
                    initialCode : "" 
                } , 

                {
                    language : "java" , 
                    initialCode : ""
                } , 

                {
                    language : "javascript" , 
                    initialCode : ""
                }
            ]   , 
            
            referenceSolution : [
                {
                    language : "cpp" , 
                    completeCode : ""
                } , 
                {
                    language : "java" , 
                    completeCode : ""
                } , 
                {
                    language : "javascript" , 
                    completeCode : ""
                }
            ]
        } 
    } ) ;   
    
    
    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible
      } = useFieldArray({
        control,
        name: "visibleTestCases"
    });


    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden
      } = useFieldArray({
        control,
        name: "hiddenTestCases"
    });


    // On Submit 
    const onSubmit = async ( data ) => {
        try{
            const response = await  axiosClient.post("/problem/create" , data ) ;
            console.log( response.data ) ;
            alert("Problem Created Successfully ") ;
            navigate("/") ;
        } 
        catch( error ){ 
            console.error( error ) ;
            alert( error?.response?.data?.error || error?.response?.data?.message || error.message );
        }
    } 


    return (
  <div className="min-h-screen bg-base-200 py-10">

    <div className="max-w-6xl mx-auto px-6"> 

      <h1 className="mb-8 text-4xl font-bold text-base-content">
        Create Problem
      </h1>

      <form  onSubmit={handleSubmit(onSubmit)} className="space-y-8" >
        {/* BASIC INFO */}

        <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg">

          <h2 className="mb-6 text-2xl font-semibold text-base-content">
            Basic Information
          </h2>

          <div className="space-y-4">

            <div>
              <input {...register("title")} placeholder="Problem Title"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

              {errors.title && ( <p className="mt-1 text-sm text-red-500"> {errors.title.message} </p> )}
            </div>

            <div>
              <textarea
                {...register("description")}
                rows={8}
                placeholder="Problem Description"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <select
                {...register("difficulty")}
                className="w-full rounded-lg border bg-base-100 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                multiple
                {...register("tags")}
                className="h-40 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 "
              >
                <option value="array">Array</option>
                <option value="linkedlist">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
                <option value="tree">Tree</option>
                <option value="math">Math</option>
                <option value="sorting">Sorting</option>
                <option value="hash map"> Hash Map </option>
              </select>
            </div>
          </div>
        </div>

        {/* VISIBLE TEST CASES */}

        <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-base-content">
              Visible Test Cases
            </h2>

            <button
              type="button"
              onClick={() =>
                appendVisible({
                  input: "",
                  output: "",
                  explanation: "",
                })
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="space-y-5">
            {visibleFields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 rounded-lg border border-gray-200 bg-base-200 p-5"
              >
                <input
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <input
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <textarea
                  {...register(
                    `visibleTestCases.${index}.explanation`
                  )}
                  placeholder="Explanation"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <button
                  type="button"
                  onClick={() => removeVisible(index)}
                  className="rounded bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* HIDDEN TEST CASES */}

        <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-base-content">
              Hidden Test Cases
            </h2>

            <button
              type="button"
              onClick={() =>
                appendHidden({
                  input: "",
                  output: "",
                })
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="space-y-5">
            {hiddenFields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 rounded-lg border border-gray-200 bg-base-200 p-5"
              >
                <input
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <input
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <button
                  type="button"
                  onClick={() => removeHidden(index)}
                  className="rounded bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CODE TEMPLATES */}

        <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg ">
          <h2 className="mb-6 text-2xl font-semibold text-base-content">
            Code Templates & Solutions
          </h2>

          <div className="space-y-8">
            {["c++", "java", "javascript"].map((lang, index) => (

              <div key={lang} className="space-y-4 rounded-lg border border-gray-200 bg-base-200 p-5" >
                <h3 className="text-xl font-semibold uppercase text-base-content">
                  {lang}
                </h3>

                <textarea
                  {...register(`startCode.${index}.initialCode`)}
                  rows={6}
                  placeholder="Starter Code"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <textarea
                  {...register(
                    `referenceSolution.${index}.completeCode`
                  )}
                  rows={8}
                  placeholder="Reference Solution"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
        >
          Create Problem
        </button>
      </form>
    </div>
  </div>
);

} 


export default AdminCreatePanel ;