import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";


function App() {
  const [text, setText] = useState("");
  const [x, setX] = useState(3);
  const [results, setResults] = useState({ sentences: [], summaries: [] });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.length) {
      toast.warning("Please Enter text to summarize")
      return
    }

    if (x < 1) {
      toast.warning("Please Enter Split Number")
      return
    }
    
    const response = await axios.post("http://localhost:5000/summarize", { text, x });
    setResults(response.data);
  };
  
  const clearForm = ()=>{
    setText("");
    setX(3);
    setResults({ sentences: [], summaries: [] })
  }



  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-center">
          <a href="/" className="text-white text-2xl font-bold">
            Text Summarizer
          </a>
        </div>
      </nav>
      <div className="App">
        <form onSubmit={handleSubmit} className="w-full">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here" />
          <input type="number" placeholder="Enter split number" value={x} onChange={(e) => setX(e.target.value)} min="1" />
          <div className="flex flex-row justify-around">
            <button type="submit" className="w-fit ">
              Summarize
            </button>
            <button type="button" className="w-fit" onClick={clearForm}>
              Clear
            </button>
          </div>
        </form>
        <div className="results w-full">
          <div className="original">
            <h2>Original Sentences</h2>
            {results.sentences.map((sentence, index) => (
              <>
                <p key={index}>{sentence}</p>
                <hr className="border-t-2 border-gray-300 dark:border-gray-700 my-4" />
              </>
            ))}
          </div>
          <div className="summary">
            <h2>Summaries</h2>
            {results.summaries.map((summary, index) => (
              <>
                <p key={index}>{summary}</p>
                <hr className="border-t-2 border-gray-300 dark:border-gray-700 my-4" />
              </>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer position="top-center"
autoClose={3000} />
    </>
  );
}

export default App;
