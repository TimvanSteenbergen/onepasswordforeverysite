/**
 * Created by Tim on 2017-03-26.
 */
//This function toggles the active div, including setting the active menu to active
function navbarItemClicked(showThisPage, me) {
    //Hide all contentblocks
    var contentRows = document.querySelectorAll('#contents>div.row>div');
    for (var i = 0; i < contentRows.length; i++) {
        contentRows[i].style.display = 'none';
    }
    //Show the clicked contentblock
    document.getElementById(showThisPage).style.display = 'block';
    //De-activate all navbar-items
    var navItems = document.querySelectorAll('nav .container #navbar ul.nav li');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].removeAttribute('class');
    }
    //And show the clicked navbaritem
    me.parentElement.setAttribute('class', 'active');
}
window.onload = function () {
    //Get your password here
    // The show button
    document.getElementById('OPFES_InputAppPasswordShow').addEventListener('click', function () {
        var elementId = this.id.substr(0, this.id.length - 4);
        var elementToToggle = document.getElementById(elementId);
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('OPFES_InputAppPasswordShow').setAttribute('disabled', 'disabled');
        document.getElementById('OPFES_InputAppPasswordHide').removeAttribute('disabled');
    });
    // The hide button
    document.getElementById('OPFES_InputAppPasswordHide').addEventListener('click', function () {
        var elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('OPFES_InputAppPasswordShow').removeAttribute('disabled');
        document.getElementById('OPFES_InputAppPasswordHide').setAttribute('disabled', 'disabled');
    });
    // The Generate Your Password button
    document.getElementById('OPFES_getPasswordHere').addEventListener('click', function () {
        var site = new Site(document.getElementById('OPFES_InputDomain').value, document.getElementById('OPFES_InputSalt').value, document.getElementById('OPFES_InputUserId').value, +document.getElementById('OPFES_InputSequenceNr').value, +document.getElementById('OPFES_SelectMaxPwdChars').value);
        var inputValueAppPassword = document.getElementById('OPFES_InputAppPassword').value;
        var sitePassword = SiteService.getSitePassword(site, inputValueAppPassword);
        window.prompt('The password for this site for this user-id is: ' + sitePassword + ' To copy the password to your clipboard: Ctrl+C, Enter', sitePassword);
        var passwordElement = document.getElementById('OPFES_InputSitePassword');
        passwordElement.setAttribute("value", sitePassword);
    });
    // Parse the dropzone-value to the other fields
    document.getElementById('OPFES_dropzone').addEventListener('change', function () {
        var dropzoneinput;
        var thisInput;
        thisInput = this.value.replace(/\s/g, '');
        dropzoneinput = thisInput.split(",");
        document.getElementById("OPFES_InputDomain").value = dropzoneinput[0];
        document.getElementById("OPFES_InputSalt").value = dropzoneinput[1];
        document.getElementById("OPFES_InputUserId").value = dropzoneinput[2];
        document.getElementById("OPFES_InputSequenceNr").value = dropzoneinput[3];
        document.getElementById("OPFES_SelectMaxPwdChars").value = dropzoneinput[4];
        document.getElementById("OPFES_InputAppPassword").focus();
    });
};
var Site = (function () {
    function Site(domain, salt, userId, sequenceNr, maxPwdChars, lastUsed, remark) {
        if (domain === void 0) { domain = ""; }
        this.domain = domain;
        this.salt = salt;
        this.userId = userId;
        this.sequenceNr = sequenceNr;
        this.maxPwdChars = maxPwdChars;
        this.lastUsed = lastUsed;
        this.remark = remark;
    }
    Site.prototype.getDomain = function () {
        return this.domain;
    };
    Site.prototype.setDomain = function (value) {
        this.domain = value;
    };
    Site.prototype.getSalt = function () {
        return this.salt;
    };
    Site.prototype.setSalt = function (value) {
        this.salt = value;
    };
    Site.prototype.getUserId = function () {
        return this.userId;
    };
    Site.prototype.setUserId = function (value) {
        this.userId = value;
    };
    Site.prototype.getSequenceNr = function () {
        return this.sequenceNr;
    };
    Site.prototype.setSequenceNr = function (value) {
        this.sequenceNr = value;
    };
    Site.prototype.getMaxPwdChars = function () {
        return this.maxPwdChars;
    };
    Site.prototype.setMaxPwdChars = function (value) {
        this.maxPwdChars = value;
    };
    Site.prototype.getLastUsed = function () {
        return this.lastUsed;
    };
    Site.prototype.setLastUsed = function (value) {
        this.lastUsed = value;
    };
    Site.prototype.getRemark = function () {
        return this.remark;
    };
    Site.prototype.setRemark = function (value) {
        this.remark = value;
    };
    return Site;
}());
function getTheLocallyStoredSites(numOfLines) {
    if (numOfLines === void 0) { numOfLines = 9999; }
    var json = JSON.parse(localStorage.getItem("OPFES_UserData"));
    var sites = json.sites;
    if (numOfLines == 9999) {
        return sites;
    }
    else {
        return sites.slice(0, numOfLines);
    }
}
var SiteService = (function () {
    function SiteService(sites) {
        var _this = this;
        if (sites) {
            sites.forEach(function (site) { return _this.add(site); });
        }
    }
    SiteService.prototype.add = function (site) {
        return true;
    };
    SiteService.prototype.getByDomain = function (domain) {
        var site = new Site;
        getTheLocallyStoredSites();
        // site->setDomain()
        return site;
    };
    SiteService.prototype.getAll = function () {
        return getTheLocallyStoredSites();
    };
    /**
     * This function takes its parameters and returns a hashed password that:
     * - has length of 120 characters (unless you change the constant passwordLength)
     * - is made up of 64 different characters
     * - includes at least one: uppercase, lowercase, integer and special character
     * @param site: Site
     * @param appPassword: string
     * @returns {string}
     */
    SiteService.getSitePassword = function (site, appPassword) {
        var passwordLength = site.getMaxPwdChars(); //Between 0 and 120
        //get the SHA512
        var stringToHash = site.getDomain() + site.getSalt() + site.getUserId() + site.getSequenceNr() + site.getMaxPwdChars() + appPassword;
        var generatedHash = SHA512(stringToHash);
        //Now we have got a hexadecimal hash. Let's create our own BASE-64 password character set and
        // transform the hex to that. There are 86 characters available in passwords:
        // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
        //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
        // I have choosen to exclude these: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
        var lowercaseCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s", "t", "u", "v", "w", "z"];
        var numOfLowerChars = lowercaseCharacters.length;
        var uppercaseCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "Z"];
        var numOfUpperChars = uppercaseCharacters.length;
        var numberCharacters = ["0", "2", "3", "4", "5", "6", "8", "9"];
        var numOfNumberChars = numberCharacters.length;
        var specialCharacters = ["/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"];
        var numOfSpecialChars = specialCharacters.length;
        var passwordCharacters = lowercaseCharacters.concat(uppercaseCharacters).concat(numberCharacters).concat(specialCharacters);
        var sumOfNums = numOfLowerChars + numOfUpperChars + numOfNumberChars + numOfSpecialChars;
        if (sumOfNums !== 64) {
            throw RangeError; //sumOfNums has to be 64 to generate our 64-base password.
        }
        var counterHash = 0;
        var generatedPassword = "";
        for (var counterPwd = 0; counterPwd < (passwordLength / 2); counterPwd++) {
            var nextHashPart = generatedHash.substr(counterHash, 3);
            var nextDecimal = parseInt(nextHashPart, 16);
            var secondChar = nextDecimal % 64;
            var firstChar = ((nextDecimal - secondChar) / 64);
            generatedPassword += passwordCharacters[firstChar];
            if ((counterPwd + 1) <= (passwordLength / 2)) {
                generatedPassword += passwordCharacters[secondChar];
            }
            counterHash = ((counterHash + 3) > 128) ? 1 : (counterHash + 3); //resetting counterHash to 1 (instead of 0) to get different nextHashParts the second time
        }
        //Make sure there are at least two uppercase characters
        var uppercaseCount = generatedPassword.length - generatedPassword.replace(/[A-Z]/g, '').length;
        if (uppercaseCount < 2) {
            //.. then replace the first two characters by two of the chosen 16 uppercaseCharacters
            var chosenUppercaseCharacter = uppercaseCharacters[generatedHash.charCodeAt(2) % numOfLowerChars];
            var chosenUppercaseCharacter2 = uppercaseCharacters[generatedHash.charCodeAt(3) % numOfLowerChars];
            generatedPassword = chosenUppercaseCharacter + chosenUppercaseCharacter2 + generatedPassword.substr(2, passwordLength - 2);
        }
        //Make sure there are at least two lowercase characters
        var lowercaseCount = generatedPassword.length - generatedPassword.replace(/[a-z]/g, '').length;
        if (lowercaseCount < 2) {
            //.. then replace one character by one of the chosen 16 lowercaseCharacters
            var chosenLowercaseCharacter = lowercaseCharacters[generatedHash.charCodeAt(2) % numOfUpperChars];
            var chosenLowercaseCharacter2 = lowercaseCharacters[generatedHash.charCodeAt(3) % numOfUpperChars];
            var chosenPosition = generatedHash.charCodeAt(4) % (passwordLength - 3) + 4; // will get a position in the range: 5 to 16
            var firstPart = generatedPassword.substr(0, chosenPosition);
            var lastPart = generatedPassword.substr(chosenPosition + 2);
            generatedPassword = firstPart + chosenLowercaseCharacter + chosenLowercaseCharacter2 + lastPart;
        }
        //Make sure there are at least two special characters
        var specialCharCount = generatedPassword.length - generatedPassword.replace(/[/~@#%^()_+-=.:?!{}]/g, '').length;
        if (specialCharCount < 2) {
            //.. then replace the second and third character by two of the chosen 18 specialCharacters
            var chosenSpecialCharacter = specialCharacters[generatedHash.charCodeAt(2) % numOfSpecialChars];
            var chosenSpecialCharacter2 = specialCharacters[generatedHash.charCodeAt(3) % numOfSpecialChars];
            var firstPart = generatedPassword.substr(0, 1);
            var lastPart = generatedPassword.substr(3, passwordLength - 3);
            generatedPassword = firstPart + chosenSpecialCharacter + chosenSpecialCharacter2 + lastPart;
        }
        //Make sure there are at least two numbers,
        var numberCount = generatedPassword.length - generatedPassword.replace(/[0-9]/g, '').length;
        if (numberCount < 2) {
            //.. then replace the last two characters by two of the chosen 7 numbers in numberCharacters
            var chosenNumberCharacter = numberCharacters[generatedHash.charCodeAt(2) % numOfNumberChars];
            var chosenNumberCharacter2 = numberCharacters[generatedHash.charCodeAt(3) % numOfNumberChars];
            generatedPassword = generatedPassword.substr(0, passwordLength - 2) + chosenNumberCharacter + chosenNumberCharacter2;
        }
        return generatedPassword;
    };
    return SiteService;
}());
