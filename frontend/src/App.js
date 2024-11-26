import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Card from "./components/Card";
import Loader from "./components/Loader";

function App() {
  const [text, setText] = useState("");
  const [x, setX] = useState(0);
  const [results, setResults] = useState({ sentences: [], summaries: [] });
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const summariesContainerRef = useRef(null);

  // Calculations Based on Groq, api rate limiter
  const batchSize = 3; // Number of groups per batch, ideally keep 10
  const requestsPerMinute = 10; // Limit of groups per minute, ideally keep 30
  const revivalTime = 60 * 1000; // Time to wait for cooldown, ideally keep 1 min => 60 * 1000
  let processedThisMinute = 0;

  const scrollToCard = (cardRef) => {
    

    if (cardRef.current && summariesContainerRef.current) {
      // Scroll to the top of the card or center it in the container
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // 'center' makes the card appear in the middle of the container
        inline: "nearest",
      });
    }
  };

  const splitTextIntoGroups = (text, groupSize) => {
    const sentences = text.match(/[^.!?]+[.!?]*\s*/g);

    // console.log('sentences: ', sentences);

    if (!sentences) return [];

    const groups = [];

    for (let i = 0; i < sentences.length; i += groupSize) {
      const group = sentences.slice(i, i + groupSize).join("");

      groups.push(group);
    }

    return groups;
  };

  const summarizeText = async (group) => {
    try {
      // https://text-summarizer-backend-azure.vercel.app/ Deployed URL
      const response = await axios.post("https://text-summarizer-backend-azure.vercel.app/summarize", { group });
      // console.log("response: ", response);
      return response.data.data;
    } catch (error) {
      // console.log("error: ", error);
      return error.response.data.data;
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
    setResults({ sentences: [], summaries: [] });

    let groups = splitTextIntoGroups(text, +x);
    // console.log("groups: ", groups.length, groups);

    // return
    setLoading(true);
    for (let i = 0; i < groups.length; i += batchSize) {
      const batch = groups.slice(i, i + batchSize);
      // console.log("batch: ", batch);

      // Wait if rate limit is reached
      if (processedThisMinute + batch.length > requestsPerMinute) {
        console.log("Rate limit reached. Waiting for 1 minute...");
        await new Promise((resolve) => setTimeout(resolve, revivalTime));
        processedThisMinute = 0;
      }

      const batchResponses = await Promise.all(batch.map((text) => summarizeText(text)));

      // console.log("batchResponses: ", batchResponses);

      // Update the state with new responses
      batchResponses.forEach((res) => {
        setResults((prevState) => ({
          ...prevState,
          sentences: [...prevState.sentences, res.group],
          summaries: [...prevState.summaries, res.summary],
        }));
      });

      processedThisMinute += batch.length;
    }

    setLoading(false);
  };

  const clearForm = () => {
    setText("");
    setX(0);
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
          <div className="md:flex flex-row justify-around">
            <button type="submit" className="w-fit disabled:opacity-70" disabled={loading}>
              {loading ? "Summarizing" : "Summarize"}
            </button>
            <button type="button" className="w-fit mt-2 md:mt-0" onClick={clearForm}>
              Clear
            </button>
          </div>
        </form>

        <div className="results flex mt-10">
          <div className="w-1/2 px-5">
            <h2 className="text-xl mb-5 text-blue-900 font-semibold">Original Sentences</h2>
            <div className="original max-h-[35rem] overflow-y-auto">
              {results.sentences.map((sentence, index) => (
                <>
                  <Card
                    key={index}
                    index={index}
                    sentence={sentence}
                    type="blob"
                    highlightedIndex={highlightedIndex}
                    onHover={handleHover}
                    scrollToCard={scrollToCard}
                  />
                  {/* <p key={index}>{sentence}</p>
                  <hr className="border-t-2 border-gray-300 dark:border-gray-700 my-4" /> */}
                </>
              ))}

              {loading ? <Loader /> : ""}
            </div>
          </div>
          <div className="w-1/2 px-5">
            <h2 className="text-xl mb-5 text-blue-900 font-semibold flex align-bottom justify-between">
              <span>Summaries</span>

              
            </h2>
            <div ref={summariesContainerRef} className="summary max-h-[35rem] overflow-y-auto">
              {results.summaries.map((summary, index) => (
                <>
                  <Card
                    key={index}
                    index={index}
                    sentence={summary}
                    type="summary"
                    highlightedIndex={highlightedIndex}
                    onHover={handleHover}
                    scrollToCard={scrollToCard}
                  />

                  {/* <p key={index}>{summary}</p>
                  <hr className="border-t-2 border-gray-300 dark:border-gray-700 my-4" /> */}
                </>
              ))}

              {loading ? <Loader /> : ""}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
