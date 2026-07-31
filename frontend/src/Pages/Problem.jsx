import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory"; 
// import ChatAi from '../components/chatAi';

const langMap = {
  cpp: 'cpp',
  java: 'java',
  javascript: 'javascript',
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  const { problemId } = useParams(); 

  // To change Monaco Editor theme automatically 
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches; 
  const [monacoTheme , setMonacoTheme ] = useState('vs') ; 

  useEffect( () => { 
     const requiredMonacoTheme = isDark ? "vs-dark" : "vs"; 
     setMonacoTheme( requiredMonacoTheme) ;

  }, [isDark]) ;

  console.log(monacoTheme);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const data = response.data;
        // ✅ FIX: .toLowerCase() lagaya taaki 'JavaScript' aur 'javascript' dono match karein
        const sc = data.startCode.find(sc => sc.language.toLowerCase() === langMap['javascript']);
        setProblem(data);
        setCode(sc?.initialCode || '');
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const sc = problem.startCode.find(sc => sc.language.toLowerCase() === langMap[selectedLanguage]);
      setCode(sc?.initialCode || '');
    }
  }, [selectedLanguage, problem]);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: langMap[selectedLanguage],
      });
      setRunResult(response.data);
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({ _error: error?.response?.data || 'Internal server error' });
    } finally {
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: langMap[selectedLanguage],
      });
      setSubmitResult(response.data);
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({ _error: error?.response?.data || 'Internal server error' });
    } finally {
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100">
  {/* Left Panel */}
  <div className="w-[50%] flex flex-col border-r border-gray-300">
    {/* Tabs */}
    <div className="bg-base-200 px-4 py-2 flex gap-2 border-b border-gray-300">
      {["description", "editorial", "solutions", "submissions", "chatAI"].map(
        (tab) => (
          <button
            key={tab}
            onClick={() => setActiveLeftTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${
              activeLeftTab === tab
                ? "bg-blue-600 text-white"
                : "text-base-content hover:bg-base-300"
            }`}
          >
            {tab === "chatAI"
              ? "ChatAI"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ),
      )}
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto p-6">
      {problem && (
        <>
          {/* Description */}
          {activeLeftTab === "description" && (
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">{problem.title}</h1>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                    problem.difficulty,
                  )}`}
                >
                  {problem.difficulty.charAt(0).toUpperCase() +
                    problem.difficulty.slice(1)}
                </span>

                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                  {problem.tags}
                </span>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed text-sm mb-8">
                {problem.description}
              </div>

              <h3 className="text-lg font-semibold mb-4">Examples</h3>

              <div className="space-y-4">
                {problem.visibleTestCases.map((example, index) => (
                  <div key={index} className="bg-base-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Example {index + 1}</h4>

                    <div className="space-y-2 text-sm font-mono">
                      <div>
                        <strong>Input:</strong> {example.input}
                      </div>

                      <div>
                        <strong>Output:</strong> {example.output}
                      </div>

                      {example.explanation && (
                        <div>
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editorial */}
          {activeLeftTab === "editorial" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Editorial</h2>

              <p className="text-gray-500 text-sm">Editorial coming soon.</p>
            </div>
          )}

          {/* Solutions */}
          {activeLeftTab === "solutions" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Solutions</h2>

              <div className="space-y-6">
                {problem.referenceSolution?.map((solution, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg overflow-hidden"
                  >
                    <div className="bg-base-200 px-4 py-3 font-semibold">
                      {problem.title} — {solution.language}
                    </div>

                    <pre className="bg-base-300 p-4 text-sm overflow-x-auto">
                      <code>{solution.completeCode}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submissions */}
          {activeLeftTab === "submissions" && (
            <div>
              <h2 className="text-xl font-bold mb-4">My Submissions</h2>

              <SubmissionHistory problemId={problemId} />
            </div>
          )}

          {/* Chat AI */}
          {activeLeftTab === "chatAI" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Chat with AI</h2>

              <ChatAi
                problem={problem}
                currentCode={code}
                currentLanguage={selectedLanguage}
              />
            </div>
          )}
        </>
      )}
    </div>
  </div> 



  {/* Right Panel */}
  <div className="w-[50%] flex flex-col">
    {/* Top Tabs */}
    <div className="bg-base-200 px-4 py-2 flex gap-2 border-b border-gray-300">
      {["code", "testcase", "result"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveRightTab(tab)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${
            activeRightTab === tab
              ? "bg-blue-600 text-white"
              : "text-base-content hover:bg-base-300"
          }`}
        >
          {tab === "testcase"
            ? "Testcase"
            : tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>

    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Code Editor */}
      {activeRightTab === "code" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Language Selector */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-300">
            {["javascript", "java", "cpp"].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition
                ${
                  selectedLanguage === lang
                    ? "bg-blue-600 text-white"
                    : "border border-base-300 text-base-content hover:bg-base-300"
                }`}
              >
                {lang === "cpp"
                  ? "C++"
                  : lang === "javascript"
                    ? "JavaScript"
                    : "Java"}
              </button>
            ))}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              onChange={(val) => setCode(val || "")}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              theme={monacoTheme}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                lineNumbers: "on",
                folding: true,
                mouseWheelZoom: true,
              }}
            />
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between p-4 border-t border-gray-300">
            {/* Console */}
            <button
              onClick={() => setActiveRightTab("testcase")}
              className="px-4 py-2 rounded-md text-sm font-medium text-base-content hover:bg-base-300 transition"
            >
              Console
            </button>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRun}
                disabled={loading}
                className="px-5 py-2 rounded-md border border-gray-300 font-medium hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Run"
                )}
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={loading}
                className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testcase */}
      {activeRightTab === "testcase" && (
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-lg font-semibold mb-4">Test Results</h3>

          {!runResult && (
            <p className="text-sm text-gray-500">
              Click <span className="font-semibold">Run</span> to test your code
              with the example test cases.
            </p>
          )}

          {runResult?._error && (
            <div className="rounded-lg border border-red-300 bg-red-100 text-red-700 p-4 text-sm">
              {String(runResult._error)}
            </div>
          )}

          {Array.isArray(runResult) &&
            (() => {
              const allPassed = runResult.every((tc) => tc.status_id === 3);

              return (
                <div className="space-y-4">
                  {/* Summary */}
                  <div
                    className={`rounded-lg border p-4 font-semibold
                  ${
                    allPassed
                      ? "border-green-300 bg-green-100 text-green-700"
                      : "border-red-300 bg-red-100 text-red-700"
                  }`}
                  >
                    {allPassed
                      ? "✅ All test cases passed!"
                      : "❌ Some test cases failed"}
                  </div>

                  {runResult.map((tc, i) => {
                    const passed = tc.status_id === 3;
                    const visibleTC = problem?.visibleTestCases?.[i];

                    return (
                      <div
                        key={i}
                        className={`overflow-hidden rounded-lg border
                        ${passed ? "border-green-300" : "border-red-300"}`}
                      >
                        {/* Header */}
                        <div
                          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold
                          ${
                            passed
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {passed
                            ? `✓ Test ${i + 1} Passed`
                            : `✗ Test ${i + 1} Failed — ${
                                tc.status?.description || "Wrong Answer"
                              }`}

                          {passed && tc.time && (
                            <span className="ml-auto text-xs text-gray-500">
                              {tc.time}s
                            </span>
                          )}
                        </div>

                        {/* Body */}
                        <div className="bg-base-200 space-y-4 p-4 text-sm font-mono">
                          <div>
                            <p className="mb-1 text-xs font-sans text-gray-500">
                              Input
                            </p>

                            <pre className="bg-base-300 rounded p-3 whitespace-pre-wrap break-all">
                              {visibleTC?.input ?? "—"}
                            </pre>
                          </div>

                          <div>
                            <p className="mb-1 text-xs font-sans text-gray-500">
                              Expected Output
                            </p>

                            <pre className="bg-base-300 rounded p-3 whitespace-pre-wrap break-all">
                              {visibleTC?.output ?? "—"}
                            </pre>
                          </div>

                          <div>
                            <p className="mb-1 text-xs font-sans text-gray-500">
                              Your Output
                            </p>

                            <pre
                              className={`rounded p-3 whitespace-pre-wrap break-all
                            ${passed ? "bg-green-100" : "bg-red-100"}`}
                            >
                              {tc.stdout?.trim() || "(no output)"}
                            </pre>
                          </div>

                          {tc.stderr && (
                            <div>
                              <p className="mb-1 text-xs text-red-600">
                                Stderr
                              </p>

                              <pre className="rounded bg-red-100 p-3 text-red-700 whitespace-pre-wrap break-all">
                                {tc.stderr}
                              </pre>
                            </div>
                          )}

                          {tc.compile_output && (
                            <div>
                              <p className="mb-1 text-xs text-yellow-700">
                                Compile Error
                              </p>

                              <pre className="rounded bg-yellow-100 p-3 text-yellow-800 whitespace-pre-wrap break-all">
                                {tc.compile_output}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
        </div>
      )}

      {/* Result */}
      {activeRightTab === "result" && (
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-lg font-semibold mb-4">Submission Result</h3>

          {!submitResult && (
            <p className="text-sm text-gray-500">
              Click <span className="font-semibold">Submit</span> to submit your
              solution for evaluation.
            </p>
          )}

          {submitResult?._error && (
            <div className="rounded-lg border border-red-300 bg-red-100 p-4 text-red-700 text-sm">
              {String(submitResult._error)}
            </div>
          )}

          {submitResult &&
            !submitResult._error &&
            (() => {
              const accepted = submitResult.status === "accepted";

              return (
                <div
                  className={`overflow-hidden rounded-lg border
                ${accepted ? "border-green-300" : "border-red-300"}`}
                >
                  {/* Header */}
                  <div
                    className={`px-6 py-4
                  ${accepted ? "bg-green-100" : "bg-red-100"}`}
                  >
                    <h4
                      className={`text-xl font-bold
                    ${accepted ? "text-green-700" : "text-red-700"}`}
                    >
                      {accepted
                        ? "🎉 Accepted"
                        : `❌ ${
                            submitResult.status === "wrong"
                              ? "Wrong Answer"
                              : "Runtime Error"
                          }`}
                    </h4>
                  </div>

                  {/* Body */}
                  <div className="bg-base-200 space-y-4 p-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Test Cases</span>

                      <span className="font-semibold font-mono">
                        {submitResult.testCasesPassed} /{" "}
                        {submitResult.testCasesTotal}
                      </span>
                    </div>

                    {accepted && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Runtime</span>

                          <span className="font-semibold font-mono">
                            {submitResult.runtime
                              ? `${submitResult.runtime.toFixed(3)} s`
                              : "—"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-500">Memory</span>

                          <span className="font-semibold font-mono">
                            {submitResult.memory
                              ? `${submitResult.memory} KB`
                              : "—"}
                          </span>
                        </div>
                      </>
                    )}

                    {!accepted && submitResult.errorMessage && (
                      <div>
                        <p className="mb-2 text-xs text-red-600">Error</p>

                        <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-red-100 p-3 text-xs text-red-700">
                          {submitResult.errorMessage}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default ProblemPage;