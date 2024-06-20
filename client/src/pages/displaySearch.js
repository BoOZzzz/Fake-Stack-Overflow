import React from 'react';
import getTimeDiff from '../components/getTimeDiff';
import { useState } from 'react';
import axios from 'axios';

function DisplaySearch({questions, click, questionForm, questionTab, activeTab, unansweredTab, userData}) {
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;
    console.log(questions);
    const author = questions.asked_by;
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const handleUpvote = async(qid) => {
        if(userData.reputation >= 50 ){
            try{
                const response = await axios.put('http://localhost:8000/qupvote', { qid, author });
                const { votes } = response.data;
                console.log(`Question upvoted! Votes: ${votes}`);
                
            }catch(error){
                
                console.error('Error upvoting question:', error);
            }

        }else {
            alert("user reputation < 50")
        }
    }


    const handleDownvote = async(qid) => {
        if(userData.reputation >= 50){
            try {
                const response = await axios.put('http://localhost:8000/qdownvote', { qid, author });
                const { votes } = response.data;
                console.log(`Question downvoted! Votes: ${votes}`);
              } catch (error) {
                
                console.error('Error downvoting question:', error);
              }
        }else{
            alert("user reputation < 50")
        }
    }

  const createDate = (question) => {
    
    return(
      <div
        style={{
          display: "flex",
          width: "20%",
          alignItems: "center",
        }}
      ><p><span style={{color:"red"}}>{getTimeDiff(question.ask_date_time, question.asked_by, "ask")[0] +" "}</span>
      {getTimeDiff(question.ask_date_time, question.asked_by, "ask")[1]}</p></div>
    )
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <div id="questions" className="tabcontent">
        <div id="searchHeader">
            <h1>SearchResult</h1>
            <button className="ask tablinks" onClick={()=>questionForm()}>Ask Question</button>
            <p id="numSearch" style={{ fontSize: "20px" }}>{questions.length} questions</p>
            <div className="filters" id="filters">
                <button className="buttonlinks" id="newestS" onClick={()=> questionTab()}>Newest</button>
                <button className="buttonlinks" id="activeS" onClick={()=> activeTab()}>Active</button>
                <button className="buttonlin  ks" id="unasweredS" onClick={()=> unansweredTab()}>Unanswered</button>
            </div>
        </div>
      </div>
      
      {currentQuestions.map((question, i) => {
        const qid = question.qid;
        return (
          <div key={i} className="searchContent" style={{ display: "flex", borderBottom: "dotted", height: "150px", width: "100%" }}>
            <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    
                    width: '35%',
                    }}>
              <p>{question.votes} votes
                    <br />
                    {question.answers.length} answers
                    <br />
                    {question.views} views
             </p>
             <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                    flexDirection: 'column', // Set flex direction to column
                }}>
                    <button onClick={() => handleUpvote(question._id)}>Upvote</button>
                    <button onClick={() => handleDownvote(question._id)}>Downvote</button>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", width: "60%", height: "100%", justifyContent: "center", alignItems: "baseline", padding: "0", margin: "0" }}>
              <a id="answerPg" style={{ textDecoration: "none", color: "#4d71cc", fontSize: "20px", fontWeight: "bold" }} href="#" onClick={()=>{click(question._id);}}>
                {question.title}
              </a>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>{question.summary}</p>
              <div style={{ display: "flex", width: "100%", marginTop: "10px" }}>
                {question.tags.map((tag, j) => (
                  <button key={j} style={{ marginRight: "10px", backgroundColor: "#666666", color: "white", borderRadius: "5px", padding: "5px 10px", cursor: "pointer", textAlign: "center" }}>
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            {createDate(question)}
            
          </div>
          
        );
      })}
      <div>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Prev
                </button>
                <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastQuestion >= questions.length}
                >
                Next
                </button>
            </div>
    </>
  );
}

export default DisplaySearch;