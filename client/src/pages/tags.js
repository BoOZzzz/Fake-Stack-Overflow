

export default function DisplayTags({model, questionForm, searchTab}) {
    const tags = model[2];
    const questions = model[0];
    console.log(questions[0].tags);
    function handleTagClick(tagName) {
        searchTab("[" + tagName + "]");
    }

    function getNumQuestionsByTag(tag) {
        let i, j;
        let numbQsts = 0;
        for(i = 0; i < questions.length; i++) {
          for(j = 0; j< questions[i].tags.length; j++){
            if(tag == questions[i].tags[j].name) {
              numbQsts += 1;
            }
          }
        }  
        return numbQsts;
      }
  
    return (
      <>
        <div style={{display:"flex"}} id="tagHeader">
            <h1 id="numTags">{tags.length} Tags</h1>
            <h1>All Tags</h1>
            <button onClick={()=>questionForm()}>Ask Question</button>
        </div> 
        <div id="tags" style={{display: "flex",
            width: "100%",
            height: "100%",
            marginTop: "40px",
            flexWrap: "wrap"
            }} className="tagcontent">
            {tags.map((tag, i) => (
            <div
                key={tag._id}
                className="tagcontent"
                style={{
                display: "flex",
                width: "30%",
                height: "100%",
                marginTop: "40px",
                }}
            >
                <div
                className="tag-text"
                style={{
                    display: "flex",
                    border: "dotted",
                    width: "100%",
                    height: "150px",
                    margin: "20px 40px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                }}
                >
                <a
                    href="#"
                    onClick={() => handleTagClick(tag.name)}
                    style={{ textDecoration: "none" }}
                >
                    <span id="tagName">{tag.name}</span>
                </a>
                <span>
                    {getNumQuestionsByTag(tag.name)}{" "}
                    {getNumQuestionsByTag(tag.name) > 1 ? "questions" : "question"}
                </span>
                </div>
            </div>
            ))}
        </div>
      </>
    );
  }