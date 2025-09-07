import React, { useState } from 'react'; 
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";



const CodeReviewApp = () => {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  

  async function reviewCode(){
    const response = await axios.post("http://localhost:3000/ai/get-review", {code})

    setReview(response.data)

  }

  const handleReview = () => {
    if (code.trim() === '') {
      setReview('⚠️ Please enter some code to review.');
    } else {
      setReview(`🧠 Review:\n\n✅ Code looks clean.\n🔍 Consider edge case handling.\n📌 Possible performance optimizations.`);
    }
  };

  const [loading, setLoading] = useState(false);

  async function reviewCode() {
    if (code.trim() === '') {
      setReview('⚠️ Please enter some code to review.');
      return;
    }
    setLoading(true);
    setReview('');
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data);
    } catch (error) {
      setReview('❌ Error fetching review. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-100 font-sans">
      <div className="flex h-full">
        {/* Left - Code Input */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e] p-6 border-r border-gray-700 relative">
          <h2 className="text-lg font-semibold mb-3 text-gray-200">Your Code</h2>
          <textarea
            className="flex-grow resize-none bg-[#121212] text-sm text-gray-200 font-mono rounded-lg p-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type or paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {/* Fixed bottom Review button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={reviewCode}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium shadow"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                <>🔍 Review</>
              )}
            </button>
          </div>
        </div>

        {/* Right - Review Output */}
        <div className="w-1/2 flex flex-col bg-[#181818] p-6 overflow-auto">
          <h2 className="text-lg font-semibold mb-3 text-gray-200">AI Review</h2>
          <Markdown style=" 
                flex-grow: 1;
                background: #121212;
                color: #d1d5db;
                font-size: 0.875rem;
                font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
                white-space: pre-wrap;
                padding: 1rem;
                border-radius: 0.5rem;
                border: 1px solid #374151;
                overflow-y: auto;
                min-height: 120px;">
            {loading
              ? '⏳ Waiting for AI review...'
              : (review || '💬 AI feedback will appear here after you review your code.')}
          </Markdown>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewApp;
