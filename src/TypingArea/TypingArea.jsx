import './TypingArea.css'
import React, {useRef, useEffect} from "react";
import {randomCode} from "./codeGenerator.js";
import Word from "./Word.jsx";
import {useState, useCallback} from "react";
import Cursor from "./Cursor.jsx";

function TypingArea({syntax, type, semicolons, expressions, gameStartedFunct}) {
  const [words, setWords] = useState(null);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [wordChanged, setWordChanged] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const inputRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  let inputList = input.split(" ");

  const reloadWords = () => {
    setWords(randomCode((type.split(" ")[0] === "words"? type.split(" ")[1]: type.split(" ")[1]/15 * 50), syntax, expressions, semicolons));
  }

  useEffect(() => {
    reloadWords();
  }, [syntax, type, semicolons, expressions]);


  useEffect(() => {
    let interval;

    if (gameStarted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev + 1);
      }, 1000);
    }

    // Cleanup
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
    <div className="typing-container">
      <div
        className="timer"
        style={gameStarted ? { opacity: 1 } : { opacity: 0 }}>
        {timeLeft}
      </div>
    <div className="typing-area">
      <input id="text-input" className="text-input" autoComplete="off" autoCapitalize="off" autoCorrect="off" ref={inputRef} value={input}
             onFocus={() => setFocused(true)}
             onBlur={() => setFocused(false)}
             onContextMenu={(event) => {event.preventDefault();}}

             onChange={(event) => {

               let newInput = event.target.value;


               if (!gameStarted && newInput !== "") {
                 setGameStarted(true);
                 gameStartedFunct(true);
               }

               if (gameStarted && newInput === "") {
                 setGameStarted(false);
                 gameStartedFunct(false);
                 setTimeLeft(0);
               }


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
                 }
                 return;
               }

               //don't allow going to the next word if nothing was typed for this word
               if(inputList.at(-1).length === 0 && space) {
                 return;
               }

               //don't allow going back to correct words or going to next one with no letters typed
               if(inputList.at(-1).length === 0 && inputList.length > 1 && inputList[inputList.length - 2] === words[inputList.length - 2]) {
                 if(!backspace) {
                   setWordChanged(newInputList.length !== inputList.length);
                   setInput(newInput);
                 }
                 return;
               }

               space && setActiveWordIndex(activeWordIndex + 1);
               (inputList.at(-1).length === 0 && inputList.length > 1 && backspace) && setActiveWordIndex(activeWordIndex - 1);

               setWordChanged(newInputList.length !== inputList.length);
               setInput(newInput);
             }}
      />
      <div className="generated-code">

        {words !== null && words.map((word, i) => {
          return <Word key={i} targetWord={word}
                       typedWord={i < inputList.length? inputList[i]: ""}
                       ref={(i === inputList.length - 1)? scrollToRef: null}

                       status={(i < inputList.length - 1? "typed":
                         (i === inputList.length - 1? "active": ""))}>
            {i === inputList.length - 1 && <Cursor typedWord={i < inputList.length? inputList[i]: ""}
                                                   focused={focused} targetWord={word} key={word}
                                                   wordChanged={wordChanged}
                                                   prevWordOffset={i > 0 && (words[i - 1].length - inputList[i - 1].length)}/>}
          </Word>;
        })}
      </div>
    </div>
      <div className={"repeat"} onClick={() => {
        reloadWords();
      }}>
        <img src={"./Images/replay.png"} alt="replay" />
      </div>
    </div>
  )
}

export default TypingArea;