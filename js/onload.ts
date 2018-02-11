/**
 * Created by Tim on 2017-03-26.
 */

//This function toggles the active div, including setting the active menu to active
function navbarItemClicked(showThisPage, me) {
    //Hide all contentblocks
    let contentRows = document.querySelectorAll('#contents>div.row>div');
    for (let i = 0; i < contentRows.length; i++) {
        (<HTMLDivElement>contentRows[i]).style.display = 'none';
    }
    //Show the clicked contentblock
    document.getElementById(showThisPage).style.display = 'block';

    //De-activate all navbar-items
    let navItems = document.querySelectorAll('nav .container #navbar ul.nav li');
    for (let i = 0; i < navItems.length; i++) {
        (<HTMLDivElement>navItems[i]).removeAttribute('class');
    }
    //And show the clicked navbaritem
    (<HTMLLIElement>me.parentElement).setAttribute('class', 'active');
}

window.onload = function () {
    //Get your password here
    // The show button
    document.getElementById('OPFES_InputAppPasswordShow').addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 4);
        let elementToToggle = document.getElementById(elementId);
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('OPFES_InputAppPasswordShow').setAttribute('disabled', 'disabled');
        document.getElementById('OPFES_InputAppPasswordHide').removeAttribute('disabled');
    });
    // The hide button
    document.getElementById('OPFES_InputAppPasswordHide').addEventListener('click', function () {
        let elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('OPFES_InputAppPasswordShow').removeAttribute('disabled');
        document.getElementById('OPFES_InputAppPasswordHide').setAttribute('disabled', 'disabled');
    });
    // The Generate Your Password button
    document.getElementById('OPFES_getPasswordHere').addEventListener('click', function () {
        let site: Site = new Site(
            (<HTMLInputElement>document.getElementById('OPFES_InputDomain')).value,
            (<HTMLInputElement>document.getElementById('OPFES_InputSalt')).value,
            (<HTMLInputElement>document.getElementById('OPFES_InputUserId')).value,
            +(<HTMLInputElement>document.getElementById('OPFES_InputSequenceNr')).value,
            +(<HTMLSelectElement>document.getElementById('OPFES_SelectMaxPwdChars')).value
        );
        let inputValueAppPassword = (<HTMLInputElement>document.getElementById('OPFES_InputAppPassword')).value;
        let sitePassword = SiteService.getSitePassword(site, inputValueAppPassword);
        window.prompt('The password for this site for this user-id is: ' + sitePassword + ' To copy the password to your clipboard: Ctrl+C, Enter', sitePassword);
        let passwordElement = document.getElementById('OPFES_InputSitePassword');
        passwordElement.setAttribute("value", sitePassword);
    });
    // Parse the dropzone-value to the other fields
    document.getElementById('OPFES_dropzone').addEventListener('change', function () {
        let dropzoneinput: String[];
        let thisInput: String;
        thisInput = (<HTMLInputElement>this).value.replace(/\s/g, '');
        dropzoneinput = thisInput.split(",");
        (<HTMLInputElement>document.getElementById("OPFES_InputDomain")).value = <string>dropzoneinput[0];
        (<HTMLInputElement>document.getElementById("OPFES_InputSalt")).value = <string>dropzoneinput[1];
        (<HTMLInputElement>document.getElementById("OPFES_InputUserId")).value = <string>dropzoneinput[2];
        (<HTMLInputElement>document.getElementById("OPFES_InputSequenceNr")).value = <string>dropzoneinput[3];
        (<HTMLSelectElement>document.getElementById("OPFES_SelectMaxPwdChars")).value = <string>dropzoneinput[4];
        document.getElementById("OPFES_InputAppPassword").focus();
    });    
};
/* Copied from Site.js */
interface ISite {
    getDomain();      setDomain(value: string);
    getSalt();        setSalt(value: string);
    getUserId();      setUserId(value: string);
    getSequenceNr();  setSequenceNr(value: number);
    getMaxPwdChars(); setMaxPwdChars(value: number);
    getLastUsed();    setLastUsed(value: Date);
    getRemark();      setRemark(value: string);
}

class Site implements ISite {
    constructor(private domain: string = "",
                private salt?: string,
                private userId?: string,
                private sequenceNr?: number,
                private maxPwdChars?: number,
                private lastUsed?: Date,
                private remark?: string) {
    }

    public getDomain(): string {
        return this.domain;
    }

    public setDomain(value: string) {
        this.domain = value;
    }

    public getSalt(): string {
        return this.salt;
    }

    public setSalt(value: string) {
        this.salt = value;
    }

    public getUserId(): string {
        return this.userId;
    }

    public setUserId(value: string) {
        this.userId = value;
    }

    public getSequenceNr(): number {
        return this.sequenceNr;
    }

    public setSequenceNr(value: number) {
        this.sequenceNr = value;
    }

    public getMaxPwdChars(): number {
        return this.maxPwdChars;
    }

    public setMaxPwdChars(value: number) {
        this.maxPwdChars = value;
    }

    public getLastUsed(): Date {
        return this.lastUsed;
    }

    public setLastUsed(value: Date) {
        this.lastUsed = value;
    }

    public getRemark(): string {
        return this.remark;
    }

    public setRemark(value: string) {
        this.remark = value;
    }
}
/* Copied from SiteService.js */
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
    static getSitePassword(site: Site, appPassword: string): string {
        const passwordLength: number = site.getMaxPwdChars(); //Between 0 and 120

        //get the SHA512
        let stringToHash: string = site.getDomain() + site.getSalt() + site.getUserId() + site.getSequenceNr() + site.getMaxPwdChars() + appPassword;
        let generatedHash: string = SHA512(stringToHash);

        //Now we have got a hexadecimal hash. Let's create our own BASE-64 password character set and
        // transform the hex to that. There are 86 characters available in passwords:
        // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
        //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
        // I have choosen to exclude these: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
        const lowercaseCharacters: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s", "t", "u", "v", "w", "z"];
        const numOfLowerChars: number = lowercaseCharacters.length;
        const uppercaseCharacters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "Z"];
        const numOfUpperChars: number = uppercaseCharacters.length;
        const numberCharacters: string[] = ["0", "2", "3", "4", "5", "6", "8", "9"];
        const numOfNumberChars: number = numberCharacters.length;
        const specialCharacters: string[] = ["/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"];
        const numOfSpecialChars: number = specialCharacters.length;
        const passwordCharacters: string[] = lowercaseCharacters.concat(uppercaseCharacters).concat(numberCharacters).concat(specialCharacters);
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

        //Make sure there are at least two uppercase characters
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
            let chosenSpecialCharacter: string = specialCharacters[generatedHash.charCodeAt(2) % numOfSpecialChars];
            let chosenSpecialCharacter2: string = specialCharacters[generatedHash.charCodeAt(3) % numOfSpecialChars];
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
}