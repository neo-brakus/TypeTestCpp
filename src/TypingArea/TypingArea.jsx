import './TypingArea.css'
import React, {useRef, useEffect} from "react";
import {randomCode} from "./codeGenerator.js";
import Word from "./Word.jsx";
import {useState, useCallback} from "react";
import Cursor from "./Cursor.jsx";

function TypingArea({syntax, type, semicolons, expressions, gameStartedFunct}) {
  const [words, setWords] = useState(null);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(true);
  const [wordChanged, setWordChanged] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const inputRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [results] = useState({});

  const typingContainerRef = useRef(null);
  const generatedCodeRef = useRef(null);
  const focusRef = useRef(null);

  const[typedCorrect, setTypedCorrect] = useState(0);
  const[typed, setTyped] = useState(0);
  const[keysPressed, setKeysPressed] = useState(0);

  let inputList = input.split(" ");

  useEffect(() => {
    if (gameEnded && typingContainerRef.current) {
      typingContainerRef.current.focus();
      return;
    }
    if(!gameEnded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameEnded]);

  useEffect(() => {
    if(!gameEnded) {
      generatedCodeRef.current.style.filter = focused? "blur(0px)": "blur(5px)";
      focusRef.current.style.opacity = focused? "0" : "1";
    }
  }, [focused]);

  const transitionSetOpacity = () => {
    typingContainerRef.current.style.opacity = 1;
  }

  //make a 0.5 second transition that makes the opacity 0 then 1
  // //used universally to make changes inside the typing container
  const transitionAnimation = () => {
    typingContainerRef.current.style.opacity = 0;
    setTimeout(transitionSetOpacity, 250)
  }
  
  const handleGameEnded = () => {
    setGameEnded(true);
    setFocused(false);

    const inputList = input.split(" ");
    let time = timeLeft > 0 ? timeLeft : 1;
    let words_correct_norm = 0;
    let words_norm = 0;
    let letters_correct = 0;
    let letters_incorrect = 0;
    let letters_extra = 0;
    let letters_missed = 0;

    inputList.forEach((input_word, index) => {
      if(words[index] !== undefined) {
        if(words[index] === input_word) {
          words_correct_norm += words[index].length + 1;
          if(index === inputList.length - 1) words_correct_norm--;
        }
        words_norm += input_word.length + 1;
        if(index === inputList.length - 1) words_norm--;
        words[index].length < input_word.length?
          (letters_extra += input_word.length - words[index].length):
          (letters_missed += words[index].length - input_word.length);
        input_word.split("").forEach((letter, letter_index) => {
          letter_index < words[index].length && (letter === words[index].split("")[letter_index]? letters_correct++ : letters_incorrect++);
        })
      }
    })
    words_correct_norm /= 5;
    words_norm /= 5;
    results.wpm = Math.round(words_correct_norm * 60 / time);
    results.raw = Math.round(words_norm * 60 / time);
    results.time = time;
    results.acc = typed === 0? 0: Math.round(100 * typedCorrect / typed);
    results.eff = keysPressed === 0? 0: Math.round(100 * input.length / keysPressed);
    results.chars = [letters_correct, letters_incorrect, letters_extra, letters_missed];
    results.type = [type.split(" ").join("-"), syntax === 1? "easy": syntax === 2? "normal": "hard"];
  }
  
  useEffect(() => {
    if(type.split(" ")[0] === "words" && inputList.length > type.split(" ")[1] ||
      type.split(" ")[0] === "time" && inputList.length > type.split(" ")[1] * 100/15 ||
      inputList.length.toString() === type.split(" ")[1] && inputList.at(-1) === words.at(-1)) {
      results.gameEndType = "word-limit-reached";
      transitionAnimation()
      setTimeout(handleGameEnded, 250);
    }
  }, [input]);

  //randomly regenerates the words 
  const rerenderWords = () => {
    setWords(randomCode((type.split(" ")[0] === "words"? type.split(" ")[1]: type.split(" ")[1] * 100/15), syntax, expressions, semicolons));
  }

  //delay the end of a game for the animation to finish
  const endGameDelay = () => {
    setGameEnded(false);
  }

  const resetGame = () => {
    rerenderWords();
    setTypedCorrect(0);
    setTyped(0);
    setKeysPressed(0);
    setGameStarted(false);
    gameStartedFunct(false);
    setInput("");
    setTimeLeft(0);
    transitionAnimation();
    setTimeout(endGameDelay, 250);
  }

  //rerenders the words when any of the modes changes
  useEffect(() => {
    rerenderWords();
  }, [syntax, type, semicolons, expressions]);


  useEffect(() => {
    let interval;

    if (gameStarted && !gameEnded) {
      if(type.split(" ")[0] === "words" || type.split(" ")[0] === "time" && type.split(" ")[1] > timeLeft) {
        interval = setInterval(() => {
          setTimeLeft((prev) => prev + 1);
        }, 1000);
      }
      if(type.split(" ")[0] === "time" && type.split(" ")[1] <= timeLeft) {
        results.gameEndType = "time-ran-out";
        transitionAnimation();
        setTimeout(handleGameEnded, 250);
      }
    }

    return () => clearInterval(interval);
  }, [gameStarted, timeLeft]);

  const scrollToRef = useCallback((el) => {
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start"
      });
    }
  }, []);

  return (
    <div className="typing-container" ref={typingContainerRef}
         tabIndex={0}
    onKeyDown={(event) =>{
      if (event.key === "Enter" && gameEnded) {
        event.preventDefault();
        resetGame();
      }
      if(event.key === "Tab" && !gameStarted && !gameEnded) {
        event.preventDefault();
        resetGame();
      }
    }}>
      <div
        className="timer"
        style={gameStarted && !gameEnded && type.split(" ")[0] === "time"? { opacity: 1 } : { opacity: 0 }}>
        {timeLeft}
      </div>
      {
        !gameEnded &&
        <div className={"focus"} ref={focusRef}>
          <img className="cursor" src={"./Images/cursor.svg"} alt={"cursor"}></img><p>Click here to focus</p>
        </div>
      }
      {gameEnded &&
        <div className="result-container-grid">

          <div className="result-left important">
            <div className="result-data">
              wpm<span className="important">{results.wpm}</span>
            </div>
            <div className="result-data">
              raw<span className="important">{results.raw}</span>
            </div>
           </div>

          <div className="result-right important">
            <div className="result-data">
              time<span className="important">{results.time}s</span>
            </div>
            <div className="result-data">
              acc<span className="important">{results.acc}%</span>
            </div>
          </div>

          <div className="result-left middle">
            <div className="result-data">
              efficiency<span>{results.eff}%</span>
            </div>
          </div>

          <div className="result-right middle">
            <div className="result-data">
              chars<span>{results.chars.join('/')}</span>
            </div>
          </div>

          <div className="result-left">
            <div className="result-data bottom">
              test-type
            </div>
          </div>

          <div className="result-right">
            <div className="result-data">
              <span>{results.type.join('-')}</span>
            </div>
          </div>

          <div className="result-left">
            <div className="result-data bottom">
              game-end-type
            </div>
          </div>

          <div className="result-right">
            <div className="result-data">
              <span>{results.gameEndType}</span>
            </div>
          </div>
        </div>
      }
      {
        !gameEnded &&
    <div className="typing-area">
      <input id="text-input" className="text-input" autoComplete="off" autoCapitalize="off" autoCorrect="off" ref={inputRef} value={input}
             onFocus={() => setFocused(true)}
             onBlur={() => setFocused(false)}
             onContextMenu={(event) => {event.preventDefault();}}
             onKeyDown={(event) => {
               if (event.key === "Enter") {
                 results.gameEndType = "enter-key-pressed";
                 transitionAnimation();
                 setTimeout(handleGameEnded, 250);
                 return;
               }
               if(event.key === "Tab") {
                 event.preventDefault();
               }
             }}

             onChange={(event) => {

               let newInput = event.target.value;


               //don't update if change is more than 1 letter
               if(Math.abs(newInput.length - input.length) > 1) return;

               let newInputList = newInput.split(" ");


               //don't update if change happened but last word is the same
               if(newInputList.at(-1) === inputList.at(-1)) return;

               let backspace = (input.length > newInput.length);
               let space = newInputList.length > inputList.length;


               //if the number of extra letter is 10 then only accept backspace and space
               if(inputList[inputList.length - 1].length - 10 >= words[inputList.length - 1].length) {
                 if(backspace || space) {
                   setWordChanged(newInputList.length !== inputList.length);
                   space && setActiveWordIndex(activeWordIndex + 1);
                   setInput(newInput);
                   setKeysPressed(keysPressed + 1);
                 }
                 return;
               }

               //don't allow going to the next word if nothing was typed for this word
               if(inputList.at(-1).length === 0 && space) {
                 return;
               }

               //setting the gameStarted variable
               if (!gameStarted && newInput !== "") {
                 setGameStarted(true);
                 gameStartedFunct(true);
               }

               if (gameStarted && newInput === "") {
                 setGameStarted(false);
                 gameStartedFunct(false);
                 setTimeLeft(0);
               }

               //don't allow going back to correct words or going to next one with no letters typed
               if(inputList.at(-1).length === 0 && inputList.length > 1 && inputList[inputList.length - 2] === words[inputList.length - 2]) {
                 if(!backspace) {
                   setKeysPressed(keysPressed + 1);
                   setTyped(typed + 1);
                   if(newInputList.at(-1).at(-1) === words[newInputList.length - 1].at(newInputList.at(-1).length - 1)) {
                     setTypedCorrect(typedCorrect + 1);
                   }
                   setWordChanged(newInputList.length !== inputList.length);
                   setInput(newInput);
                 }
                 return;
               }


               setKeysPressed(keysPressed + 1);
               if(!(space || backspace)) {
                 setTyped(typed + 1);
                 if(newInputList.at(-1).at(-1) === words[newInputList.length - 1].at(newInputList.at(-1).length - 1)) {
                   setTypedCorrect(typedCorrect + 1);
                 }
               }
               space && setActiveWordIndex(activeWordIndex + 1);
               inputList.at(-1).length === 0 && inputList.length > 1 && backspace && setActiveWordIndex(activeWordIndex - 1);

               setWordChanged(newInputList.length !== inputList.length);
               setInput(newInput);
             }}
      />
      <div className="generated-code" ref={generatedCodeRef}>
        {words !== null &&  (words.map((word, i) => {
          return i < activeWordIndex + 35 &&
            <Word
              key={i} targetWord={word}
              typedWord={i < inputList.length? inputList[i]: ""}
              ref={(i === inputList.length - 1)? scrollToRef: null}

              status={(i < inputList.length - 1? "typed":
                (i === inputList.length - 1? "active": ""))}>

              {i === inputList.length - 1 && <Cursor typedWord={i < inputList.length? inputList[i]: ""}
                                                     focused={gameStarted} targetWord={word} key={word}
                                                     wordChanged={wordChanged}
                                                     prevWordOffset={i > 0 && (words[i - 1].length - inputList[i - 1].length)}/>}
            </Word>;
        }))
        }
      </div>
    </div>
      }
      <div className={"repeat"} onClick={() => {
          resetGame();
      }}>
        <img src={"./Images/replay.png"} alt="replay" />
      </div>
    </div>
  )
}

export default TypingArea;