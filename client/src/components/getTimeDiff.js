

export default function getTimeDiff(date, name, a) {
    let newDate = new Date(date);
    let dateArray = newDate.toString().split(" ");
    let currentYear = new Date().toString().split(" ")[3];
    let dateTimeStr = newDate.toTimeString().split(" ")[0].split(":");
    let milisec = new Date() - newDate;
    let yearsPassed = milisec/31556952000;
    let hoursPassed = yearsPassed*365*24;
    let minPassed = hoursPassed*60;
    let secPassed = minPassed*60;
    let str1 = name, str2;
    if(a == "ask"){
      if (currentYear != dateArray[3]){
        str2 = "asked " + dateArray[1] + " " + dateArray[2] +", "+ dateArray[3] +" at "+ dateTimeStr[0] + ":" + dateTimeStr[1];
      } else if (hoursPassed >= 24){
        str2 = "asked " 
        + dateArray[1] + " " + dateArray[2] +" at "+ dateTimeStr[0] + ":" + dateTimeStr[1];
      } else if (hoursPassed >= 1) {
        str2 = "asked "+ parseInt(hoursPassed).toString() + " hours ago";
      } else if (minPassed >= 1) {
        str2 = "asked " + parseInt(minPassed).toString() + " minutes ago";
      }else if (secPassed < 60){
        str2 = "asked "+ parseInt(secPassed).toString() + " seconds ago";
      }
    }else if (a == "answer"){
      if (currentYear != dateArray[3]){
        str2 = "answered " + dateArray[1] + " " + dateArray[2] +", "+ dateArray[3] +" at "+ dateTimeStr[0] + ":" + dateTimeStr[1];
      } else if (hoursPassed >= 24){
        str2 =  "answered " + dateArray[1] + " " + dateArray[2] +" at "+ dateTimeStr[0] + ":" + dateTimeStr[1];
      } else if (hoursPassed >= 1) {
        str2 = "answered "+ parseInt(hoursPassed).toString() + " hours ago";
      } else if (minPassed >= 1) {
        str2 = "answered " + parseInt(minPassed).toString() + " minutes ago";
      }else if (secPassed < 60){
        str2 = "answered "+ parseInt(secPassed).toString() + " seconds ago";
      }
    }
    return (
      [str1,str2]
    )
}