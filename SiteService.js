/**
 * Created by Tim on 11-2-2017.
 */
function getTheLocallyStoredSites(numOfLines = 9999) {
    let json = JSON.parse(localStorage.getItem("OPFES_UserData"));
    let sites = json.sites;
    if (numOfLines == 9999) {
        return sites;
    }
    else {
        return sites.slice(0, numOfLines);
    }
}
class SiteService {
    constructor(sites) {
        if (sites) {
            sites.forEach(site => this.add(site));
        }
    }
    add(site) {
        return true;
    }
    getByDomain(domain) {
        let site = new Site;
        getTheLocallyStoredSites();
        // site->setDomain()
        return site;
    }
    getAll() {
        return getTheLocallyStoredSites();
    }
    /**
     * This function takes its parameters and returns a hashed password that:
     * - has length of 120 characters (unless you change the constant passwordLength)
     * - is made up of 64 different characters
     * - includes at least one: uppercase, lowercase, integer and special character
     * @param site: Site
     * @param appPassword: string
     * @returns {string}
     */
    static getSitePassword(site, appPassword) {
        const passwordLength = site.getMaxPwdChars(); //Between 0 and 120
        //get the SHA512
        let stringToHash = site.getDomain() + site.getSalt() + site.getUserId() + site.getSequenceNr() + site.getMaxPwdChars() + appPassword;
        let generatedHash = SHA512(stringToHash);
        //Now we have got a hexadecimal hash. Let's create our own BASE-64 password character set and
        // transform the hex to that. There are 86 characters available in passwords:
        // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
        //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
        // I have choosen to exclude these: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
        const lowercaseCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s", "t", "u", "v", "w", "z"];
        const numOfLowerChars = lowercaseCharacters.length;
        const uppercaseCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "Z"];
        const numOfUpperChars = uppercaseCharacters.length;
        const numberCharacters = ["0", "2", "3", "4", "5", "6", "8", "9"];
        const numOfNumberChars = numberCharacters.length;
        const specialCharacters = ["/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"];
        const numOfSpecialChars = specialCharacters.length;
        const passwordCharacters = lowercaseCharacters.concat(uppercaseCharacters).concat(numberCharacters).concat(specialCharacters);
        let sumOfNums = numOfLowerChars + numOfUpperChars + numOfNumberChars + numOfSpecialChars;
        if (sumOfNums !== 64) {
            throw RangeError; //sumOfNums has to be 64 to generate our 64-base password.
        }
        let counterHash = 0;
        let generatedPassword = "";
        for (let counterPwd = 0; counterPwd < (passwordLength / 2); counterPwd++) {
            let nextHashPart = generatedHash.substr(counterHash, 3);
            let nextDecimal = parseInt(nextHashPart, 16);
            let secondChar = nextDecimal % 64;
            let firstChar = ((nextDecimal - secondChar) / 64);
            generatedPassword += passwordCharacters[firstChar];
            if ((counterPwd + 1) <= (passwordLength / 2)) {
                generatedPassword += passwordCharacters[secondChar];
            }
            counterHash = ((counterHash + 3) > 128) ? 1 : (counterHash + 3); //resetting counterHash to 1 (instead of 0) to get different nextHashParts the second time
        }
        generatedPassword = ',.!@#$%^&*(),.!@#$%^&*(),.!@#$%^&*()';
        //Make sure there are at least two uppercase characters
        let uppercaseCount = generatedPassword.length - generatedPassword.replace(/[A-Z]/g, '').length;
        if (uppercaseCount < 2) {
            //.. then replace the first two characters by two of the chosen 16 uppercaseCharacters
            let chosenUppercaseCharacter = uppercaseCharacters[generatedHash.charCodeAt(2) % numOfLowerChars];
            let chosenUppercaseCharacter2 = uppercaseCharacters[generatedHash.charCodeAt(3) % numOfLowerChars];
            generatedPassword = chosenUppercaseCharacter + chosenUppercaseCharacter2 + generatedPassword.substr(2, passwordLength - 2);
        }
        //Make sure there are at least two lowercase characters
        let lowercaseCount = generatedPassword.length - generatedPassword.replace(/[a-z]/g, '').length;
        if (lowercaseCount < 2) {
            //.. then replace one character by one of the chosen 16 lowercaseCharacters
            let chosenLowercaseCharacter = lowercaseCharacters[generatedHash.charCodeAt(2) % numOfUpperChars];
            let chosenLowercaseCharacter2 = lowercaseCharacters[generatedHash.charCodeAt(3) % numOfUpperChars];
            let chosenPosition = generatedHash.charCodeAt(4) % (passwordLength - 3) + 4; // will get a position in the range: 5 to 16
            let firstPart = generatedPassword.substr(0, chosenPosition);
            let lastPart = generatedPassword.substr(chosenPosition + 2);
            generatedPassword = firstPart + chosenLowercaseCharacter + chosenLowercaseCharacter2 + lastPart;
        }
        //Make sure there are at least two special characters
        let specialCharCount = generatedPassword.length - generatedPassword.replace(/[/~@#%^()_+-=.:?!{}]/g, '').length;
        if (specialCharCount < 2) {
            //.. then replace the second and third character by two of the chosen 18 specialCharacters
            let chosenSpecialCharacter = specialCharacters[generatedHash.charCodeAt(2) % numOfSpecialChars];
            let chosenSpecialCharacter2 = specialCharacters[generatedHash.charCodeAt(3) % numOfSpecialChars];
            let firstPart = generatedPassword.substr(0, 1);
            let lastPart = generatedPassword.substr(3, passwordLength - 3);
            generatedPassword = firstPart + chosenSpecialCharacter + chosenSpecialCharacter2 + lastPart;
        }
        //Make sure there are at least two numbers,
        let numberCount = generatedPassword.length - generatedPassword.replace(/[0-9]/g, '').length;
        if (numberCount < 2) {
            //.. then replace the last two characters by two of the chosen 7 numbers in numberCharacters
            let chosenNumberCharacter = numberCharacters[generatedHash.charCodeAt(2) % numOfNumberChars];
            let chosenNumberCharacter2 = numberCharacters[generatedHash.charCodeAt(3) % numOfNumberChars];
            generatedPassword = generatedPassword.substr(0, passwordLength - 2) + chosenNumberCharacter + chosenNumberCharacter2;
        }
        return generatedPassword;
    }
    /**
     * This function will abstract the domain-part from the url
     * @param url an Location.href-type, http://xxx.yyy.zzz/something
     * @returns {string}
     */
    static getDomain(url) {
        let domain = url.match(/:\/\/(.[^/]+)/)[1];
        //remove the sub-domain(s)
        let numberOfDotsInDomain = (domain.match(/\./g) || []).length;
        for (let dot = 1; dot < numberOfDotsInDomain; dot++) {
            domain = domain.substr(domain.indexOf('.') + 1, domain.length);
        }
        return domain;
    }
}
//# sourceMappingURL=SiteService.js.map