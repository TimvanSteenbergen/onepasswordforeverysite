/**
 * Created by Tim on 11-2-2017.
 */
/**
 * This function takes its parameters and returns a hashed password that:
 * - has length of 120 characters (unless you change the constant passwordLength)
 * - is made up of 64 different characters
 * - includes at least one: uppercase, lowercase, integer and special character
 *
 * @constructor
 */
function OPFES_GenerateAndShowPassword() {
    var domain = document.getElementById('OPFES_InputDomain').value;
    var salt = document.getElementById('OPFES_InputSalt').value;
    var userId = document.getElementById('OPFES_InputUserId').value;
    var sequenceNr = +document.getElementById('OPFES_InputSequenceNr').value;
    var maxPwdChars = +document.getElementById('OPFES_SelectMaxPwdChars').value;
    var appPassword = document.getElementById('OPFES_InputAppPassword').value;
    var passwordLength = maxPwdChars; //Between 0 and 120
    //get the SHA512
    var stringToHash = domain + salt + userId + sequenceNr + appPassword;
    var generatedHash = SHA512(stringToHash);
    //Now we have got a hexadecimal hash. Let's create our own BASE-64 password character set and
    // transform the hex to that. There are 86 characters available in passwords:
    // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
    //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
    //op ebay.nl:  !@#$+*^~-
    // I choose to exclude these: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
    var lowercaseCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s", "t", "u", "v", "w", "z"];
    var uppercaseCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "Z"];
    var numberCharacters = ["2", "3", "4", "5", "6", "8", "9"];
    var specialCharacters = ["'", "/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"];
    var passwordCharacters = lowercaseCharacters.concat(uppercaseCharacters).concat(numberCharacters).concat(specialCharacters);
    var counterHash = 0;
    var generatedPassword = "";
    for (var counterPwd = 0; counterPwd < (passwordLength / 2); counterPwd++) {
        var nextHashPart = generatedHash.substr(counterHash, 3);
        var nextDecimal = parseInt(nextHashPart, 16);
        var secondChar = nextDecimal % 64;
        var firstChar = ((nextDecimal - secondChar) / 64);
        generatedPassword += passwordCharacters[firstChar] + passwordCharacters[secondChar];
        counterHash = ((counterHash + 3) > 128) ? 1 : (counterHash + 3); //resetting counterHash to 1 (instead of 0) to get different nextHashParts the second time
    }
    //Make sure there is at least one uppercase
    if ((/[A-Z]/.test(generatedPassword)) === false) {
        //.. then replace the first character by one of the chosen 16 uppercaseCharacters
        var chosenUppercaseCharacter = uppercaseCharacters[generatedHash.charCodeAt(3) % 19];
        generatedPassword = chosenUppercaseCharacter + generatedPassword.substr(1, passwordLength - 1);
    }
    //Make sure there is at least one lowercase
    if ((/[a-z]/.test(generatedPassword)) === false) {
        //.. then replace one character by one of the chosen 16 lowercaseCharacters
        var chosenLowercaseCharacter = lowercaseCharacters[generatedHash.charCodeAt(3) % 19];
        var chosenPosition = generatedHash.charCodeAt(4) % (passwordLength - 3) + 2; // will get a position in the range: 3 to 16
        var firstPart = generatedPassword.substr(0, chosenPosition);
        var lastPart = generatedPassword.substr(chosenPosition + 1);
        generatedPassword = firstPart + chosenLowercaseCharacter + lastPart;
    }
    //Make sure there is at least one number,
    if ((/[0-9]/.test(generatedPassword)) === false) {
        //.. then replace the last character by one of the chosen 7 numbers in numberCharacters
        var chosenNumberCharacter = numberCharacters[generatedHash.charCodeAt(3) % 7];
        generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenNumberCharacter;
    }
    //Make sure there is at least one special character
    if ((/['/~@#%^()_+-=.:?!{}]/.test(generatedPassword)) === false) {
        //.. then replace the second character by one of the chosen 19 specialCharacters
        var chosenSpecialCharacter = specialCharacters[generatedHash.charCodeAt(3) % 19];
        var firstPart = generatedPassword.substr(0, 1);
        var lastPart = generatedPassword.substr(2, passwordLength - 2);
        generatedPassword = firstPart + chosenSpecialCharacter + lastPart;
    }
    document.getElementById('OPFES_InputSitePassword').value = generatedPassword;
}
