import axios from "axios";
import React from "react";

export default function AnswerForm({model, qid, updateAnswer}) {

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


  const handleSubmit = (event) => {
    const answerText = document.getElementById('aText').value;
    const answerUser = document.getElementById('aUsername').value;
    
    if(!validateHyperlinks(answerText)){
      event.preventDefault();
      alert("links entered not valid")
    }else{
      event.preventDefault();
      let form = document.getElementById("aForm");
      if(form.checkValidity()){
        axios.post(`http://localhost:8000/${qid}/answers`,{ text:answerText, ans_by: answerUser, ans_date_time: new Date()});
        updateAnswer(qid);
      }else {
        alert("please fill in the required fields");
      }
    }
      
      
  };

  return (
    <div id="answerForm" style={{ marginTop: "40px" }}>
      <form id="aForm" className="tabcontent" onSubmit={handleSubmit}>
        <h2>Username*</h2>
        <input id="aUsername" style={{ lineHeight: "40px" }} type="text" required />
        <br />
        <br />
        <h2>Answer Text*</h2>
        <textarea id="aText" type="text" rows="5" cols="50" required />
        <div>
        <button id="aPost" type="submit"> Post Answer</button>
        </div>
        <span style={{ color: "red", fontSize: "20px" }}>* indicates mandatory fields</span>
      </form>
    </div>
  );

}