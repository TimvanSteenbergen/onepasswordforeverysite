/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is what I do every time you visit any page:
 * - I check if this site allows you to log on.
 * - If not: I do nothing
 * - If so: I check in your userData if you have logged in to this site before.
 * -        If not: You need to log in the old-fashioned way, change your password with my help and log in again.
 * -        If so: I retrieve your userid for this site and copy the value to the user-id's inputfield.
 * -               I add my own version of the password-field
 * -               I put your userid, that you have used before on this site, in the user-id's inputfield
 */
(function () {
    let pwdInputs;
    function getVisiblePwdInputFields(maxPwdInputs = 5) {
        let inputElements = document.getElementsByTagName("input");
        let cnt = 0;
        let pwdInputs = [];
        for (let i = 0; i < inputElements.length; i++) {
            if (inputElements[i].type.toLowerCase() === `password`
                && inputElements[i].id.substring(0, 5) !== `OPFES`
                && !isHidden(inputElements[i])) {
                // We found a password field! Let's add it to our collection:
                pwdInputs[cnt++] = inputElements[i];
                if (cnt > maxPwdInputs)
                    return pwdInputs;
            }
        }
        return pwdInputs;
    }
    pwdInputs = getVisiblePwdInputFields();
    if (pwdInputs.length === 0) {
        return;
    }
    else {
        chrome.storage.local.get('_sites', function (response) {
            if (!response._sites || response._sites.length === 0) {
                new NoUserData();
            }
            else {
                for (let site of response._sites) {
                    if (window.location.href.indexOf(site.domain) >= 0) {
                        thisSite = new Site(site.domain, site.salt, site.userId, site.sequenceNr, site.maxPwdChars, site.allowedSpecialCharacters, site.lastUsed, site.remark);
                    }
                }
                if (!thisSite) {
                    new UnknownSite();
                }
                else if (pwdInputs.length === 1) {
                    new Login(thisSite, pwdInputs);
                }
                else if (pwdInputs.length === 2) {
                    new NewAndVerifyPassword(thisSite, pwdInputs);
                }
                else if (pwdInputs.length === 3) {
                    new OldNewAndVerifyPassword(thisSite, pwdInputs);
                }
            }
        });
    }
    let thisSite;
    // This function checks if the given element is visible
    // Returns a boolean
    function isHidden(el) {
        return (el.offsetParent === null);
    }
})();
//# sourceMappingURL=LoginElement.js.map