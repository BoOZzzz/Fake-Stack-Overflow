import axios from 'axios';
import { useState, useEffect } from 'react';


function Data(){
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:8000/answers')
            .then(response => {
                setAnswers(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    
        axios.get('http://localhost:8000/questions')
            .then(response => {
                setQuestions(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    
        axios.get('http://localhost:8000/tags')
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    
    return [questions, answers, tags];

}

export default Data;