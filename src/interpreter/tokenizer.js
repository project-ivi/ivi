const tokens = {
    name: /[a-zA-Z_][\w]*/,
    assign: /=/,
    whitespace: /\s*/,
    openParen: /\(/,
    closeParen: /\)/,
    reservedWord: /new/,
    dot: /\./
}

const tokenize = function(string) {
    const output = []

    let previousMatches = []
    for (let i = 0; i < string.length; i++) {
        const curString = string.substring(0, i + 1);

        // get all tokens that this the current substring matches
        const currentMatches = []
        Object.keys(tokens).forEach(key => {
            const regexMatches = curString.match(tokens[key]);
            if (regexMatches && regexMatches.includes(curString)) {
                currentMatches.push(key)
            }
        });

        // when we encounter a character that matches no tokens, we've likely just finished a token
        if (currentMatches.length === 0) {

            // check for a perfect match
            if (previousMatches.length === 1) {
                string = string.substring(i, string.length)
                output.push([previousMatches[0], curString.substring(0, curString.length - 1)])
                i = -1; // go back to the beginning

            // names and reserved words will overlap, give precedence to reserved words
            } else if (previousMatches.includes('reservedWord')){
                string = string.substring(i, string.length)
                output.push(['reservedWord', curString.substring(0, curString.length - 1)])
                i = -1; // go back to the beginning

            // if the statement is ambiguous, fail.
            } else {
                return "Invalid token!"
            }

        // when we reach the end of the string, check if we have a valid token
        } else if (i === string.length - 1) {
            if (currentMatches.length === 1) {
                output.push([currentMatches[0], curString])
            } else if (currentMatches.includes('reservedWord')) {
                output.push(['reservedWord', curString])
            } else {
                return "Invalid token!"
            }
        }
        
        previousMatches = currentMatches
    }

    return output
}
