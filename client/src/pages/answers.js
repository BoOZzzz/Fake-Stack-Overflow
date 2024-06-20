import React from "react";
import getTimeDiff from "../components/getTimeDiff";
import AnswerList from "../components/answerList";





export default function answers({ model, qid, questionForm, answerForm, userData }) {
  console.log(model);
  let question = model[0].find((q) => q._id === qid);
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
  
  return (
    <div style={{width: "100%"}}>
      <div className="answerContent" style={{ display: "flex", width: "100%", height: "10%", marginTop: "50px" }}>
        <div style={{ display: "flex", width: "20%", justifyContent: "center", alignItems: "center", fontSize: "20px", fontWeight: "bold" }}>
          {question.answers.length} answers
        </div>
        <div style={{ display: "flex", width: "60%", justifyContent: "start", alignItems: "center", fontSize: "20px", fontWeight: "bold" }}>
          {question.title}
        </div>
        <div style={{ display: "flex", width: "20%", justifyContent: "end" }}>
          <button
            style={{ display: "block", marginRight: "50px", backgroundColor: "#3090e2", color: "white", padding: "10px 25px" }}
            onClick={()=>questionForm()}
            onMouseOver={(event) => {event.target.style.backgroundColor = "#267dc9";}}
            onMouseLeave={(event) => {event.target.style.backgroundColor = "#3090e2";}}
          >
            Ask Question
          </button>
        </div>
      </div>
      <div className="answerContent" style={{ display: "flex", borderBottom: "dotted", width: "100%", height: "30%", marginTop: "0px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", float: "left", width: "20%", fontSize: "20px", 
        fontWeight: "bold", marginTop: "20px" }}>
          {question.views} views
        </div>
        <div style={{ display: "flex", width: "55%", height: "100%", fontSize: "20px", alignItems: "center" }}>
          <p>{parseHyperlinks(question.text)}</p>
        </div>
        <div style={{ display: "flex", width: "25%", height: "100%", fontSize: "20px", alignItems: "center" }}>
          {<p style={{ marginTop: "50px"}}><span style={{color:"red"}}>{getTimeDiff(question.ask_date_time, question.asked_by, "ask")[0] +" "}</span>
          {getTimeDiff(question.ask_date_time, question.asked_by, "ask")[1]}</p>}
        </div>
      </div>
      <div className="answerContent" style={{ display: "flex", width: "100%", height: "30%", alignItems: "center" }}>
        <AnswerList model={model} qid={qid} userData={userData}/>
      </div>
      <button 
          style={{ display: "block", backgroundColor: "#3090e2", color: "white", height: "60px", marginLeft: "40px", marginTop: "20px" }}
          onMouseOver={(event) => {event.target.style.backgroundColor = "#267dc9";}}
          onMouseLeave={(event) => {event.target.style.backgroundColor = "#3090e2";}}
          onClick={()=>answerForm(qid)}
        >
          Answer Question
        </button>
    </div>
  );
}

