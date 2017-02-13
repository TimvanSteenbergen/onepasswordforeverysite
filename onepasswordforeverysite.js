///<reference path="chrome/index.d.ts"/>
console.log('before DOMContentLoaded');
document.addEventListener('DOMContentLoaded', function () {
    // importScripts("SHA512.js");
    console.log('upon DOMContentLoaded');
    var sites = [];
    var json = {
        "sites": [
            ["gavelsnipe.com", "koud", "timvans", "1", "20160101"],
            ["webassessor.com", "koud", "TimvanSteenbergen", "2", "20160101"],
            ["stackoverflow.com", "koud", "tim@tieka.nl", "1", "20160101"],
            ["robbshop.com", "koud", "tim@tieka.nl", "1", "20160101"],
            ["lynda.com", "koud", "tim@tieka.nl", "1", "20160101"],
            ["quora.com", "koud", "tim@tieka.nl", "1", "20160101"],
            ["nrc.nl", "koud", "iliketoread", "1", "20160101"],
            ["ebay.com", "heet", "tivansteenberge_0", "3", "20160101"],
            ["yetanothersite.nl", "koud", "alias24", "1", "20160101"],
            ["andonemore.nl", "koud", "myusernamehere", "1", "20160101"]
        ]
    };
    localStorage.setItem("sites", JSON.stringify(json));
    setValueForElementDomain();
    showTheLocallyStoredData(5);
    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
            // chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
            var ourPopup = document;
            var domain = getDomain(tab.url);
            var domainElement = ourPopup.getElementById('domain');
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
                    if (sites[i][0] == domain) {
                        document.getElementById('domain').setAttribute('disabled', "disabled");
                        if (sites[i][1] != "") {
                            document.getElementById('mySaltThisSite').setAttribute('value', sites[i][1]);
                            document.getElementById('mySaltThisSite').setAttribute('disabled', "disabled");
                        }
                        if (sites[i][2] != "") {
                            document.getElementById('myUidThisSite').setAttribute('value', sites[i][2]);
                            document.getElementById('myUidThisSite').setAttribute('disabled', "disabled");
                        }
                        if (sites[i][3] != "") {
                            document.getElementById('mySequenceThisSite').setAttribute('value', sites[i][3]);
                            document.getElementById('mySequenceThisSite').setAttribute('disabled', "disabled");
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
        var dataTableHTML = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>used at</td></ts><td>remark</td></thead>";
        for (var i = 0; i < sites.length && i < numOfLines; i++) {
            dataTableHTML += '<tr><td>' + sites[i][0] + '</td>';
            dataTableHTML += '<td>' + sites[i][1] + '</td>';
            dataTableHTML += '<td>' + sites[i][2] + '</td>';
            dataTableHTML += '<td>' + sites[i][3] + '</td>';
            dataTableHTML += '<td>' + sites[i][4] + '</td>';
            dataTableHTML += '<td>' + '</td></tr>';
        }
        if (sites.length > numOfLines) {
            document.getElementById('showAllTheLocallyStoredData').setAttribute('style', "display: inline");
        }
        else {
            document.getElementById('showAllTheLocallyStoredData').setAttribute('style', "display: none");
        }
        dataTableHTML += '</table>';
        document.getElementById('locallyStoredUserData').innerHTML = dataTableHTML;
    }
    document.getElementById('showAllTheLocallyStoredData').addEventListener('click', function () {
        showTheLocallyStoredData(100000);
    });
    document.getElementById('domainToggle').addEventListener('click', function () {
        var elementId = this.id.substr(0, this.id.length - 6);
        var elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        }
        else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    document.getElementById('mySaltThisSiteToggle').addEventListener('click', function () {
        var elementId = this.id.substr(0, this.id.length - 6);
        var elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        }
        else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    document.getElementById('myUidThisSiteToggle').addEventListener('click', function () {
        var elementId = this.id.substr(0, this.id.length - 6);
        var elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        }
        else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    document.getElementById('mySequenceThisSiteToggle').addEventListener('click', function () {
        var elementId = this.id.substr(0, this.id.length - 6);
        var elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        }
        else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    document.getElementById('myOnlyPasswordShow').addEventListener('click', function () {
        var elementId = this.id.substr(0, this.id.length - 4);
        var elementToToggle = document.getElementById(elementId);
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('myOnlyPasswordShow').setAttribute('disabled', 'DISABLED');
        document.getElementById('myOnlyPasswordHide').removeAttribute('disabled');
    });
    document.getElementById('myOnlyPasswordHide').addEventListener('click', function () {
        var elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('myOnlyPasswordShow').removeAttribute('disabled');
        document.getElementById('myOnlyPasswordHide').setAttribute('disabled', 'DISABLED');
    });
    /*
     * Upon clicking the loginButton, generate the password for this site, salt, uid, sequence and given password.
     */
    document.getElementById('loginButton').addEventListener('click', function () {
        var ourPopup = document;
        var domain = ourPopup.getElementById('domain').value;
        var mySaltThisSite = ourPopup.getElementById('mySaltThisSite').value; //alert('mySaltThisSite: ' + mySaltThisSite);
        var myUidThisSite = ourPopup.getElementById('myUidThisSite').value; //alert('myUidThisSite:' + myUidThisSite);
        var mySequenceThisSite = ourPopup.getElementById('mySequenceThisSite').value; //alert('mySequenceThisSite:' + mySequenceThisSite);
        var myOnlyPassword = ourPopup.getElementById('myOnlyPassword').value; //alert('myOnlyPassword:' + myOnlyPassword);
        var pwdForThisSiteForThisUid = getPwdForThisSiteForThisUid(domain, mySaltThisSite, myUidThisSite, mySequenceThisSite, myOnlyPassword);
        // alert('pwdForThisSiteForThisUid: ' + pwdForThisSiteForThisUid);
        var passwordElement = ourPopup.getElementById('pwdForThisSiteForThisUid');
        passwordElement.setAttribute("value", pwdForThisSiteForThisUid);
        // Insert the pwdForThisSiteForThisUid in the password-input field in the document
        // insertPwd(pwdForThisSiteForThisUid, passwordElement);
        /**
         * This function takes its parameters and returns a hashed password that:
         * - has length of 120 characters (unless you change the constant passwordLength)
         * - is made up of 64 different characters
         * - includes at least one: uppercase, lowercase, integer and special character
         * @param domain
         * @param saltThisSite
         * @param uidThisSite
         * @param sequenceNr
         * @param pwdUser
         * @returns {string}
         */
        function getPwdForThisSiteForThisUid(domain, saltThisSite, uidThisSite, sequenceNr, pwdUser) {
            var passwordLength = 120; //Minimal 20 and an even number!
            //get the SHA512
            var stringToHash = domain + saltThisSite + uidThisSite + sequenceNr + pwdUser;
            var generatedHash = SHA512(stringToHash);
            //Now we have got a hexadecimal hash. Let's transform it to the 64 out of the 86 characters available in passwords:
            // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
            //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
            // I choose to exclude these 23: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
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
        }
    }, false);
}, false);
//# sourceMappingURL=onepasswordforeverysite.js.map