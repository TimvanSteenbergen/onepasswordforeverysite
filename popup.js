/**
 * Created by Gebruiker on 21-1-2017.
 */
document.addEventListener('DOMContentLoaded', function () {
    var loginButton = document.getElementById('loginButton');
    setValueForElementDomain();
    setValueForElementMyUidThisSite();

    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
            var ourPopup = document;
            var domain = getDomain(tab.url);
            var domainElement = ourPopup.getElementById('domain');
            domainElement.value = domain;

            function getDomain(url)
            //This function gets the domainname from the url.
            {
                domain = url.match(/:\/\/(.[^/]+)/)[1];
                return domain;
            }
        });
    }

    function setValueForElementMyUidThisSite() {
        var uidsUsedOnThisSite = ['myusername', 'yourusername', 'John Doe'];
        var ourPopup = document;
        var myUidThisSiteElement = ourPopup.getElementById('myUidThisSite');
        myUidThisSiteElement.value = uidsUsedOnThisSite[0];
    }

    loginButton.addEventListener('click', function () {

        var ourPopup = document;
        var domain = ourPopup.getElementById('domain').value;
        var myUidThisSite = ourPopup.getElementById('myUidThisSite').value; //alert('myUidThisSite:' + myUidThisSite);
        var myOnlyPassword = ourPopup.getElementById('myOnlyPassword').value; //alert('myOnlyPassword:' + myOnlyPassword);
        var pwdForThisSiteForThisUid = getPwdForThisSiteForThisUid(domain, myUidThisSite, myOnlyPassword); //alert('pwdForThisSiteForThisUid: ' + pwdForThisSiteForThisUid);
        var passwordElement = ourPopup.getElementById('pwdForThisSiteForThisUid');
        passwordElement.value = pwdForThisSiteForThisUid;
        // insertPwd(pwdForThisSiteForThisUid, passwordElement);

        function getPwdForThisSiteForThisUid(domain, uidThisSite, pwdUser) {
            generatedPassword = 'rew54UIu!.09';
            return generatedPassword;
        }
    }, false);
}, false);

