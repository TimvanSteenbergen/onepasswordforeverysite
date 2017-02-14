/**
 * Created by Tim van Steenbergen on 21-1-2017.
 */

declare function SHA512(string): string;
declare let chrome: any;
///<reference path="chrome/index.d.ts"/>
console.log('before DOMContentLoaded');
document.addEventListener('DOMContentLoaded', function () {
    // importScripts("SHA512.js");

    console.log('upon DOMContentLoaded');
    let sites = [];
    let json = {
        "sites": [//domain, salt, username, sequencenr, maxPwdChars, lastused, remarks
            ["gavelsnipe.com", "koud", "timvans", "1", "", "20160101"],//
            ["webassessor.com", "koud", "TimvanSteenbergen", "2", "", "20160101", ""],//
            ["stackoverflow.com", "koud", "tim@tieka.nl", "1", "", "20160101", ""],//
            ["robbshop.com", "koud", "tim@tieka.nl", "1", "", "20160101", ""],//
            ["lynda.com", "koud", "tim@tieka.nl", "1", "", "20160101", ""],//3!{pWv'4(Tv}fSu.U.e!}S}aaPK'sDpCD^9K9(EhvnHb#9TgFp5WVFhGhDh~!ch(D=W:)M2GfEn9AW+@k-ffcm}RU=epHskBu#Fd{4/TuR-u@ah2:ACU)C9:
            ["quora.com", "koud", "tim@tieka.nl", "1", "75", "20160101", "Max 75 karakters in het wachtwoord"],//
            ["nrc.nl", "koud", "elma@tieka.nl", "1", "", "20160101", ""],//}EA#@MfaU98/Wd#=ha@@MKB_=)(WNgZv+K+6aCaB!@2tb)Tz5pGTc~h%Abd._6u?br#Wu?zSNMse9uzn=G~#a')(?Mhbvk8n:5a?Pw@rrhg)s/NNmhw5Bs_!
            ["ebay.com", "heet", "tivansteenberge_0", "3", "64", "20160101", "Max 64 karakters in het wachtwoord"],//
            ["ebay.nl", "heet", "tivansteenberge_0", "3", "64", "20160101", "Max 64 karakters in het wachtwoord"],//
            ["yetanothersite.nl", "koud", "alias24", "1", "", "20160101", ""],//
            ["andonemore.nl", "koud", "myusernamehere", "1", "", "20160101", ""]//
        ]
    };
    localStorage.setItem("sites", JSON.stringify(json));
    setValueForElementDomain();
    showTheLocallyStoredData(5);
    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
            // chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
            let ourPopup = document;
            let domain = getDomain(tab.url);
            let domainElement = ourPopup.getElementById('domain');
            domainElement.setAttribute('value', domain);

            setValueForElements(domain);

            function getDomain(url)
            //This function gets the domainname from the url.
            //Can't use "window.location.host" because this will return the domain of the popup.html
            {
                domain = url.match(/:\/\/(.[^/]+)/)[1];
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
                        if (sites[i][4] != "") {
                            document.getElementById('myMaxPwdCharsThisSite').setAttribute('value', sites[i][4]);
                            document.getElementById('myMaxPwdCharsThisSite').setAttribute('disabled', "disabled");
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
        let dataTableHTML = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>maxPwdChars</td><td>used at</td></ts><td>remark</td></thead>";
        for (let i = 0; i < sites.length && i < numOfLines; i++) {
            dataTableHTML += '<tr><td>' + sites[i][0] + '</td>';
            dataTableHTML += '<td>' + sites[i][1] + '</td>';
            dataTableHTML += '<td>' + sites[i][2] + '</td>';
            dataTableHTML += '<td>' + sites[i][3] + '</td>';
            dataTableHTML += '<td>' + sites[i][4] + '</td>';
            dataTableHTML += '<td>' + sites[i][5] + '</td>';
            dataTableHTML += '<td>' + sites[i][6] + '</td>';
            dataTableHTML += '<td>' + '</td></tr>';
        }
        if (sites.length > numOfLines) {
            document.getElementById('showAllTheLocallyStoredData').setAttribute('style', "display: inline");
        } else {
            document.getElementById('showAllTheLocallyStoredData').setAttribute('style', "display: none");
        }
        dataTableHTML += '</table>';
        document.getElementById('locallyStoredUserData').innerHTML = dataTableHTML;
    }

    document.getElementById('showAllTheLocallyStoredData').addEventListener('click', function () {
        showTheLocallyStoredData(100000);
    });

    document.getElementById('domainToggle').addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    document.getElementById('mySaltThisSiteToggle').addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    document.getElementById('myUidThisSiteToggle').addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    document.getElementById('mySequenceThisSiteToggle').addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    document.getElementById('myMaxPwdCharsToggle').addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    document.getElementById('myOnlyPasswordShow').addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 4);
        let elementToToggle = document.getElementById(elementId);
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('myOnlyPasswordShow').setAttribute('disabled', 'DISABLED');
        document.getElementById('myOnlyPasswordHide').removeAttribute('disabled');
    });
    document.getElementById('myOnlyPasswordHide').addEventListener('click', function () {
        let elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('myOnlyPasswordShow').removeAttribute('disabled');
        document.getElementById('myOnlyPasswordHide').setAttribute('disabled', 'DISABLED');
    });

    /*
     * Upon clicking the loginButton, generate the password for this site, salt, uid, sequence and given password.
     */
    document.getElementById('loginButton').addEventListener('click', function () {
        let ourPopup = document;
        let domain = (<HTMLInputElement>ourPopup.getElementById('domain')).value;
        let mySaltThisSite = (<HTMLInputElement>ourPopup.getElementById('mySaltThisSite')).value;//alert('mySaltThisSite: ' + mySaltThisSite);
        let myUidThisSite = (<HTMLInputElement>ourPopup.getElementById('myUidThisSite')).value;//alert('myUidThisSite:' + myUidThisSite);
        let mySequenceThisSite = (<HTMLInputElement>ourPopup.getElementById('mySequenceThisSite')).value;//alert('mySequenceThisSite:' + mySequenceThisSite);
        let myMaxPwdChars = (<HTMLSelectElement>ourPopup.getElementById('myMaxPwdChars')).selectedIndex;//alert('myMaxPwdChars:' + myMaxPwdChars);
        let myOnlyPassword = (<HTMLInputElement>ourPopup.getElementById('myOnlyPassword')).value;//alert('myOnlyPassword:' + myOnlyPassword);
        let pwdForThisSiteForThisUid = getPwdForThisSiteForThisUid(domain, mySaltThisSite, myUidThisSite, mySequenceThisSite, myMaxPwdChars, myOnlyPassword);
        // alert('pwdForThisSiteForThisUid: ' + pwdForThisSiteForThisUid);
        let passwordElement = ourPopup.getElementById('pwdForThisSiteForThisUid');
        passwordElement.setAttribute("value", pwdForThisSiteForThisUid);
        // Insert the pwdForThisSiteForThisUid in the password-input field in the document
        // insertPwd(pwdForThisSiteForThisUid, passwordElement);

        /**
         * This function takes its parameters and returns a hashed password that:
         * - has length of 120 characters (unless you change the constant passwordLength)
         * - is made up of 64 different characters
         * - includes at least one: uppercase, lowercase, integer and special character
         * @param domain: string
         * @param saltThisSite: string
         * @param uidThisSite: string
         * @param sequenceNr: number
         * @param maxPwdChar: number
         * @param pwdUser: string
         * @returns {string}
         */
        function getPwdForThisSiteForThisUid(domain, saltThisSite, uidThisSite, sequenceNr, maxPwdChars: number = 120, pwdUser): string {

            const passwordLength: number = maxPwdChars; //Minimal 20 and an even number!

            //get the SHA512
            let stringToHash: string = domain + saltThisSite + uidThisSite + sequenceNr + pwdUser;
            let generatedHash: string = SHA512(stringToHash);

            //Now we have got a hexadecimal hash. Let's transform it to the 64 out of the 86 characters available in passwords:
            // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
            //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
            //op ebay.nl:  !@#$+*^~-
            // I choose to exclude these 23: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
            const lowerCaseCharacters: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s", "t", "u", "v", "w", "z"];
            const upperCaseCharacters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "Z"];
            const numberCharacters: string[] = ["2", "3", "4", "5", "6", "8", "9"];
            const specialCharacters: string[] = ["'", "/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"];
            const passwordCharacters: string[] = lowerCaseCharacters.concat(upperCaseCharacters).concat(numberCharacters).concat(specialCharacters);
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
            if ((/[A-Z]/.test(generatedPassword)) === false) {
                let chosenUppercaseCharacter: string = upperCaseCharacters[generatedHash.charCodeAt(3) % 19];
                generatedPassword = chosenUppercaseCharacter + generatedPassword.substr(1, passwordLength - 1);
            }

            //Make sure there is at least one lowercase
            if ((/[a-z]/.test(generatedPassword)) === false) {
                let chosenLowercaseCharacter: string = lowerCaseCharacters[generatedHash.charCodeAt(3) % 19];
                let chosenPosition: number = generatedHash.charCodeAt(4) % 16 + 1; // = 1 to 16
                let firstPart: string = generatedPassword.substr(0, chosenPosition);
                let lastPart: string = generatedPassword.substr(chosenPosition + 1);
                generatedPassword = firstPart + chosenLowercaseCharacter + lastPart;
            }

            //Make sure there is at least one number
            if ((/[0-9]/.test(generatedPassword)) === false) {
                let chosenNumberCharacter: string = numberCharacters[generatedHash.charCodeAt(3) % 19];
                generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenNumberCharacter;
            }

            //Make sure there is at least one special character
            if ((/['/~@#%^()_+-=.:?!{}]/.test(generatedPassword)) === false) {
                let chosenSpecialCharacter: string = specialCharacters[generatedHash.charCodeAt(3) % 19];
                generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenSpecialCharacter;
            }

            return generatedPassword;
        }
    }, false);
}, false);
