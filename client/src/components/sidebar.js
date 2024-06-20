


export default function sideBar({questionTab, tagTab}) {
    return(
        <div id="sidebar">
            <div className="tab">
                <button className="tablinks" id="questionTab" onClick={() => questionTab()} ><b>Questions</b></button>
                <button className="tablinks" id="tagsTab" onClick={() => tagTab()} ><b>Tags</b></button>
            </div>
        </div>
    )
}