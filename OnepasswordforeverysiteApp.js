/**
 * Created by Tim van Steenbergen on 21-1-2017.
 */
///<reference path="chrome/index.d.ts"/>
console.log('before DOMContentLoaded');
document.addEventListener('DOMContentLoaded', function () {
    // let sites = [];
    var json = {
        "sites": [
            new Site("gavelsnipe.com", "koud", "timvans", 1, 120, new Date("20160101"), ""),
            new Site("webassessor.com", "koud", "TimvanSteenbergen", 2, 120, new Date("20160101"), ""),
            new Site("stackoverflow.com", "koud", "tim@tieka.nl", 1, 120, new Date(new Date("20160101")), ""),
            new Site("quora.com", "koud", "tim@tieka.nl", 1, 75, new Date("20160101"), "Max 75 karakters in het wachtwoord"),
            new Site("robbshop.com", "koud", "tim@tieka.nl", 1, 120, new Date("20160101"), ""),
            new Site("lynda.com", "koud", "tim@tieka.nl", 1, 120, new Date("20160101"), ""),
            new Site("nrc.nl", "koud", "elma@tieka.nl", 1, 120, new Date("20160101"), ""),
            new Site("ebay.com", "heet", "tivansteenberge_0", 3, 64, new Date("20160101"), "Max 64 karakters in het wachtwoord"),
            new Site("ebay.nl", "heet", "tivansteenberge_0", 3, 64, new Date("20160101"), "Max 64 karakters in het wachtwoord"),
            new Site("yetanothersite.nl", "koud", "alias24", 1, 120, new Date("20160101"), ""),
            new Site("andonemore.nl", "koud", "myusernamehere", 1, 120, new Date("20160101"), "")
        ]
    };
    var sites = json.sites;
    localStorage.setItem("sites", JSON.stringify(json));
    showTheLocallyStoredData(5);
    setValueForElementDomain();
    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
            // chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
            var ourPopup = document;
            var domain = getDomain(tab.url);
            var domainElement = ourPopup.getElementById('OPFESinputDomain');
            domainElement.setAttribute('value', domain);
            setValueForElements(domain);
            function getDomain(url) {
                domain = url.match(/:\/\/(.[^/]+)/)[1];
                //remove the sub-domain(s)
                var numberOfDotsInDomain = (domain.match(/\./g) || []).length;
                for (var dot = 1; dot < numberOfDotsInDomain; dot++) {
                    domain = domain.substr(domain.indexOf('.') + 1, domain.length);
                }
                return domain;
            }
            function setValueForElements(domain) {
                json = JSON.parse(localStorage.getItem("sites"));
                sites = json.sites;
                for (var i = 0; i < sites.length; i++) {
                    var site = sites[i];
                    if (site._domain == domain) {
                        document.getElementById('inputDomain').setAttribute('disabled', "disabled");
                        if (site._salt != "") {
                            document.getElementById('inputSalt').setAttribute('value', site._salt);
                            document.getElementById('inputSalt').setAttribute('disabled', "disabled");
                        }
                        if (site._userId != "") {
                            document.getElementById('inputUserId').setAttribute('value', site._userId);
                            document.getElementById('inputUserId').setAttribute('disabled', "disabled");
                        }
                        if (site._userId != "") {
                            document.getElementById('inputSequenceNr').setAttribute('value', (site._sequenceNr + ""));
                            document.getElementById('inputSequenceNr').setAttribute('disabled', "disabled");
                        }
                        if (site._maxPwdChars != 120) {
                            // <HTMLSelectElement>(document.getElementById('selectMaxPwdChars')).setAttribute('value', <site._maxPwdChars);
                            document.getElementById('selectMaxPwdChars').setAttribute('disabled', "disabled");
                        }
                    }
                }
            }
        });
    }
    /**
     * This function retrieves the locally stored sites, changes the popup to:
     * - only show numOfLines of the sites
     * - show the "..." if some sites are not shown
     * @param numOfLines Number of lines to show in the popup.html
     */
    function showTheLocallyStoredData(numOfLines) {
        json = JSON.parse(localStorage.getItem("sites"));
        sites = json.sites;
        var dataTableHTML = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>maxPwdChars</td><td>used at</td></ts><td>remark</td></thead>";
        // sites.forEach((dataTableHTML: string, site: Site ): Site => {
        for (var i = 0; i < sites.length && i < numOfLines; i++) {
            var site = sites[i];
            dataTableHTML += '<tr><td>' + site._domain; //  getDomain() + '</td>';
            dataTableHTML += '<td>' + site._salt + '</td>';
            dataTableHTML += '<td>' + site._userId + '</td>';
            dataTableHTML += '<td>' + site._sequenceNr + '</td>';
            dataTableHTML += '<td>' + site._maxPwdChars + '</td>';
            dataTableHTML += '<td>' + site._lastUsed + '</td>';
            dataTableHTML += '<td>' + site._remark + '</td>';
            dataTableHTML += '<td>' + '</td></tr>';
        }
        if (sites.length > numOfLines) {
            document.getElementById('OPFESshowAllTheLocallyStoredData').setAttribute('style', "display: inline");
        }
        else {
            document.getElementById('OPFESshowAllTheLocallyStoredData').setAttribute('style', "display: none");
        }
        dataTableHTML += '</table>';
        document.getElementById('OPFESlocalyStoredUserData').innerHTML = dataTableHTML;
    }
    document.getElementById('OPFESshowAllTheLocallyStoredData').addEventListener('click', function () {
        showTheLocallyStoredData(100000);
    });
    function toggleChangability() {
        var elementId = this.id.substr(0, this.id.length - 6);
        var elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        }
        else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    }
    document.getElementById('OPFESinputDomainToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESinputSaltToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESinputUserIdToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESinputSequenceNrToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESselectMaxPwdCharsToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESinputAppPasswordShow').addEventListener('click', function () {
        var elementId = this.id.substr(0, this.id.length - 4);
        var elementToToggle = document.getElementById(elementId);
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('OPFESinputAppPasswordShow').setAttribute('disabled', 'disabled');
        document.getElementById('OPFESinputAppPasswordHide').removeAttribute('disabled');
    });
    document.getElementById('OPFESinputAppPasswordHide').addEventListener('click', function () {
        var elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('OPFESinputAppPasswordShow').removeAttribute('disabled');
        document.getElementById('OPFESinputAppPasswordHide').setAttribute('disabled', 'disabled');
    });
    /*
     * Upon clicking the loginButton, generate the password for this site, salt, uid, sequence and given password.
     */
    document.getElementById('OPFESloginButton').addEventListener('click', function () {
        var site = new Site;
        var ourPopup = document;
        site.setDomain(ourPopup.getElementById('OPFESinputDomain').value);
        site.setSalt(ourPopup.getElementById('OPFESinputSalt').value);
        site.setUserId(ourPopup.getElementById('OPFESinputUserId').value);
        site.setSequenceNr(+ourPopup.getElementById('OPFESinputSequenceNr').value);
        site.setMaxPwdChars(+ourPopup.getElementById('OPFESselectMaxPwdChars').value);
        var inputValueAppPassword = ourPopup.getElementById('OPFESinputAppPassword').value;
        //save the sites data every time the password gets generated
        // siteService.add(site)
        var siteUpserted = false;
        for (var i = 0; i < json.sites.length; i++) {
            if (json.sites[i][0] == site.getDomain()) {
                json.sites[i] = site;
                siteUpserted = true;
            }
        }
        if (!siteUpserted) {
            json.sites.push(site);
        }
        localStorage.setItem("sites", JSON.stringify(json));
        var siteService = new SiteService(sites);
        var sitePassword = siteService.getSitePassword(site, inputValueAppPassword);
        alert('The password for this site for this user-id is: ' + sitePassword);
        var passwordElement = ourPopup.getElementById('OPFESinputSitePassword');
        passwordElement.setAttribute("value", sitePassword);
        // Insert the pwdForThisSiteForThisUid in the password-input field in the document
        // insertPwd(pwdForThisSiteForThisUid, passwordElement);
    }, false);
}, false);
var Site = (function () {
    function Site(_domain, _salt, _userId, _sequenceNr, _maxPwdChars, _lastUsed, _remark) {
        if (_domain === void 0) { _domain = ""; }
        this._domain = _domain;
        this._salt = _salt;
        this._userId = _userId;
        this._sequenceNr = _sequenceNr;
        this._maxPwdChars = _maxPwdChars;
        this._lastUsed = _lastUsed;
        this._remark = _remark;
    }
    Site.prototype.getDomain = function () {
        return this._domain;
    };
    Site.prototype.setDomain = function (value) {
        this._domain = value;
    };
    Site.prototype.getSalt = function () {
        return this._salt;
    };
    Site.prototype.setSalt = function (value) {
        this._salt = value;
    };
    Site.prototype.getUserId = function () {
        return this._userId;
    };
    Site.prototype.setUserId = function (value) {
        this._userId = value;
    };
    Site.prototype.getSequenceNr = function () {
        return this._sequenceNr;
    };
    Site.prototype.setSequenceNr = function (value) {
        this._sequenceNr = value;
    };
    Site.prototype.getMaxPwdChars = function () {
        return this._maxPwdChars;
    };
    Site.prototype.setMaxPwdChars = function (value) {
        this._maxPwdChars = value;
    };
    Site.prototype.getLastUsed = function () {
        return this._lastUsed;
    };
    Site.prototype.setLastUsed = function (value) {
        this._lastUsed = value;
    };
    Site.prototype.getRemark = function () {
        return this._remark;
    };
    Site.prototype.setRemark = function (value) {
        this._remark = value;
    };
    return Site;
}());
function getTheLocallyStoredSites(numOfLines) {
    if (numOfLines === void 0) { numOfLines = 9999; }
    var json = JSON.parse(localStorage.getItem("sites"));
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
    ;
    SiteService.prototype.getByDomain = function (domain) {
        var site = new Site;
        getTheLocallyStoredSites();
        // site->setDomain()
        return site;
    };
    ;
    SiteService.prototype.getAll = function () {
        return getTheLocallyStoredSites();
    };
    ;
    /**
     * This function takes its parameters and returns a hashed password that:
     * - has length of 120 characters (unless you change the constant passwordLength)
     * - is made up of 64 different characters
     * - includes at least one: uppercase, lowercase, integer and special character
     * @param site: Site
     * @param appPassword: string
     * @returns {string}
     */
    SiteService.prototype.getSitePassword = function (site, appPassword) {
        var passwordLength = site._maxPwdChars; //Between 20 and 120
        //get the SHA512
        var stringToHash = site._domain + site._salt + site._userId + site._sequenceNr + appPassword;
        var generatedHash = SHA512(stringToHash);
        //Now we have got a hexadecimal hash. Let's create our own BASE-64 password character set and
        // transform the hex to that. There are 86 characters available in passwords:
        // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
        //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
        //op ebay.nl:  !@#$+*^~-
        // I choose to exclude these: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
        var lowerCaseCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s", "t", "u", "v", "w", "z"];
        var upperCaseCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "Z"];
        var numberCharacters = ["2", "3", "4", "5", "6", "8", "9"];
        var specialCharacters = ["'", "/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"];
        var passwordCharacters = lowerCaseCharacters.concat(upperCaseCharacters).concat(numberCharacters).concat(specialCharacters);
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
            var chosenUppercaseCharacter = upperCaseCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = chosenUppercaseCharacter + generatedPassword.substr(1, passwordLength - 1);
        }
        //Make sure there is at least one lowercase
        if ((/[a-z]/.test(generatedPassword)) === false) {
            var chosenLowercaseCharacter = lowerCaseCharacters[generatedHash.charCodeAt(3) % 19];
            var chosenPosition = generatedHash.charCodeAt(4) % 16 + 1; // = 1 to 16
            var firstPart = generatedPassword.substr(0, chosenPosition);
            var lastPart = generatedPassword.substr(chosenPosition + 1);
            generatedPassword = firstPart + chosenLowercaseCharacter + lastPart;
        }
        //Make sure there is at least one number
        if ((/[0-9]/.test(generatedPassword)) === false) {
            var chosenNumberCharacter = numberCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenNumberCharacter;
        }
        //Make sure there is at least one special character
        if ((/['/~@#%^()_+-=.:?!{}]/.test(generatedPassword)) === false) {
            var chosenSpecialCharacter = specialCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenSpecialCharacter;
        }
        return generatedPassword;
    };
    return SiteService;
}());
//# sourceMappingURL=OnepasswordforeverysiteApp.js.map