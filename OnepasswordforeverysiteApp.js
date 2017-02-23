/**
 * Created by Tim van Steenbergen on 21-1-2017.
 */
///<reference path="chrome/index.d.ts"/>
console.log('before DOMContentLoaded');
document.addEventListener('DOMContentLoaded', function () {
    let json = {
        "sites": [
            new Site("gavelsnipe.com", "koud", "timvans", 1, 120, new Date("20160101"), ""),
            new Site("mycloud.com", "hout", "tim@tieka.nl", 1, 30, new Date("20170218"), ""),
            new Site("webassessor.com", "koud", "TimvanSteenbergen", 2, 120, new Date("20160101"), ""),
            new Site("stackoverflow.com", "koud", "tim@tieka.nl", 1, 120, new Date(new Date("20160101")), ""),
            new Site("quora.com", "koud", "tim@tieka.nl", 1, 74, new Date("20160101"), "Max 75 karakters in het wachtwoord"),
            new Site("robbshop.com", "koud", "tim@tieka.nl", 1, 120, new Date("20160101"), ""),
            new Site("lynda.com", "koud", "tim@tieka.nl", 1, 120, new Date("20160101"), ""),
            new Site("nrc.nl", "koud", "elma@tieka.nl", 1, 120, new Date("20160101"), ""),
            new Site("ebay.com", "heet", "tivansteenberge_0", 3, 64, new Date("20160101"), "Max 64 karakters in het wachtwoord"),
            new Site("ebay.nl", "heet", "tivansteenberge_0", 3, 64, new Date("20160101"), "Max 64 karakters in het wachtwoord"),
            new Site("yetanothersite.nl", "koud", "alias24", 1, 120, new Date("20160101"), ""),
            new Site("andonemore.nl", "koud", "myusernamehere", 1, 120, new Date("20160101"), "")
        ]
    };
    let sites = json.sites;
    localStorage.setItem("sites", JSON.stringify(json));
    showTheLocallyStoredData(5);
    setValueForElementDomain();
    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
            // chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
            let ourPopup = document;
            let domain = getDomain(tab.url);
            let domainElement = ourPopup.getElementById('OPFESinputDomain');
            domainElement.setAttribute('value', domain);
            setValueForElements(domain);
            function getDomain(url) {
                let domain = url.match(/:\/\/(.[^/]+)/)[1];
                //remove the sub-domain(s)
                let numberOfDotsInDomain = (domain.match(/\./g) || []).length;
                for (let dot = 1; dot < numberOfDotsInDomain; dot++) {
                    domain = domain.substr(domain.indexOf('.') + 1, domain.length);
                }
                return domain;
            }
            function setValueForElements(domain) {
                json = JSON.parse(localStorage.getItem("sites"));
                sites = json.sites;
                for (let i = 0; i < sites.length; i++) {
                    let site = new Site(sites[i]["domain"], sites[i]["salt"], sites[i]["userId"], sites[i]["sequenceNr"], sites[i]["maxPwdChars"], sites[i]["usedAt"], sites[i]["remark"]);
                    if (site.getDomain() == domain) {
                        document.getElementById('OPFESinputDomain').setAttribute('disabled', "disabled");
                        if (site.getSalt() != "") {
                            document.getElementById('OPFESinputSalt').setAttribute('value', site.getSalt());
                            document.getElementById('OPFESinputSalt').setAttribute('disabled', "disabled");
                        }
                        if (site.getUserId() != "") {
                            document.getElementById('OPFESinputUserId').setAttribute('value', site.getUserId());
                            document.getElementById('OPFESinputUserId').setAttribute('disabled', "disabled");
                        }
                        if (site.getSequenceNr() != 0) {
                            document.getElementById('OPFESinputSequenceNr').setAttribute('value', (site.getSequenceNr() + ""));
                            document.getElementById('OPFESinputSequenceNr').setAttribute('disabled', "disabled");
                        }
                        if (site.getMaxPwdChars() != 120) {
                            // <HTMLSelectElement>(document.getElementById('selectMaxPwdChars')).setAttribute('value', <site._maxPwdChars);
                            document.getElementById('OPFESselectMaxPwdChars').setAttribute('disabled', "disabled");
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
     * @param numOfLines Number of lines to show in the OnepasswordforeverysiteApp.html
     */
    function showTheLocallyStoredData(numOfLines) {
        json = JSON.parse(localStorage.getItem("sites"));
        sites = json.sites;
        let dataTableHTML = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>maxPwdChars</td><td>used at</td></ts><td>remark</td></thead>";
        // sites.forEach((dataTableHTML: string, site: Site ): Site => {
        for (let i = 0; i < sites.length && i < numOfLines; i++) {
            let site = new Site(sites[i]["domain"], sites[i]["salt"], sites[i]["userId"], sites[i]["sequenceNr"], sites[i]["maxPwdChars"], sites[i]["usedAt"], sites[i]["remark"]);
            dataTableHTML += '<tr><td>' + site.getDomain() + '</td>';
            dataTableHTML += '<td>' + site.getSalt() + '</td>';
            dataTableHTML += '<td>' + site.getUserId() + '</td>';
            dataTableHTML += '<td>' + site.getSequenceNr() + '</td>';
            dataTableHTML += '<td>' + site.getMaxPwdChars() + '</td>';
            dataTableHTML += '<td>' + site.getLastUsed() + '</td>';
            dataTableHTML += '<td>' + site.getRemark() + '</td>';
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
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
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
        let elementId = this.id.substr(0, this.id.length - 4);
        let elementToToggle = document.getElementById(elementId);
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('OPFESinputAppPasswordShow').setAttribute('disabled', 'disabled');
        document.getElementById('OPFESinputAppPasswordHide').removeAttribute('disabled');
    });
    document.getElementById('OPFESinputAppPasswordHide').addEventListener('click', function () {
        let elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('OPFESinputAppPasswordShow').removeAttribute('disabled');
        document.getElementById('OPFESinputAppPasswordHide').setAttribute('disabled', 'disabled');
    });
    /* The functions for the buttons to Copy LocalStorage to disk and back again, (OPFESCopyLocalStorageToDiskButton and
      * OPFESCopyDiskToLocalStorageButton) are defined in their own files. */
    /*
     * Upon clicking the loginButton, generate the password for this site, salt, uid, sequence,
     * show the password in a popup and save the (changed) domain-data to the LocalStorage,
     * N.B. of course not saving the password!
     */
    document.getElementById('OPFESloginButton').addEventListener('click', function () {
        let ourPopup = document;
        let site = new Site(ourPopup.getElementById('OPFESinputDomain').value, ourPopup.getElementById('OPFESinputSalt').value, ourPopup.getElementById('OPFESinputUserId').value, +ourPopup.getElementById('OPFESinputSequenceNr').value, +ourPopup.getElementById('OPFESselectMaxPwdChars').value, new Date(Date.now()));
        let inputValueAppPassword = ourPopup.getElementById('OPFESinputAppPassword').value;
        //save the sites data every time the password gets generated
        // siteService.add(site)
        let siteUpserted = false;
        for (let i = 0; i < json.sites.length; i++) {
            if (json.sites[i]["domain"] == site.getDomain()) {
                json.sites[i] = site;
                siteUpserted = true;
            }
        }
        if (!siteUpserted) {
            json.sites.push(site);
        }
        localStorage.setItem("sites", JSON.stringify(json));
        let siteService = new SiteService(sites);
        let sitePassword = siteService.getSitePassword(site, inputValueAppPassword);
        window.prompt('The password for this site for this user-id is: ' + sitePassword + ' To copy the password to your clipboard: Ctrl+C, Enter', sitePassword);
        let passwordElement = ourPopup.getElementById('OPFESinputSitePassword');
        passwordElement.setAttribute("value", sitePassword);
        // Insert the sitePassword in the password-input field in the document
        // insertPwd(sitePassword, passwordElement);
    }, false);
}, false);
function getTheLocallyStoredSites(numOfLines = 9999) {
    let json = JSON.parse(localStorage.getItem("sites"));
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
    ;
    getByDomain(domain) {
        let site = new Site;
        getTheLocallyStoredSites();
        // site->setDomain()
        return site;
    }
    ;
    getAll() {
        return getTheLocallyStoredSites();
    }
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
    getSitePassword(site, appPassword) {
        const passwordLength = site.getMaxPwdChars(); //Between 20 and 120
        //get the SHA512
        let stringToHash = site.getDomain() + site.getSalt() + site.getUserId() + site.getSequenceNr() + appPassword;
        let generatedHash = SHA512(stringToHash);
        //Now we have got a hexadecimal hash. Let's create our own BASE-64 password character set and
        // transform the hex to that. There are 86 characters available in passwords:
        // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
        //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
        //op ebay.nl:  !@#$+*^~-
        // I choose to exclude these: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
        const lowerCaseCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s", "t", "u", "v", "w", "z"];
        const upperCaseCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "Z"];
        const numberCharacters = ["2", "3", "4", "5", "6", "8", "9"];
        const specialCharacters = ["'", "/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"];
        const passwordCharacters = lowerCaseCharacters.concat(upperCaseCharacters).concat(numberCharacters).concat(specialCharacters);
        let counterHash = 0;
        let generatedPassword = "";
        for (let counterPwd = 0; counterPwd < (passwordLength / 2); counterPwd++) {
            let nextHashPart = generatedHash.substr(counterHash, 3);
            let nextDecimal = parseInt(nextHashPart, 16);
            let secondChar = nextDecimal % 64;
            let firstChar = ((nextDecimal - secondChar) / 64);
            generatedPassword += passwordCharacters[firstChar] + passwordCharacters[secondChar];
            counterHash = ((counterHash + 3) > 128) ? 1 : (counterHash + 3); //resetting counterHash to 1 (instead of 0) to get different nextHashParts the second time
        }
        //Make sure there is at least one uppercase
        if ((/[A-Z]/.test(generatedPassword)) === false) {
            let chosenUppercaseCharacter = upperCaseCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = chosenUppercaseCharacter + generatedPassword.substr(1, passwordLength - 1);
        }
        //Make sure there is at least one lowercase
        if ((/[a-z]/.test(generatedPassword)) === false) {
            let chosenLowercaseCharacter = lowerCaseCharacters[generatedHash.charCodeAt(3) % 19];
            let chosenPosition = generatedHash.charCodeAt(4) % 16 + 1; // = 1 to 16
            let firstPart = generatedPassword.substr(0, chosenPosition);
            let lastPart = generatedPassword.substr(chosenPosition + 1);
            generatedPassword = firstPart + chosenLowercaseCharacter + lastPart;
        }
        //Make sure there is at least one number
        if ((/[0-9]/.test(generatedPassword)) === false) {
            let chosenNumberCharacter = numberCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenNumberCharacter;
        }
        //Make sure there is at least one special character
        if ((/['/~@#%^()_+-=.:?!{}]/.test(generatedPassword)) === false) {
            let chosenSpecialCharacter = specialCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenSpecialCharacter;
        }
        return generatedPassword;
    }
}
//# sourceMappingURL=OnepasswordforeverysiteApp.js.map