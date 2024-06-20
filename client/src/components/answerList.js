import React from 'react';
import getTimeDiff from './getTimeDiff';
import { useState } from 'react';
import axios from 'axios';

export default function DisplayAnswers({qid, model, userData}) {
  const answers = model[0].find((q) => q._id === qid).answers;
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 5;

  let sortedAnswers = answers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));

  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = sortedAnswers.slice(indexOfFirstAnswer, indexOfLastAnswer);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  
  const handleUpvote = async(aid) => {
    console.log(aid);
    if(userData.reputation >= 50){
        try {
            const response = await axios.put('http://localhost:8000/aupvote', { aid });
            const { votes } = response.data;
            console.log(`Answer upvoted! Votes: ${votes}`);
            alert("answer upvoted!")
          } catch (error) {
            console.error('Error upvoting answer:', error);
          }
    }else{
        alert("user reputation < 50")
    }
}

  const handleDownvote = async(aid) => {
    if(userData.reputation >= 50){
        try {
            const response = await axios.put('http://localhost:8000/adownvote', { aid });
            const { votes } = response.data;
            console.log(`Answer downvoted! Votes: ${votes}`);
            alert("answer upvoted!")
          } catch (error) {
            
            console.error('Error downvoting answer:', error);
          }
    }else{
        alert("user reputation < 50")
    }
}


  const parseHyperlinks = (text) => {
    const hyperlinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    const matches = text.match(hyperlinkPattern);
    //console.log(matches)
    
    if (matches) {
        return text.split(hyperlinkPattern).map((segment, index) => {
          if (index % 3 === 0) {
            return segment;
          } else {
            const match = matches.shift();
            if (match) {
              const [fullMatch, title, url] = match.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
              //console.log(title)
              if (url.startsWith('http://') || url.startsWith('https://')) {
                return (
                  <a key={index} href={url} target="_blank">
                    {title}
                  </a>
                );
              }
            }
          }
        });
      }else {
        return text;
      }
    };


  const answerDivs = currentAnswers.map(ans => {
    const date = ans.ans_date_time;
    const name = ans.ans_by;
    const timeDiff = getTimeDiff(date, name, "answer");

    return (
      <div className="answerContent" key={ans._id} style={{ display: "flex", width: "1220px", height: "30%", borderBottom: "dotted"}}>
        <div style={{ display: "flex", width: "75%", height: "100%", alignItems: "center", justifyContent: "baseline", fontSize: "20px" }}>
          <p style={{ marginLeft: "20px" }}>{parseHyperlinks(ans.text)}</p>
        </div>
        <div style={{ display: "flex", width: "25%", height: "100%", fontSize: "20px", alignItems: "center" }}>
          {<p style={{ marginTop: "50px"}}><span style={{color:"green"}}>{timeDiff[0] +" "}</span>
          {timeDiff[1]}</p>}
          <div>
            <p>Votes: {ans.votes}</p>
            <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                    flexDirection: 'column', // Set flex direction to column
                }}>
                    <button onClick={() => handleUpvote(ans._id)}>Upvote</button>
                    <button onClick={() => handleDownvote(ans._id)}>Downvote</button>
                </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div id="answers">
      {answerDivs}
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <button onClick={handleNextPage} disabled={indexOfLastAnswer >= sortedAnswers.length}>
          Next
        </button>
      </div>
    </div>
  );
}