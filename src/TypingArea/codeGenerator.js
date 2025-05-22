import syntax from '../../public/syntax.json';

const KEYWORD_CHANCE = 0.85;
const SEMICOLON_CHANCE = 0.25;
const BEGINNER_KEYWORD_CHANCE = 0.5;
const INTERMEDIATE_KEYWORD_CHANCE = 0.9;

const EXPRESSION_WEIGHTS = [2, 4, 5, 6, 9, 10, 12];
const EXPRESSION_WEIGHTS_TOTAL = 16

const beginnerKeywords = syntax.keywords.beginner.words;
const intermediateKeywords = syntax.keywords.intermediate.words;
const expertKeywords = syntax.keywords.expert.words;

const numVarNameGroups = syntax.expressions.variable_names.num;
const boolVarNames = syntax.expressions.variable_names.bool;
const stringVarNames = syntax.expressions.variable_names.string;

const operatorGroups = syntax.expressions.operators;

export function randomCode(length, difficulty, useExpressions, useSemicolon) {

  let result = "";
  for (let i = 0; i < length; i++) {
    if(i !== 0) {
      if(useSemicolon && Math.random() < SEMICOLON_CHANCE) result += ";"
      result += " ";
    }
    let newWord = randomSyntax(length - i, difficulty, useExpressions);
    i += countWords(newWord) - 1;
    result += newWord;
  }
  return result.split(" ");
}

function randomSyntax(words_left, difficulty, useExpressions) {
  if(!useExpressions) return randomKeyword(difficulty);

  let random = Math.random();
  if(random < KEYWORD_CHANCE) return randomKeyword(difficulty);
  return randomExpression(words_left);
}

function randomKeyword(difficulty) {
  if(difficulty === 1) return randomBeginnerKeyword();

  let random = Math.random();
  if (random < BEGINNER_KEYWORD_CHANCE) return randomBeginnerKeyword();
  if(difficulty === 2) return randomIntermediateKeyword();

  if (random < INTERMEDIATE_KEYWORD_CHANCE) return randomIntermediateKeyword();
  return randomExpertKeyword();
}

function randomBeginnerKeyword() {
  return beginnerKeywords[Math.floor(Math.random() * beginnerKeywords.length)];
}

function randomIntermediateKeyword() {
  return intermediateKeywords[Math.floor(Math.random() * intermediateKeywords.length)];
}

function randomExpertKeyword() {
  return expertKeywords[Math.floor(Math.random() * expertKeywords.length)];
}

function randomExpression(words_left) {
  let random = Math.random();
  if(words_left >= 5) {
    for (let i = 0; i < EXPRESSION_WEIGHTS.length; i++) {
      if (random < EXPRESSION_WEIGHTS[i] / EXPRESSION_WEIGHTS_TOTAL) {
        return random_functions[i]();
      }
    }
    return random_functions[EXPRESSION_WEIGHTS.length]();
  }

  if(words_left >= 3) {
    for(let i = 0; i < EXPRESSION_WEIGHTS.length - 1; i++) {
      if (random < EXPRESSION_WEIGHTS[i] / EXPRESSION_WEIGHTS[EXPRESSION_WEIGHTS.length - 1]) {
        return random_functions[i]();
      }
    }
    return random_functions[EXPRESSION_WEIGHTS.length - 1]();
  }

  if(random < 0.5) return random_functions[0]();
  return random_functions[1]();

}

const random_functions = [
function randomPrefix() {
  return randomOperator(4) + randomNumName(1);
},

function randomPostfix() {
  return randomNumName(1)+ randomOperator(4);
},

function randomAssignment() {
  let names = randomAnyName(2);
  return names[0] + " = " + randomOperator(5) + names[1];
},

function randomConditional() {
  let names = randomAnyName(2);
  return randomOperator(1) + randomBoolName(1) + "? " + names[0] + ": " + names[1];
},

function randomCompound() {
  let names = randomNumName(2);
  return names[0] + " " + randomOperator(0) + "= " + names[1];
},

function randomComparison() {
  let names = randomNumName(2);
  return names[0] + " " + randomOperator(2) + " " + names[1];
},

function randomLogical() {
  let names = randomBoolName(2);
  return names[0] + " " + randomOperator(3) + " " + names[1];
},

function randomAssignmentArithmetic() {
  let names = randomNumName(3);
  return names[0] + " = " + names[1] + " " + randomOperator(0) + " " + names[2];
}
];

function randomOperator(index) {
  let index2 = Math.floor(Math.random() * operatorGroups[index].length);
  return operatorGroups[index][index2];
}

function randomNumName(count) {
  let index = Math.floor(Math.random() * numVarNameGroups.length);
  if(count === 1) {
    return numVarNameGroups[index][0];
  }
  if(count === 2) {
    return [numVarNameGroups[index][1], numVarNameGroups[index][2]];
  }
  return numVarNameGroups[index];
}

function randomBoolName(count) {
  let index = Math.floor(Math.random() * boolVarNames.length);
  if(count === 1) {
    return boolVarNames[index];
  }
  let index2 = Math.floor(Math.random() * boolVarNames.length);
  if(index === index2) index === 0? index2++ : index2--;
  return [boolVarNames[index], boolVarNames[index2]];
}

function randomStringName(count) {
  let index = Math.floor(Math.random() * stringVarNames.length);
  if(count === 1) {
    return stringVarNames[index];
  }
  let index2 = Math.floor(Math.random() * stringVarNames.length);
  if(index === index2) index === 0? index2++ : index2--;
  return [stringVarNames[index], stringVarNames[index2]];
}

function randomAnyName(count) {
  let num = Math.floor(Math.random() * 3);
  if(num === 0) return randomNumName(count);
  if(num === 1) return randomBoolName(count);
  return randomStringName(count);
}

function countWords(code) {
  let count = 0;
  for(let i = 0; i < code.length; i++) {
    if(code[i] === " ") count++;
  }
  return count + 1;
}