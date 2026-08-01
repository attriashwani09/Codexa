import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";

function ChatAi({ problem, currentCode, currentLanguage }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: `Hi! I'm your DSA tutor for "${problem?.title}". I can see your current code in the editor. Ask me for hints, code review, or the optimal solution!`,
        },
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const onSubmit = async (data) => {
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        parts: [{ text: data.message }],
      },
    ];

    setMessages(updatedMessages);
    reset();
    setLoading(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
        currentCode,
        currentLanguage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: response.data.message }],
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: "Something went wrong. Please try again.",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen max-h-[80vh] min-h-[500px] flex-col rounded-xl border border-base-300 bg-base-100">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap break-words shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-base-200 text-base-content rounded-bl-md"
              }`}
            >
              {msg.parts[0].text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-base-200 px-4 py-3">
              <div className="flex space-x-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-base-content"></span>
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-base-content"
                  style={{ animationDelay: "0.15s" }}
                ></span>
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-base-content"
                  style={{ animationDelay: "0.3s" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-t border-base-300 bg-base-100 p-4"
      >
        <div className="flex items-center gap-3">

          <input
            type="text"
            placeholder="Ask me anything..."
            disabled={loading}
            {...register("message", {
              required: true,
              minLength: 2,
            })}
            className="flex-1 rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-base-content outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send size={20} />
            )}
          </button>

        </div>
      </form>

    </div>
  );
}

export default ChatAi;