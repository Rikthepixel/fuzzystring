export type MatchRoleType = "input" | "fuzzy" | "suggestion";

export type FuzzyMatchPart = {
    content: string;
    type: MatchRoleType;
};

export interface FuzzyMatchOptions {
    truncateTooLongInput?: boolean;
    isCaseSesitive?: boolean;
}

function calculateFuzzyMatchPartsScore(fuzzyMatchParts: FuzzyMatchPart[]) {
    const getRoleLength = (role: MatchRoleType) =>
        fuzzyMatchParts
            .filter((part) => part.type === role)
            .map((part) => part.content)
            .join("").length;

    const fullLength = fuzzyMatchParts.map((part) => part.content).join("").length;
    const fuzzyLength = getRoleLength("fuzzy");
    const inputLength = getRoleLength("input");
    const suggestionLength = getRoleLength("suggestion");

    return (inputLength + fuzzyLength * 0.7 + suggestionLength * 0.9) / fullLength;
}

function compareLetters(a: string, b: string, isCaseSensitive = false) {
    if (isCaseSensitive) return a === b;
    return a.toLowerCase() === b.toLowerCase();
}

/**
 * Fuzzy matches a `input` string with a `searchValue`.
 *
 * @returns `number` a score (from 0 to 1) representing how similar the search value is to the input string.
 */
export function fuzzyMatch(input: string, searchValue: string, opts: FuzzyMatchOptions = {}): number {
    const { truncateTooLongInput, isCaseSesitive } = opts;

    // if input is longer than string to find, and we dont truncate it - it's incorrect
    if (input.length > searchValue.length && !truncateTooLongInput) {
        return 0;
    }

    // if truncate is enabled - do it
    if (input.length > searchValue.length && truncateTooLongInput) {
        input = input.substring(0, searchValue.length);
    }

    // if input is the same as string to be found - we dont need to look for fuzzy match - return it as match
    if (input === searchValue) {
        return 1;
    }

    const matchParts: FuzzyMatchPart[] = [];
    const remainingInputChars = input.split("");

    // let's create letters buffers
    // it's because we'll perform matching letter by letter, but if we have few letters matching or not matching in the row
    // we want to add them together as part of match
    let ommitedLettersBuffer: string[] = [];
    let matchedLettersBuffer: string[] = [];

    // helper functions to clear the buffers and add them to match
    function addOmmitedLettersAsFuzzy() {
        if (ommitedLettersBuffer.length > 0) {
            matchParts.push({
                content: ommitedLettersBuffer.join(""),
                type: "fuzzy",
            });
            ommitedLettersBuffer = [];
        }
    }

    function addMatchedLettersAsInput() {
        if (matchedLettersBuffer.length > 0) {
            matchParts.push({
                content: matchedLettersBuffer.join(""),
                type: "input",
            });
            matchedLettersBuffer = [];
        }
    }

    for (let searchChar of searchValue) {
        const inputChar = remainingInputChars[0];

        // no more input - finish fuzzy matching
        if (inputChar === undefined) {
            break;
        }

        const isMatching = compareLetters(searchChar, inputChar, isCaseSesitive);

        // if input letter doesnt match - we'll go to the next letter to try again
        if (!isMatching) {
            // add this letter to buffer of ommited letters
            ommitedLettersBuffer.push(searchChar);
            // in case we had something in matched letters buffer - clear it as matching letters run ended
            addMatchedLettersAsInput();
            // go to the next input letter
            continue;
        }

        // we have input letter matching!

        // remove it from remaining input letters
        remainingInputChars.shift();

        // add it to matched letters buffer
        matchedLettersBuffer.push(searchChar);
        // in case we had something in ommited letters buffer - add it to the match now
        addOmmitedLettersAsFuzzy();

        // if there is no more letters in input - add this matched letter to match too
        if (!remainingInputChars.length) {
            addMatchedLettersAsInput();
        }
    }

    // if we still have letters left in input - means not all input was included in string to find - input was incorrect
    if (remainingInputChars.length > 0) {
        return 0;
    }

    // lets get entire matched part (from start to last letter of input)
    const matchedPart = matchParts.map((match) => match.content).join("");

    // get remaining part of string to be found
    const suggestionPart = searchValue.replace(matchedPart, "");

    // if we have remaining part - add it as suggestion
    if (suggestionPart) {
        matchParts.push({ content: suggestionPart, type: "suggestion" });
    }

    return calculateFuzzyMatchPartsScore(matchParts);
}
