type MatchRoleType = 'input' | 'fuzzy' | 'suggestion';
interface FuzzyMatchPart {
    content: string;
    type: MatchRoleType;
}
interface FuzzyMatchData {
    parts: FuzzyMatchPart[];
    score: number;
}
interface FuzzyMatchOptions {
    truncateTooLongInput?: boolean;
    isCaseSesitive?: boolean;
}
declare function fuzzyString(input: string, stringToBeFound: string, { truncateTooLongInput, isCaseSesitive }?: FuzzyMatchOptions): FuzzyMatchData | false;

export { type FuzzyMatchData, type FuzzyMatchOptions, type FuzzyMatchPart, type MatchRoleType, fuzzyString };
