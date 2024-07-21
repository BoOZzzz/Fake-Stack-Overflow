import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function AskForm({model, updateQuestion, username}) {
  const navigate = useNavigate();
  const tags = model[2];
  console.log(tags);
  const validateTitle = (e) => {
    const newTitle = e.target.value;
    const messageElement = document.getElementById('tmessage');
    if (newTitle.length > 100) {
        messageElement.innerHTML = 'Limit title to 100 characters or less';
      } else {
        messageElement.innerHTML = '';
      }
};
    
  const validateHyperlinks = (text) => {
      const hyperlinkPattern = /\[([^\]]*)\](\(([^)]*)\))?/g
      const matches = text.match(hyperlinkPattern);
      //console.log(matches)
      
      if (matches) {
          const match = matches.shift();
          if (match) {
              //console.log(match)
              const matched = match.match(/\[([^\]]+)\]\((https?:\/\/[^]+)\)/);
              //console.log(matched)
              if (matched) {
                  return true;
              } else {
                  return false;
              }
          }
      }else {
          return true;
      }
  };

  const submitQuestion = async(event) => {
    event.preventDefault();
    const questionTitle = document.getElementById('qTitle').value;
    const questionText = document.getElementById('qText').value;
    const questionTags = document.getElementById('qTags').value.toString().split(" ").filter(tag => tag.trim() !== "");;
    const questionSum = document.getElementById('summary').value;
    console.log(questionTags);
    if (questionTags.length > 5) {
      event.preventDefault();
      alert("You can only have up to 5 tags.");
      //console.log(questionTags.length)
    } else if (questionTags.some(tag => tag.length > 10)) {
      event.preventDefault();
      alert("Tags should not exceed 10 characters.");
    } else if (questionTitle.length > 100) {
        event.preventDefault();
        alert("Title must be 100 characters or less.");
    } else if(!validateHyperlinks(questionText)){
        event.preventDefault();
        alert("links entered not valid")
    } else if(!username){
        alert("only logged in users can add new questions")
    }else{
      let form = document.getElementById("questionForm");
      if(form.checkValidity()){
        try {
          // Create or fetch all tags
          await Promise.all(questionTags.map(tag =>
            axios.post(`http://localhost:8000/tags/`, { name: tag })
          ));
          
          // Post the question
          await axios.post('http://localhost:8000/questions', {
            title: questionTitle,
            text: questionText,
            tags: questionTags,
            answers: [],
            asked_by: username,
            ask_date_time: new Date(),
            views: 0,
            votes: 0,
            summary: questionSum
          });
  
          navigate("/home");
        } catch (error) {
          console.error('Error posting question:', error);
        }
      }else {
          alert("please fill in the required fields");
      }
    }
  };



  return (
    <div id="qstForm">
      <form id="questionForm" className="tabcontent" onSubmit={submitQuestion}>
        <h1>Question Title*</h1>
        <div style={{ fontSize: "15px" }}>
          <i id="tmessage"></i>
        </div>
        <input
          type="text"
          id="qTitle"
          style={{ lineHeight: "40px", width:"100%" }}
          placeholder="Web scripting invalid syntax URL"
          required
          onChange={validateTitle}
        />
        <h1>Question Text*</h1>
        <div style={{ fontSize: "15px" }}>
          <i>Add details</i>
        </div>
        <textarea
          id="qText"
          rows="5"
          cols="50"
          placeholder="I am a beginner of web scripting. There is a syntax error shown inside the URL of my script."
          required
        ></textarea>

        <h1>Tags*</h1>
        <div style={{ fontSize: "15px" }}>
          <i>Add keywords separated by whitespace</i>
        </div>
        <input
          type="text"
          id="qTags"
          style={{ lineHeight: "30px", width:"100%" }}
          placeholder="web-scripting html urls"
          required
        />
        <h1>Summary*</h1>
        <input
          type="text"
          id="summary"
          style={{ lineHeight: "30px", width:"100%" }}
          placeholder="jumanji"
          required
        />
        <br />
        <br />
        <button type="submit" >
          Post Question
        </button>
        <span style={{ color: "red", fontSize: "20px" }}>
          * indicates mandatory fields
        </span>
      </form>
    </div>
  );
}

