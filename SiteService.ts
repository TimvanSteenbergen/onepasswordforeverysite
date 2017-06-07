/**
 * Created by Tim on 11-2-2017.
 */

declare function SHA512(string): string;

interface ISiteService {
    add(site: Site): Boolean;
    getByDomain(domain: string): Site;
    getAll(): Site[];
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

class SiteService implements ISiteService{
    constructor(sites: Site[]) {
        if (sites) {
            sites.forEach(site => this.add(site))
        }
    }

    add(site: Site): Boolean {
        return true;
    }

    static persist (mySite: Site) : Boolean {
        // // let userData: UserData = JSON.parse(localStorage.getItem("OPFES_UserData"), UserData.reviver);
        // let sites: Site[] = SiteService.getAll();
        // for(let site of sites) {
        //     if (mySite.getDomain() === site.getDomain()) {
        //         site.setSequenceNr(mySite.getSequenceNr());
        //     }
        // }
        // userData.persist();
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
     * - includes at least two of each: uppercase, lowercase, integer and special character
     * @param site: Site
     * @param appPassword: string
     * @returns {string}
     */
    static getSitePassword(site: Site, appPassword: string): string {
        const passwordLength: number = site.getMaxPwdChars(); //Between 0 and 120

        //get the SHA512
        let stringToHash: string = site.getDomain() + site.getSalt() + site.getUserId() + site.getSequenceNr()
            + site.getMaxPwdChars() + appPassword;
        let generatedHash: string = SHA512(stringToHash);

        //Now we have got a hexadecimal hash. Let's create our own BASE-64 password character set and
        // transform the hex to that. There are 86 characters available in passwords:
        // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
        //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
        // I have choosen to exclude these: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
        const lowercaseCharacters: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s",
            "t", "u", "v", "w", "z"];
        const numOfLowerChars: number = lowercaseCharacters.length;
        const uppercaseCharacters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S",
            "T", "U", "V", "W", "Z"];
        const numOfUpperChars: number = uppercaseCharacters.length;
        const numberCharacters: string[] = ["0", "2", "3", "4", "5", "6", "8", "9"];
        const numOfNumberChars: number = numberCharacters.length;
        let allSpeCha: String = site.getAllowedSpecialCharacters();
        let allowedSpecialCharacters: string[] = [];
        if(typeof (allSpeCha) != 'undefined'){
            for (let i = 0; i <= 17; i++) {
                allowedSpecialCharacters[i]= site.getAllowedSpecialCharacters()[i%allSpeCha.length];
            }
        } else {
            allowedSpecialCharacters = ["/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"]; //The default value.
        }
        const numOfSpecialChars: number = allowedSpecialCharacters.length;
        const passwordCharacters: string[] = lowercaseCharacters
            .concat(uppercaseCharacters)
            .concat(numberCharacters)
            .concat(allowedSpecialCharacters);
        let sumOfNums: number = numOfLowerChars + numOfUpperChars + numOfNumberChars + numOfSpecialChars;
        if (sumOfNums !== 64) {
            throw RangeError; //sumOfNums has to be 64 to generate our 64-base password.
        }
        let counterHash: number = 0;
        let generatedPassword: string = "";
        for (let counterPwd = 0; counterPwd < (passwordLength / 2); counterPwd++) {
            let nextHashPart: string = generatedHash.substr(counterHash, 3);
            let nextDecimal: number = parseInt(nextHashPart, 16);
            let secondChar: number = nextDecimal % 64;
            let firstChar: number = ((nextDecimal - secondChar) / 64);
            generatedPassword += passwordCharacters[firstChar];
            if ((counterPwd + 1) <= (passwordLength / 2)) {
                generatedPassword += passwordCharacters[secondChar];
            }
            counterHash = ((counterHash + 3) > 128) ? 1 : (counterHash + 3);//resetting counterHash to 1 (instead of 0) to get different nextHashParts the second time
        }

        //Make sure there are at least two uppercase characters.
        let uppercaseCount = generatedPassword.length - generatedPassword.replace(/[A-Z]/g, '').length;
        if (uppercaseCount < 2) {//If there are only 0 or 1 uppercase characters in the generated password..
            //.. then replace the first two characters by two of the chosen 16 uppercaseCharacters
            let chosenUppercaseCharacter: string = uppercaseCharacters[generatedHash.charCodeAt(2) % numOfLowerChars];
            let chosenUppercaseCharacter2: string = uppercaseCharacters[generatedHash.charCodeAt(3) % numOfLowerChars];
            generatedPassword = chosenUppercaseCharacter + chosenUppercaseCharacter2 + generatedPassword.substr(2, passwordLength - 2);
        }

        //Make sure there are at least two lowercase characters
        let lowercaseCount = generatedPassword.length - generatedPassword.replace(/[a-z]/g, '').length;
        if (lowercaseCount < 2) {//If there is not yet two or more lowercase characters in the generated password..
            //.. then replace one character by one of the chosen 16 lowercaseCharacters
            let chosenLowercaseCharacter: string = lowercaseCharacters[generatedHash.charCodeAt(2) % numOfUpperChars];
            let chosenLowercaseCharacter2: string = lowercaseCharacters[generatedHash.charCodeAt(3) % numOfUpperChars];
            let chosenPosition: number = generatedHash.charCodeAt(4) % (passwordLength - 3) + 4; // will get a position in the range: 5 to 16
            let firstPart: string = generatedPassword.substr(0, chosenPosition);
            let lastPart: string = generatedPassword.substr(chosenPosition + 2);
            generatedPassword = firstPart + chosenLowercaseCharacter + chosenLowercaseCharacter2 + lastPart;
        }

        //Make sure there are at least two special characters
        let specialCharCount = generatedPassword.length - generatedPassword.replace(/[/~@#%^()_+-=.:?!{}]/g, '').length;
        if (specialCharCount < 2) {//If there is not yet two or more special characters in the generated password..
            //.. then replace the second and third character by two of the chosen 18 specialCharacters
            let chosenSpecialCharacter: string = allowedSpecialCharacters[generatedHash.charCodeAt(2) % numOfSpecialChars];
            let chosenSpecialCharacter2: string = allowedSpecialCharacters[generatedHash.charCodeAt(3) % numOfSpecialChars];
            let firstPart: string = generatedPassword.substr(0, 1);
            let lastPart: string = generatedPassword.substr(3, passwordLength - 3);
            generatedPassword = firstPart + chosenSpecialCharacter + chosenSpecialCharacter2 + lastPart;
        }

        //Make sure there are at least two numbers,
        let numberCount = generatedPassword.length - generatedPassword.replace(/[0-9]/g, '').length;
        if (numberCount < 2) {//If there is not yet two or more numbers in the generated password..
            //.. then replace the last two characters by two of the chosen 7 numbers in numberCharacters
            let chosenNumberCharacter: string = numberCharacters[generatedHash.charCodeAt(2) % numOfNumberChars];
            let chosenNumberCharacter2: string = numberCharacters[generatedHash.charCodeAt(3) % numOfNumberChars];
            generatedPassword = generatedPassword.substr(0, passwordLength - 2) + chosenNumberCharacter + chosenNumberCharacter2;
        }

        return generatedPassword;
    }

    /**
     *
     * @param domainParts
     * @returns {boolean}
     * @see stackoverflow.com/questions/569137
     */
    static isSecondLevelDomainPresent(domainParts) {
        /* These are TLDs that have an SLD */
        let tlds = {
            "cy":true,
            "ro":true,
            "ke":true,
            "kh":true,
            "ki":true,
            "cr":true,
            "km":true,
            "kn":true,
            "kr":true,
            "ck":true,
            "cn":true,
            "kw":true,
            "rs":true,
            "ca":true,
            "kz":true,
            "rw":true,
            "ru":true,
            "za":true,
            "zm":true,
            "bz":true,
            "je":true,
            "uy":true,
            "bs":true,
            "br":true,
            "jo":true,
            "us":true,
            "bh":true,
            "bo":true,
            "bn":true,
            "bb":true,
            "ba":true,
            "ua":true,
            "eg":true,
            "ec":true,
            "et":true,
            "er":true,
            "es":true,
            "pl":true,
            // "in":true, see www.amazon.it
            "ph":true,
            "il":true,
            "pe":true,
            "co":true,
            "pa":true,
            "id":true,
            "py":true,
            "ug":true,
            "ky":true,
            "ir":true,
            "pt":true,
            "pw":true,
            "iq":true,
            // "it":true, see www.amazon.it
            "pr":true,
            "sh":true,
            "sl":true,
            "sn":true,
            "sa":true,
            "sb":true,
            "sc":true,
            "sd":true,
            "se":true,
            "hk":true,
            "sg":true,
            "sy":true,
            "sz":true,
            "st":true,
            "sv":true,
            "om":true,
            "th":true,
            "ve":true,
            "tz":true,
            "vn":true,
            "vi":true,
            "pk":true,
            "fk":true,
            "fj":true,
            "fr":true,
            "ni":true,
            "ng":true,
            "nf":true,
            "re":true,
            "na":true,
            "qa":true,
            "tw":true,
            "nr":true,
            "np":true,
            "ac":true,
            "af":true,
            "ae":true,
            "ao":true,
            "al":true,
            "yu":true,
            "ar":true,
            "tj":true,
            "at":true,
            "au":true,
            "ye":true,
            "mv":true,
            "mw":true,
            "mt":true,
            "mu":true,
            "tr":true,
            "mz":true,
            "tt":true,
            "mx":true,
            "my":true,
            "mg":true,
            "me":true,
            "mc":true,
            "ma":true,
            "mn":true,
            "mo":true,
            "ml":true,
            "mk":true,
            "do":true,
            "dz":true,
            "ps":true,
            "lr":true,
            "tn":true,
            "lv":true,
            "ly":true,
            "lb":true,
            "lk":true,
            "gg":true,
            "uk":true,
            "gn":true,
            "gh":true,
            "gt":true,
            "gu":true,
            "jp":true,
            "gr":true,
            "nz":true
        };

        return typeof tlds[domainParts[domainParts.length - 1]] != "undefined";
    }
    /**
     * This function will abstract the domain-part from the url
     * @param url an Location.href-type, http://xxx.yyy.zzz/something
     * @returns {string}
     */
    static getDomain(url: string)
//This function gets the domainname from the url, which needs to be an Location.href-type.
//Can't use "window.location.host" because this will return the domain of the OnePasswordForEverySiteApp.html
//@todo: solve issue #27, www.amazon.co.uk -> now co.uk instead of amazon.co.uk
    {   let domain = url.match(/:\/\/(.[^/]+)/)[1];
        let domainParts = domain.split(".");
        let cutOff: number = 2;
        if (SiteService.isSecondLevelDomainPresent(domainParts)) {
            cutOff=3;
        }
        return domainParts.slice(domainParts.length-cutOff, domainParts.length).join(".");
    }
}
