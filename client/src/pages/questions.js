import QuestionList from '../components/questionList.js';


export default function questions({numb, model, click, questionForm, questionTab, activeTab, unansweredTab, searchTab, userData, loggedIn}) {
    return(
        <>
            <div id="questions" className="tabcontent">
                <div id="questionHeader">
                    <h1>All Questions</h1>
                    <button className="ask tablinks" onClick={()=>questionForm()}>Ask Question</button>
                    <p id="numbQsts"> {numb} questions</p>
                    <div className="filters" id="filters">
                        <button className="buttonlinks" id="newestQ" onClick={()=>questionTab()}>Newest</button>
                        <button className="buttonlinks" id="activeQ" onClick={()=>activeTab()}>Active</button>
                        <button className="buttonlinks" id="unasweredQ" onClick={()=>unansweredTab()}>Unanswered</button>
                    </div>
                </div>
                <QuestionList  click={click} model={model} searchTab={searchTab} userData={userData} loggedIn={loggedIn}/>
            </div>
        </>
    )
}