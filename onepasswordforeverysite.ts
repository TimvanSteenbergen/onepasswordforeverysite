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
        "sites": [//domain, salt, username, sequencenr, lastused
            ["gavelsnipe.com", "koud", "timvans", "1", "20160101"],
            ["webassessor.com", "koud", "TimvanSteenbergen", "2", "20160101"],
            ["stackoverflow.com", "koud", "tim@tieka.nl", "1", "20160101"],
            ["robbshop.com", "koud", "tim@tieka.nl", "1", "20160101"],
            ["lynda.com", "koud", "tim@tieka.nl", "1", "20160101"],
            ["quora.com", "koud", "tim@tieka.nl", "1", "20160101"],
            ["ebay.com", "heet", "tivansteenberge_0", "3", "20160101"],
            ["nrc.nl", "koud", "iliketoread", "1", "20160101"],
            ["yetanothersite.nl", "koud", "alias24", "1", "20160101"],
            ["andonemore.nl", "koud", "myusernamehere", "1", "20160101"]
        ]
    };
    localStorage.setItem("sites", JSON.stringify(json));
    setValueForElementDomain();
    showTheLocallyStoredData(5);
    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
        // chrome.tabs.query({active: true, currentWindow: true},function (tab) {
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
                        domain = domain.substr(domain.indexOf('.') + 1, domain.strlen);
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
                    }
                }
            }

        });
    }

    function showTheLocallyStoredData(numOfLines) {
        json = JSON.parse(localStorage.getItem("sites"));
        sites = json.sites;
        let dataTableHTML = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>used at</td></ts><td>remark</td></thead>";
        for (let i = 0; i < sites.length && i < numOfLines; i++) {
            dataTableHTML += '<tr><td>' + sites[i][0] + '</td>';
            dataTableHTML += '<td>' + sites[i][1] + '</td>';
            dataTableHTML += '<td>' + sites[i][2] + '</td>';
            dataTableHTML += '<td>' + sites[i][3] + '</td>';
            dataTableHTML += '<td>' + sites[i][4] + '</td>';
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
        let myOnlyPassword = (<HTMLInputElement>ourPopup.getElementById('myOnlyPassword')).value;//alert('myOnlyPassword:' + myOnlyPassword);
        let pwdForThisSiteForThisUid = getPwdForThisSiteForThisUid(domain, mySaltThisSite, myUidThisSite, mySequenceThisSite, myOnlyPassword);
        // alert('pwdForThisSiteForThisUid: ' + pwdForThisSiteForThisUid);
        let passwordElement = ourPopup.getElementById('pwdForThisSiteForThisUid');
        passwordElement.setAttribute("value", pwdForThisSiteForThisUid);
        // Insert the pwdForThisSiteForThisUid in the password-input field in the document
        // insertPwd(pwdForThisSiteForThisUid, passwordElement);

        function getPwdForThisSiteForThisUid(domain, saltThisSite, uidThisSite, sequenceNr, pwdUser) {

            let passwordLength = 20;

            //get the SHA512
            let stringToHash:string = domain + saltThisSite + uidThisSite + sequenceNr + pwdUser;
            let generatedHash = SHA512(stringToHash);

            // Take 20 characters out of it:
            let varCentury = (generatedHash.charCodeAt(98) % 3 + 1) * 29; // = 29, 58 or 87
            let varTwenty = generatedHash.charCodeAt(32) % 20 + 1; // = 1 - 20
            let chosenStartPosition = varCentury + varTwenty + 4;
            let generatedPassword = generatedHash.substr(chosenStartPosition, passwordLength);

            //add 1, 2 or 3 literals, restricted to `'/\~!@#$%^()_+-=.:?![]{}
            // @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
            let specialCharacters = ["`", "\"", "'", "/", "\\", "~", "!", "@", "#", "$", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "[", "]", "{", "}"];
            let numOfCharsToInsert = generatedHash.charCodeAt(98) % 3; // = 0, 1 or 2
            for (let i = 0; i <= numOfCharsToInsert; i++){
                let chosenSpecialCharacter = specialCharacters[generatedHash.charCodeAt(i * varTwenty) % 25];
                let chosenPosition = generatedHash.charCodeAt(i) % 20;
                let firstPart = (chosenPosition >= 1) ? generatedPassword.substr(0, chosenPosition - 1):"";
                let lastPart = generatedPassword.substr(chosenPosition + 1);
                generatedPassword = firstPart + chosenSpecialCharacter + lastPart;
            }

            //add some capitals
            for (let i = 0; i < passwordLength; i++) {
                let char = generatedPassword.charAt(i);
                let capitalise = (generatedPassword.charCodeAt(i + 2) % 2 == 0); //coinToss-boolean to capitalise or not
                let noCapitalYet = true;
                if (char >= 'a' && char <= 'z' && (capitalise || noCapitalYet)) {
                    generatedPassword = generatedPassword.substr(0, i) + char.toUpperCase() + generatedPassword.substr(i + 1);
                    noCapitalYet = false;
                }
                if (noCapitalYet) {
                    generatedPassword = generatedPassword.substr(0, passwordLength - 1) + "E";
                }
            }

            return generatedPassword;
        }
    }, false);
}, false);
