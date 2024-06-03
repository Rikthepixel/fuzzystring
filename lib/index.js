'use strict';

// src/index.ts
function calculateFuzzyMatchPartsScore(fuzzyMatchParts) {
  const getRoleLength = (role) => fuzzyMatchParts.filter((part) => part.type === role).map((part) => part.content).join("").length;
  const fullLength = fuzzyMatchParts.map((part) => part.content).join("").length;
  const fuzzyLength = getRoleLength("fuzzy");
  const inputLength = getRoleLength("input");
  const suggestionLength = getRoleLength("suggestion");
  return (inputLength + fuzzyLength * 0.7 + suggestionLength * 0.9) / fullLength;
}
function compareLetters(a, b, isCaseSensitive = false) {
  if (isCaseSensitive) {
    return a === b;
  }
  return a.toLowerCase() === b.toLowerCase();
}
function fuzzyString(input, stringToBeFound, { truncateTooLongInput, isCaseSesitive } = {}) {
  if (input.length > stringToBeFound.length && !truncateTooLongInput) {
    return false;
  }
  if (input.length > stringToBeFound.length && truncateTooLongInput) {
    input = input.substr(0, stringToBeFound.length);
  }
  if (input === stringToBeFound) {
    return {
      parts: [{ content: input, type: "input" }],
      score: 1
    };
  }
  const matchParts = [];
  const remainingInputLetters = input.split("");
  let ommitedLettersBuffer = [];
  let matchedLettersBuffer = [];
  function addOmmitedLettersAsFuzzy() {
    if (ommitedLettersBuffer.length > 0) {
      matchParts.push({
        content: ommitedLettersBuffer.join(""),
        type: "fuzzy"
      });
      ommitedLettersBuffer = [];
    }
  }
  function addMatchedLettersAsInput() {
    if (matchedLettersBuffer.length > 0) {
      matchParts.push({
        content: matchedLettersBuffer.join(""),
        type: "input"
      });
      matchedLettersBuffer = [];
    }
  }
  for (let anotherStringToBeFoundLetter of stringToBeFound) {
    const inputLetterToMatch = remainingInputLetters[0];
    if (!inputLetterToMatch) {
      break;
    }
    const isMatching = compareLetters(
      anotherStringToBeFoundLetter,
      inputLetterToMatch,
      isCaseSesitive
    );
    if (!isMatching) {
      ommitedLettersBuffer.push(anotherStringToBeFoundLetter);
      addMatchedLettersAsInput();
      continue;
    }
    remainingInputLetters.shift();
    matchedLettersBuffer.push(anotherStringToBeFoundLetter);
    addOmmitedLettersAsFuzzy();
    if (!remainingInputLetters.length) {
      addMatchedLettersAsInput();
    }
  }
  if (remainingInputLetters.length > 0) {
    return false;
  }
  const matchedPart = matchParts.map((match) => match.content).join("");
  const suggestionPart = stringToBeFound.replace(matchedPart, "");
  if (suggestionPart) {
    matchParts.push({ content: suggestionPart, type: "suggestion" });
  }
  const score = calculateFuzzyMatchPartsScore(matchParts);
  return {
    score,
    parts: matchParts
  };
}

exports.fuzzyString = fuzzyString;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map