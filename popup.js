/**
 * Created by Tim van Steenbergen on 21-1-2017.
 */
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.set({
            "sites": [
                ["gavelsnipe.com", "koud", "timvans", "1"],
                ["webassessor.com", "koud", "TimvanSteenbergen", "1"],
                ["stackoverflow.com", "koud", "tim@tieka.nl", "1"],
                ["ebay.com", "heet", "tivansteenberge_0", "3"],
                ["nrc.nl", "koud", "elm@tieka.nl", "1"],
                ["nrc.nl", "koud", "elm@tieka.nl", "1"],
                ["nrc.nl", "koud", "elm@tieka.nl", "1"],
                ["nrc.nl", "koud", "elm@tieka.nl", "1"]
            ]
        }
    );
    setValueForElementDomain();
    showTheLocallyStoredData(5);
    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
            var ourPopup = document;
            var domain = getDomain(tab.url);
            var domainElement = ourPopup.getElementById('domain');
            domainElement.value = domain;

            setValueForElements(domain);

            function getDomain(url)
            //This function gets the domainname from the url.
            //Can't use "window.location.host" because this will return the domain of the popup.html
            {
                domain = url.match(/:\/\/(.[^/]+)/)[1];
                //remove the sub-domain(s)
                var numberOfDotsInDomain = (domain.match(/\./g) || []).length;
                for (var dot = 1; dot < numberOfDotsInDomain; dot++) {
                    domain = domain.substr(domain.indexOf('.') + 1, domain.strlen);
                }
                return domain;
            }

            function setValueForElements(domain) {
                chrome.storage.local.get("sites", function (result) {
                    sites = result.sites;
                    for (var i = 0; i < sites.length; i++) {
                        if (sites[i][0] == domain) {
                            document.getElementById('domain').disabled = "disabled";
                            if (sites[i][1] != "") {
                                document.getElementById('mySaltThisSite').value = sites[i][1];
                                document.getElementById('mySaltThisSite').disabled = "disabled";
                            }
                            if (sites[i][1] != "") {
                                document.getElementById('myUidThisSite').value = sites[i][2];
                                document.getElementById('myUidThisSite').disabled = "disabled";
                            }
                            if (sites[i][1] != "") {
                                document.getElementById('mySequenceThisSite').value = sites[i][3];
                                document.getElementById('mySequenceThisSite').disabled = "disabled";
                            }
                        }
                    }
                });
            }

        });
    }

    function showTheLocallyStoredData(numOfLines) {
        chrome.storage.local.get("sites", function (result) {
            var sites = result.sites;
            var dataTableHTML = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>remark</td></thead>";
            for (var i = 0; i < sites.length && i < numOfLines; i++) {
                dataTableHTML += '<tr><td>' + sites[i][0] + '</td>';
                dataTableHTML += '<td>' + sites[i][1] + '</td>';
                dataTableHTML += '<td>' + sites[i][2] + '</td>';
                dataTableHTML += '<td>' + sites[i][3] + '</td>';
                dataTableHTML += '<td>' + '</td></tr>';
            }
            if (sites.length > numOfLines){
                dataTableHTML += '<tr><td colspan="5"><span onclick="showTheLocallyStoredData(10000)">...</span></td></tr>';
            }
            dataTableHTML += '</table>';
            document.getElementById('locallyStoredUserData').innerHTML = dataTableHTML;
        });
    }

    domainToggle.addEventListener('click', function () {
        var elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 6));
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.disabled = "disabled";
        }
    });
    mySaltThisSiteToggle.addEventListener('click', function () {
        var elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 6));
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.disabled = "disabled";
        }
    });
    myUidThisSiteToggle.addEventListener('click', function () {
        var elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 6));
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.disabled = "disabled";
        }
    });
    mySequenceThisSiteToggle.addEventListener('click', function () {
        var elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 6));
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.disabled = "disabled";
        }
    });
    myOnlyPasswordShow.addEventListener('click', function () {
        var elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('myOnlyPasswordShow').setAttribute('disabled', 'DISABLED');
        document.getElementById('myOnlyPasswordHide').removeAttribute('disabled');
    });
    myOnlyPasswordHide.addEventListener('click', function () {
        var elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('myOnlyPasswordShow').removeAttribute('disabled');
        document.getElementById('myOnlyPasswordHide').setAttribute('disabled', 'DISABLED');
    });

    /*
     * Upon clicking the loginButton, generate the password for this site, salt, uid, sequence and given password.
     */
    loginButton.addEventListener('click', function () {
        var ourPopup = document;
        var domain = ourPopup.getElementById('domain').value;
        var mySaltThisSite = ourPopup.getElementById('mySaltThisSite').value;//alert('mySaltThisSite: ' + mySaltThisSite);
        var myUidThisSite = ourPopup.getElementById('myUidThisSite').value;//alert('myUidThisSite:' + myUidThisSite);
        var mySequenceThisSite = ourPopup.getElementById('mySequenceThisSite').value;//alert('mySequenceThisSite:' + mySequenceThisSite);
        var myOnlyPassword = ourPopup.getElementById('myOnlyPassword').value;//alert('myOnlyPassword:' + myOnlyPassword);
        var pwdForThisSiteForThisUid = getPwdForThisSiteForThisUid(domain, mySaltThisSite, myUidThisSite, mySequenceThisSite, myOnlyPassword);
        // alert('pwdForThisSiteForThisUid: ' + pwdForThisSiteForThisUid);
        var passwordElement = ourPopup.getElementById('pwdForThisSiteForThisUid');
        passwordElement.value = pwdForThisSiteForThisUid;
        //// insertPwd(pwdForThisSiteForThisUid, passwordElement);

        function getPwdForThisSiteForThisUid(domain, saltThisSite, uidThisSite, sequenceNr, pwdUser) {

            //get the SHA512
            var generatedPassword = SHA512(domain + saltThisSite + uidThisSite + sequenceNr + pwdUser);

            //add two literals
            //TODO make this more obscure
            generatedPassword = generatedPassword.substr(0, 4) + '!' + generatedPassword.substr(4, 3) + '.' + generatedPassword.substr(8);

            //add one capital
            for (var i = 0; i < 12; i++) {
                char = generatedPassword[i];
                if (char >= 'a' && char <= 'z') {
                    generatedPassword = generatedPassword.substr(0, i) + char.toUpperCase() + generatedPassword.substr(i + 1);
                    break;
                } else if (i = 12) {
                    generatedPassword = 'Z' + generatedPassword.substr(1);
                }
            }

            //Shorten it to 20 characters
            generatedPassword = generatedPassword.substr(0, 20);

            return generatedPassword;
        }
    }, false);
}, false);

/*Sample:
 domain ebay.com
 salt: zout
 uid: tivansteenberge_0
 password: geheim
 wachtwoord:
 */