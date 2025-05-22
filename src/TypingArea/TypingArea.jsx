import './TypingArea.css'
import React, {useEffect, useRef} from "react";
import {randomCode} from "./codeGenerator.js";
import Word from "./Word.jsx";
import {useState, useCallback} from "react";
import Cursor from "./Cursor.jsx";

function TypingArea() {
  const [words] = useState(randomCode(100, 1, false, false));
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [wordChanged, setWordChanged] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const inputRef = useRef(null);

  let inputList = input.split(" ");

  const scrollToRef = useCallback((el) => {
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start"
      });
    }
  }, []);

  useEffect(() => {

  }, [activeWordIndex]);

  return (
    <div className={"typing-area"}>
      <input id="text-input" className="text-input" autoComplete="off" autoCapitalize="off" autoCorrect="off" ref={inputRef} value={input}
             onFocus={() => setFocused(true)}
             onBlur={() => setFocused(false)}
             onContextMenu={(event) => {event.preventDefault();}}

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
        {words.map((word, i) => {
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
  )
}

export default TypingArea;