import React, { useState,useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Card from "./components/Card";
import Loader from "./components/Loader";

function App() {
  const [text, setText] = useState("");
  const [x, setX] = useState("");
  const [results, setResults] = useState({ sentences: [], summaries: [] });
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const summariesContainerRef = useRef(null);


  const scrollToCard = (cardRef) => {
    if (cardRef.current && summariesContainerRef.current) {
      // Scroll to the top of the card or center it in the container
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',  // 'center' makes the card appear in the middle of the container
        inline: 'nearest',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.length) {
      toast.warning("Please Enter text to summarize");
      return;
    }

    if (x < 1) {
      toast.warning("Please Enter Split Number");
      return;
    }

    setLoading(true);

    // https://text-summarizer-backend-ben7uqc1w-akashmaurya1430s-projects.vercel.app/ DEployed URl
    await axios
      .post("http://localhost:5000/summarize", { text, x })
      .then((response) => {
        setResults(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err: ', err);
        setResults({ sentences: [], summaries: [] });
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  const clearForm = () => {
    setText("");
    setX(3);
    setResults({ sentences: [], summaries: [] });
  };

  const handleHover = (index, type) => {
    setHighlightedIndex(index);
  };
  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-center">
          <a href="/" className="text-white text-2xl font-bold">
            Text Summarizer
          </a>
        </div>
      </nav>
      <div className="App mb-10">
        <form onSubmit={handleSubmit} className="w-full p-5">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here" className="h-48" />
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

        {loading ? (
          <>
            <Loader />{" "}
          </>
        ) : (
          <>
        <div className="results flex mt-10">
          <div className="w-1/2 px-5">
            <h2 className="text-xl mb-5 text-blue-900 font-semibold">Original Sentences</h2>
            <div className="original max-h-[20rem] overflow-y-auto">
              {results.sentences.map((sentence, index) => (
                <>
                  <Card key={index} index={index} sentence={sentence}
                   type="blob"
                   highlightedIndex={highlightedIndex}
                   onHover={handleHover}  scrollToCard={scrollToCard}
                  />
                  {/* <p key={index}>{sentence}</p>
                  <hr className="border-t-2 border-gray-300 dark:border-gray-700 my-4" /> */}
                </>
              ))}
            </div>
          </div>
          <div className="w-1/2 px-5">
            <h2 className="text-xl mb-5 text-blue-900 font-semibold">Summaries</h2>
            <div  ref={summariesContainerRef} className="summary max-h-[20rem] overflow-y-auto">
              {results.summaries.map((summary, index) => (
                <>
                  <Card key={index} index={index} sentence={summary}
                  type="summary"
                  highlightedIndex={highlightedIndex}
                  onHover={handleHover}  scrollToCard={scrollToCard}
                  />

                  {/* <p key={index}>{summary}</p>
                  <hr className="border-t-2 border-gray-300 dark:border-gray-700 my-4" /> */}
                </>
              ))}
            </div>
          </div>
        </div>
          
          </>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
