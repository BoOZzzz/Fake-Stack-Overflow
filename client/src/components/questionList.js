import { useState } from 'react';
import getTimeDiff from './getTimeDiff';
import axios from 'axios';

function QuestionList({searchTab, click, model, userData}) {
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;
    console.log(model);
    const author = model.asked_by;
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = model.slice(indexOfFirstQuestion, indexOfLastQuestion);
    function handleTagClick(tagName) {
        searchTab("[" + tagName + "]");
    }
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
    
    const createTagButtons = (tags) => {
        return tags.map((tag) => (
        <button
            key={tag._id}
            style={{
            marginRight: '10px',
            backgroundColor: '#666666',
            color: 'white',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            textAlign: 'center',
            }}
            onClick = {()=> handleTagClick(tag.name)}
        >
            {tag.name}
        </button>
        ));
    };

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
            <div>
            {currentQuestions.map((question) => (
                
                <div
                key={question._id}
                className="questionContent"
                style={{
                    display: 'flex',
                    borderBottom: 'dotted',
                    height: '150px',
                    width: '100%',
                }}
                >
                <div
                    style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    
                    width: '35%',
                    }}
                >
                <p> 
                    {question.votes} votes
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
                <div
                    style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '60%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    padding: '0',
                    margin: '0',
                    }}
                >   
                <div>
                    <a
                    id="answerPg"
                    style={{
                        textDecoration: 'none',
                        color: '#4d71cc',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}
                    href="#"
                    onClick={() => {
                        click(question._id);
                    
                    }}
                    >
                    {question.title}
                    </a>
                    <p style={{ marginTop: '10px', fontSize: '14px' }}>{question.summary}</p>
                    </div>
                    <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        marginTop: '10px',
                    }}
                    >
                    {createTagButtons(question.tags)}
                    </div>
                </div>
                {createDate(question)}
                </div>
            ))}
            </div>
            <div>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Prev
                </button>
                <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastQuestion >= model.length}
                >
                Next
                </button>
            </div>
        </>
    );
}

export default QuestionList;