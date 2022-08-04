import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import http from './http-common.js';
import axios from "axios";
import CanvasJSReact from './canvasjs.react';

function App() {
  const [wins, setWins] = useState(0);
  const [loses, setLoses] = useState(0);
  
  const [clicked, setClicked] = useState(false);
  const [newGuesses, setNewGuesses] = useState([]);
  const [first, setFirst] = useState("black");
  const [second, setSecond] = useState("black");
  const [third, setThird] = useState("black");
  const [fourth, setFourth] = useState("black");
  const [fifth, setFifth] = useState("black");

  const [reds, setReds] = useState(new Set());
  const [yellowsQuery, setYellowsQuery] = useState(new Set());
  const [yellows, setYellows] = useState(new Set());
  const [greens, setGreens] = useState(new Set());

  const [solved, setSolved] = useState(false);
  const [solution, setSolution] = useState([]);
  const [guess, setGuess] = useState(["a","d","i","e","u"]);
  const [attempt, setAttempt] = useState(1);
  const [start, setStart] = useState(false);

  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options = {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: "Total Wins"
    },
    axisX: {
      title: "Number of Games",
      reversed: true,
    },
    axisY: {
      title: "You <3",
      includeZero: true,
    },
    data: [{
      type: "bar",
      dataPoints: [
        { y:  wins, label: "Wins" },
        { y:  loses, label: "Loses" },
      ]
    }]
  }

  useEffect(() => {
    if (!solved){
      if (solution.length > 0) analyzeWordle();
      if (Array.from(greens).length === 5){
        setSolved(true);
        if (attempt <= 6){
          setWins(wins + 1);
        } else {
          setLoses(loses + 1);
        }
        setNewGuesses([]);
        return;
      }
    }
    if (newGuesses.length > 0) queryNewSolutions();
  }, [solution, first, second, third, fourth, fifth, reds, yellows, yellowsQuery, greens, guess]);

  const boxes = (
    <div className="flex justify-center mt-20 text-center mb-20">
        <div className={first}>
          <h1 key={0} className="text-2xl">{guess.at(0)}</h1>
        </div>
        <div className={second}>
          <h1 key={1} className="text-2xl">{guess.at(1)}</h1>
        </div>
        <div className={third}>
          <h1 key={2} className="text-2xl">{guess.at(2)}</h1>
        </div>
        <div className={fourth}>
          <h1 key={3} className="text-2xl">{guess.at(3)}</h1>
        </div>
        <div className={fifth}>
          <h1 key={4} className="text-2xl">{guess.at(4)}</h1>
        </div>
    </div>
  );

  function setStyling(i, value){
    if (i === 0){
      setFirst(value);
    } else if (i === 1){
      setSecond(value);
    } else if (i === 2){
      setThird(value);
    } else if (i === 3){
      setFourth(value);
    } else {
      setFifth(value);
    }
  }

  function analyzeWordle(){
    guess.forEach((l,i) => {
      if (solution.at(i) === l){
        setStyling(i, "green");
        setGreens(greens.add(String(i) + l));
      } else if (solution.at(i) !== l && solution.includes(l)){
        setStyling(i, "yellow")
        setYellowsQuery(yellowsQuery.add(String(i)+l));
        setYellows(yellows.add(l));
      } else if (!solution.includes(l)){
        setStyling(i, "red");
        setReds(reds.add(l));
      }
    });
  }

  function queryNewSolutions(){
    if (!clicked) setClicked(true);
    setNewGuesses([]);
    var r = Array.from(reds).join(',');
    var y = Array.from(yellowsQuery).join(',');
    var g = Array.from(greens).join(',');
    var solutionString = solution.join('');
    var guessString = guess.join('');
    var url = `https://us-west-2.aws.data.mongodb-api.com/app/wordleapplication-cjdfv/endpoint/find_potential_solutions?solution=${solutionString}&guess=${guessString}&r=${r}&y=${y}&g=${g}`
    axios.get(url)
    .then(function (resp) {
      var all_words = [];
      for (var i = 0; i < resp.data.length; i++){
        var w = String(resp.data[i]['word']);
        all_words.push(w);
      }
      setNewGuesses(all_words);
    })
    .catch(e => {
      console.log(e);
    });
  }

  function startWordle(){
    http.get()
      .then(resp => {
        var solutionArray = [];
        var word = String((resp.data[0])['word']);
        for (var i = 0; i < word.length; i++){
          solutionArray.push(word[i]);
        }
        setSolution(solutionArray);
        setStart(true);
      })
      .catch(e => {
        console.log(e);
      });
  }

  function reset (event) {
    var newGuessString = event.target.innerText;
    var newGuess = [];
    for (var i = 0; i < newGuessString.length; i++){
      newGuess.push(newGuessString[i]);
    }
    setGuess(newGuess);
    setAttempt(attempt + 1);
  }

  function resetGame(){
    setStart(false);
    setFirst("black");
    setSecond("black");
    setThird("black");
    setFourth("black");
    setFifth("black");
    setReds(new Set());
    setYellows(new Set());
    setGreens(new Set());
    setYellowsQuery(new Set());
    setSolved(false);
    setSolution([]);
    setGuess(["a","d","i","e","u"]);
    setAttempt(1);
    setClicked(false);
  }

  const resultsComponent = () => {
    if (solved){
      if (attempt <= 6){
        return  (<div>
          <Alert variant="success">You win! Great job.</Alert>
          <CanvasJSChart options = {options}/>
          <Button variant="primary" className="flex justify-center text-center" onClick={resetGame}>Play again</Button>
          </div>);
      } else {
        return (<div>
         <Alert variant="danger">You lose! Your attempts were not less than 6.</Alert>
         <CanvasJSChart options = {options}/>
        <Button variant="primary" className="flex justify-center text-center" onClick={resetGame}>Play again</Button>
        </div>);
      }
    } else if (newGuesses.length === 0 && attempt === 1){
      return <Button variant="primary" className="flex justify-center text-center" onClick={queryNewSolutions}>{clicked? `Loading...` : `Load Results`}</Button>
    } else if (newGuesses.length === 0 && attempt !== 1){
      return <Alert variant="primary">Loading Results...</Alert>
    }
  }

  return (
    <div>
      <div className="flex justify-center">
        <h1 className="absolute text-3xl font-extrabold mt-10"> Wordle Solver</h1>
      </div>
      <div className="justify-center text-center">
          {start ? <p className="relative mt-20">Attemps: {attempt}</p> : null}
          {start ? 
            <p className="relative">Word is: {solved ? solution: `???`}</p>
            :
            <Button variant="primary mt-20" className="relative" onClick={startWordle}>Start</Button>
          }
      </div>
      {start ? 
        boxes
      : null
      } 
      {start ?
        <div className="px-10 text-center">
          {newGuesses.length > 0 ? 
            newGuesses.map(word => 
              <Button variant="primary" className="mr-4 mb-2" onClick={e => reset(e)}>{word}</Button>
            )
          : 
          resultsComponent()}
        </div>
      : null}
    </div>
  );
}

export default App;