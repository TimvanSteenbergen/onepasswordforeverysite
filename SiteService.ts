/**
 * Created by Tim on 11-2-2017.
 */

declare function SHA512(string): string;

interface ISiteService {
    add(site: Site): Boolean;
    getByDomain(domain: string): Site;
    getAll(): Site[];
    getSitePassword(site: Site,
                    pwdUser: string): string;
}

function getTheLocallyStoredSites(numOfLines: number = 9999): Site[] {
    let json = JSON.parse(localStorage.getItem("OPFES_UserData"));
    let sites = json.sites;
    if (numOfLines == 9999) {
        return sites;
    } else {
        return sites.slice(0, numOfLines);
    }
}

class SiteService implements ISiteService {
    constructor(sites: Site[]) {
        if (sites) {
            sites.forEach(site => this.add(site))
        }
    }

    add(site: Site): Boolean {
        return true;
    }

    getByDomain(domain: string): Site {
        let site: Site = new Site;
        getTheLocallyStoredSites();
        // site->setDomain()
        return site;
    }

    getAll(): Site[] {
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
    getSitePassword(site: Site, appPassword: string): string {
        const passwordLength: number = site.getMaxPwdChars(); //Between 20 and 120

        //get the SHA512
        let stringToHash: string = site.getDomain() + site.getSalt() + site.getUserId() + site.getSequenceNr() + appPassword;
        let generatedHash: string = SHA512(stringToHash);

        //Now we have got a hexadecimal hash. Let's create our own BASE-64 password character set and
        // transform the hex to that. There are 86 characters available in passwords:
        // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
        //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
        //op ebay.nl:  !@#$+*^~-
        // I choose to exclude these: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
        const lowercaseCharacters: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s", "t", "u", "v", "w", "z"];
        const uppercaseCharacters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "Z"];
        const numberCharacters: string[] = ["2", "3", "4", "5", "6", "8", "9"];
        const specialCharacters: string[] = ["'", "/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"];
        const passwordCharacters: string[] = lowercaseCharacters.concat(uppercaseCharacters).concat(numberCharacters).concat(specialCharacters);
        let counterHash: number = 0;
        let generatedPassword: string = "";
        for (let counterPwd = 0; counterPwd < (passwordLength / 2); counterPwd++) {
            let nextHashPart: string = generatedHash.substr(counterHash, 3);
            let nextDecimal: number = parseInt(nextHashPart, 16);
            let secondChar: number = nextDecimal % 64;
            let firstChar: number = ((nextDecimal - secondChar) / 64);
            generatedPassword += passwordCharacters[firstChar] + passwordCharacters[secondChar];
            counterHash = ((counterHash + 3) > 128) ? 1 : (counterHash + 3);//resetting counterHash to 1 (instead of 0) to get different nextHashParts the second time
        }

        //Make sure there is at least one uppercase
        if ((/[A-Z]/.test(generatedPassword)) === false) {//If there is not yet a uppercase in the generated password..
            //.. then replace the first character by one of the chosen 16 uppercaseCharacters
            let chosenUppercaseCharacter: string = uppercaseCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = chosenUppercaseCharacter + generatedPassword.substr(1, passwordLength - 1);
        }

        //Make sure there is at least one lowercase
        if ((/[a-z]/.test(generatedPassword)) === false) {//If there is not yet a lowercase in the generated password..
            //.. then replace one character by one of the chosen 16 lowercaseCharacters
            let chosenLowercaseCharacter: string = lowercaseCharacters[generatedHash.charCodeAt(3) % 19];
            let chosenPosition: number = generatedHash.charCodeAt(4) % (passwordLength - 3) + 2; // will get a position in the range: 3 to 16
            let firstPart: string = generatedPassword.substr(0, chosenPosition);
            let lastPart: string = generatedPassword.substr(chosenPosition + 1);
            generatedPassword = firstPart + chosenLowercaseCharacter + lastPart;
        }

        //Make sure there is at least one number,
        if ((/[0-9]/.test(generatedPassword)) === false) {//If there is not yet a number in the generated password..
            //.. then replace the last character by one of the chosen 7 numbers in numberCharacters
            let chosenNumberCharacter: string = numberCharacters[generatedHash.charCodeAt(3) % 7];
            generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenNumberCharacter;
        }

        //Make sure there is at least one special character
        if ((/['/~@#%^()_+-=.:?!{}]/.test(generatedPassword)) === false) {//If there is not yet a special character in the generated password..
            //.. then replace the second character by one of the chosen 19 specialCharacters
            let chosenSpecialCharacter: string = specialCharacters[generatedHash.charCodeAt(3) % 19];
            let firstPart: string = generatedPassword.substr(0, 1);
            let lastPart: string = generatedPassword.substr(2, passwordLength - 2);
            generatedPassword = firstPart + chosenSpecialCharacter + lastPart;
        }

        return generatedPassword;
    }
}