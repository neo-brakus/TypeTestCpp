import React, {useCallback, useState} from "react";
import './App.css'
import TypingArea from "./TypingArea/TypingArea.jsx";

function App() {
  const [syntax, setSyntax] = useState(1);
  const [type, setType] = useState("words 100");
  const [semicolons, setSemicolons] = useState(false);
  const [expressions, setExpressions] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gameStartedFunct = useCallback((value) => {
    if(value !== null && value !== undefined) {
      setGameStarted(value);
    }
  }, []);

  return (
    <div className="app" style={gameStarted? {backgroundColor: "#232323"}: {backgroundColor: "#282828"}}>
      <div className="header" style={gameStarted? {transform: "translateY(-238px)"}: {transform: "translateY(0)"}}>
        <div className="header-content">
          <div className="logo">
            <h1>TypeTest<span>++</span></h1>
          </div>
        </div>
      </div>
      <div className="options-container" style={gameStarted? {transform: "translateY(-238px)"}: {transform: "translateY(0)"}}>
        <div className="options">

          <div className="options-section first">
            <div className="option-picker">
              <img className="syntax" src={"./Images/syntax.svg"} alt={"syntax"}></img>
              <div className={`option-pick ${syntax === 1? "active-option": ""}`.trim()} onClick={() => {
                setSyntax(1)
              }}>easy
              </div>
              <div className={`option-pick ${syntax === 2? "active-option": ""}`.trim()} onClick={() => {
                setSyntax(2)
              }}>medium
              </div>
              <div className={`option-pick ${syntax === 3? "active-option": ""}`.trim()} onClick={() => {
                setSyntax(3)
              }}>hard
              </div>
            </div>
          </div>
          <div className="separator"></div>
          <div className="options-section second">
            <div className="option-picker">
              <img className="time" src={"./Images/time.svg"} alt={"time"}></img>
              <div className={`option-pick ${type === "time 15"? "active-option": ""}`.trim()} onClick={() => {
                setType("time 15")
              }}>15
              </div>
              <div className={`option-pick ${type === "time 30"? "active-option": ""}`.trim()} onClick={() => {
                setType("time 30")
              }}>30
              </div>
              <div className={`option-pick ${type === "time 60"? "active-option": ""}`.trim()} onClick={() => {
                setType("time 60")
              }}>60
              </div>
              <img className="words" src={"./Images/words.svg"} alt={"words"}></img>
              <div className={`option-pick ${type === "words 25"? "active-option": ""}`.trim()} onClick={() => {
                setType("words 25")
              }}>25
              </div>
              <div className={`option-pick ${type === "words 50"? "active-option": ""}`.trim()} onClick={() => {
                setType("words 50")
              }}>50
              </div>
              <div className={`option-pick ${type === "words 100"? "active-option": ""}`.trim()} onClick={() => {
                setType("words 100")
              }}>100
              </div>
              <div className={`option-pick ${type === "words 200"? "active-option": ""}`.trim()} onClick={() => {
                setType("words 200")
              }}>200
              </div>
            </div>
          </div>
          <div className="separator"></div>
          <div className="options-section third">
            <div className="option-picker">
              <img className="optional" src={"./Images/optional.svg"} alt={"optional"}></img>
              <div className={`option-pick ${semicolons? "active-option": ""}`.trim()} onClick={() => {
                setSemicolons(!semicolons)
              }}>semicolons
              </div>
              <div className={`option-pick ${expressions? "active-option": ""}`.trim()} onClick={() => {
                setExpressions(!expressions)
              }}>expressions
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"typing-area-container"}>
        <TypingArea syntax={syntax} type={type} semicolons={semicolons} expressions={expressions} gameStartedFunct={gameStartedFunct}/>
      </div>
      <div className="tips-container">
        <div className="tips-area">
          <div className="tip">
            press <span>enter</span> to end a game
          </div>
          <div className="tip">
            press <span>tab</span> to regenerate words
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(App);
