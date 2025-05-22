import React, {useEffect, useRef} from "react";
import './Cursor.css';

function Cursor({ typedWord, targetWord, focused, wordChanged, prevWordOffset}) {
  const cursorRef = useRef(null);

  useEffect(() => {
    if(!wordChanged){
      //inside the same word
      cursorRef.current.style.transition = "transform 0.1s ease-in-out";
      cursorRef.current.style.transform = `translateX(${typedWord.length * 26}px) translateY(-2px)`;
      return;
    }
    if(wordChanged && typedWord.length !== 0){
      //backspace into new word
      cursorRef.current.style.transition = 'none';
      if(typedWord.length >= targetWord.length){
        cursorRef.current.style.transform =`translateX(${(typedWord.length + 1)* 26}px) translateY(-2px)`;
      } else {
        cursorRef.current.style.transform = `translateX(${(targetWord.length + 1) * 26}px) translateY(-2px)`;
      }

      void cursorRef.current.offsetHeight;

      cursorRef.current.style.transition = "transform 0.1s ease-in-out";
      cursorRef.current.style.transform = `translateX(${typedWord.length * 26}px) translateY(-2px)`;
      return;
    }
    //space into new word
    cursorRef.current.style.transition = 'none';
    if(prevWordOffset >= 0) {
      cursorRef.current.style.transform =`translateX(-${(1 + prevWordOffset)* 26}px) translateY(-2px)`;
    } else {
      cursorRef.current.style.transform =`translateX(-26px) translateY(-2px)`;
    }


    void cursorRef.current.offsetHeight;

    cursorRef.current.style.transition = "transform 0.1s ease-in-out";
    cursorRef.current.style.transform = `translateX(${typedWord.length * 26}px) translateY(-2px)`;

  }, [prevWordOffset, targetWord.length, typedWord, wordChanged]); // Important dependency

  return (
    <div className={`cursor ${focused?"":"pulsing"}`.trim()} ref={cursorRef}
    />
  );
}

export default Cursor;