
import './stylesheets/App.css';
import { useState, useEffect } from 'react';
import Header from './components/header';
import SideBar from './components/sidebar';
import Questions from './pages/questions';
import AskForm from './pages/askForm';
import Answers from './pages/answers';
import AnswerForm from './pages/ansForm';
import Tags from './pages/tags';
import DisplaySearch from './pages/displaySearch';
import Data from './components/data';
import axios from 'axios';



function App({loggedIn, setLoggedIn}) {
  const [tab, setTab] = useState("home");
  const [qid, setQid] = useState("");
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const data = new Data();


  const questions = data[0];
  const answers = data[1];
  const tags = data[2];


  useEffect(() => {
    async function checkLoginStatus() {
      try {
          const response = await axios.get('http://localhost:8000/username', {
              withCredentials: true
          });
          const { loggedIn } = response.data;
          setUsername(response.data.username);
          setLoggedIn(loggedIn);

          if (loggedIn) {
            // If the user is logged in, fetch user data
            const userDataResponse = await axios.get('http://localhost:8000/user', {
              withCredentials: true,
            });
  
            setUserData(userDataResponse.data.user);
          }
      } catch (error) {
          console.log(error);
      }
  }
  checkLoginStatus();
  }, [setLoggedIn]);

  
  console.log(userData);
  
  const handleQuestionClick = async (qid) => {
    answerTab(qid);
    setQid(qid);
    await axios.put(`http://localhost:8000/questions/${qid}/views`);
  }

  const questionTab = () => {
    setTab("home");
  }

  const tagTab = () => {
    setTab("tag");
  }

  const answerTab = (qid) => {
    setQid(qid);
    setTab("answer");
    
  }

  const questionForm = () => {
    setTab("askForm");
  }

  const activeTab = () => {
    setTab("active");
  }

  const unansweredTab = () => {
    setTab("unaswered");
  }

  const updateModel = () =>{
    setTab("home");
    window.location.reload(false);
  }

  const answerForm = (qid) => {
    setQid(qid);
    setTab("ansForm");
  }
  
  const updateAnswer = (qid) => {
    setQid(qid);
    setTab("answer");
    window.location.reload(false);
  }

  const searchTab = (input) => {
    setInput(input);
    setTab("search");
  }

  const searchNewest = () => {
    setTab("search");
  }

  const searchActive =() => {
    setTab("searchActive");
  }

  const searchUnanswered = () => {
    setTab("searchUnanswered");
  }

  const sortByUnanswered = (object) => {
    let answered = object.filter(filterFunction);
    return answered;
    function filterFunction(value){
      return value.answers.length<=0;
    }
  }


  const searchByTxt = (txt) =>{
    let i,j, k;
    let strArray = txt.toUpperCase().split(" ");
    let result = [];
    for(i = 0; i < questions.length; i++){
      let titleArray = questions[i].title.toUpperCase().split(" ");
      let textArray = questions[i].text.toUpperCase().split(" ");
      for(j = 0; j < titleArray.length; j++) {
        for(k = 0; k <strArray.length; k++){
          if(strArray[k] == titleArray[j]){
            if(!result.includes(questions[i])){
              result.push(questions[i]);
            }
          }
        }
      }

      for(j=0; j< textArray.length;j++){
        for(k = 0; k <strArray.length; k++){
          if(strArray[k] == textArray[j]){
            if(!result.includes(questions[i])){
              result.push(questions[i]);
            }
          }
        }
      }   
      
    }
    return result;
  }

  const searchByTag = (txt) =>{
    let re = /\[.*?\]/g;
      let m;
      let i, j, k;
      let str = txt;
      let q =[];
      m = str.match(re);
      if(m){
        for(i = 0; i < m.length; i++){
          m[i] = m[i].replace('[', '');
          m[i] = m[i].replace(']', '');
        }
        let tags = [];
        for(i = 0; i < m.length; i++){
          tags.push(m[i])
        }
        //console.log(tags);

        for(i = 0; i < questions.length; i++){
          for(j = 0; j < questions[i].tags.length; j++){
            for(k = 0; k < tags.length; k++){
              if(tags[k] == questions[i].tags[j].name){
                if(!q.includes(questions[i])){
                  q.push(questions[i]);
                }
              }
            }
          }
        }
      }
      //console.log(q)
      return q;
  }

  const combineSearch = (txt) =>{
    let result1 = searchByTag(txt);
    let result2 = searchByTxt(txt);
    const uniqueIds = new Set(result1.map((q) => q._id.toString()));

    const mergedResult = [...result1];

    for (const question of result2) {
      const questionId = question._id.toString();
      if (!uniqueIds.has(questionId)) {
        mergedResult.push(question);
        uniqueIds.add(questionId);
      }
    }

    console.log(mergedResult);
    return mergedResult;
  }

  const getLatestAnswerDate = (answers) => {
    if (answers.length === 0) {
      return 0;
    }
    
    let sortedAnswers = answers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
    console.log(sortedAnswers)
    return sortedAnswers[0].ans_date_time;
  };

  const render = () => {

    switch(tab) {
      case "home":
        let newest = questions.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        return(
          <Questions numb={newest.length} model={newest} click={handleQuestionClick} questionForm={questionForm} loggedIn={loggedIn}
          questionTab={questionTab} activeTab={activeTab} unansweredTab={unansweredTab} searchTab={searchTab} userData={userData}/>
        );
      case "tag":
        return(
          <>
            <Tags model={data} questionForm={questionForm} searchTab={searchTab}/>
          </>
        );

      case "active":
        let active = questions.sort((a,b) => new Date(getLatestAnswerDate(b.answers)) - new Date(getLatestAnswerDate(a.answers)));
        return(
          <Questions numb={active.length} model={active} click={handleQuestionClick} questionForm={questionForm} 
          questionTab={questionTab} activeTab={activeTab} unansweredTab={unansweredTab} searchTab={searchTab} userData={userData}/>
        );
      
      case "unaswered":
        let unanswered = sortByUnanswered(questions);
        return(
          <Questions numb={unanswered.length} click={handleQuestionClick} model={unanswered} questionForm={questionForm} 
          questionTab={questionTab} activeTab={activeTab} unansweredTab={unansweredTab} searchTab={searchTab} userData={userData}/>
        );

      case "answer":
        return(
          <Answers model={data} qid={qid} questionForm={questionForm} answerForm={answerForm} userData={userData} />
        );

      case "askForm":
        return(
          <AskForm model={data} updateQuestion={updateModel} username={username}/>
        );
      
      case "ansForm":
        return(
          <AnswerForm model={data} updateAnswer={updateAnswer} qid={qid}/>
        )

      case "search":
        let newestSear = combineSearch(input).sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        return(
          <DisplaySearch questions={newestSear} click={handleQuestionClick} questionForm={questionForm} answerTab={answerTab}
          questionTab={searchNewest} activeTab={searchActive} unansweredTab={searchUnanswered} userData={userData}/>
        )

      case "searchActive":
        let SeActive = combineSearch(input).sort((a,b) => new Date(getLatestAnswerDate(b.answers)) - new Date(getLatestAnswerDate(a.answers)));
        return(
          <DisplaySearch questions={SeActive} click={handleQuestionClick} questionForm={questionForm} answerTab={answerTab}
          questionTab={searchNewest} activeTab={searchActive} unansweredTab={searchUnanswered} userData={userData}/>
        )
      
      case "searchUnanswered":
        let SeUnanswered = sortByUnanswered(combineSearch(input));
        return(
          <DisplaySearch questions={SeUnanswered} click={handleQuestionClick} questionForm={questionForm} answerTab={answerTab}
          questionTab={searchNewest} activeTab={searchActive} unansweredTab={searchUnanswered} userData={userData}/>
        )
      default:
        return(
          <></>
        );
    }
  }

  return (
    <>
      <Header searchTab={searchTab} loggedIn={loggedIn} username={username}  />
      <SideBar questionTab={questionTab} tagTab={tagTab} />
      <main id="main" className="main">
        {render()}
      </main>
    </>
    
  )

}

export default App;
