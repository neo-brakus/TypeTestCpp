import React from "react";
import Letter from "./Letter.jsx";
import './Word.css'


const Word = React.forwardRef(({ targetWord, typedWord, status, children}, ref) => {
  const targetLetters = targetWord.split("");
  const typedLetters = typedWord.split("");

  return (
    <div ref={ref}
         className={`word ${status === "typed" && targetWord !== typedWord? "incorrect": ""} ${status}`.trim()}
    >
      {children}
      {
        typedLetters.length > targetLetters.length &&
        typedLetters.map((letter, i) => {
          return (i < targetLetters.length?
            (targetLetters[i] === letter?
              <Letter key={i} char={letter} status="correct"/>:
              <Letter key={i} char={targetLetters[i]} status="incorrect" />):
            <Letter key={i} char={letter} status="extra" />)
        })
      }
      {
        typedLetters.length <= targetLetters.length &&
        targetLetters.map((letter, i) => {
          return i < typedLetters.length && (letter === typedLetters[i]?
            <Letter key={i} char={letter} status="correct a"/> :
            <Letter key={i} char={letter} status="incorrect a"/>)
        })
      }
      {
        typedLetters.length <= targetLetters.length &&
        targetLetters.map((letter, i) => {
          return (i >= typedLetters.length && <Letter key={i} char={letter}/>);
        })
      }
    </div>
  );
})

export default React.memo(Word);