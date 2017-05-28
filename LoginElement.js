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
    let formType;
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
    if (!pwdInputs) {
        //There are no password-fields on this site, so no need for me to do anything.
        return;
    }
    else {
        chrome.storage.local.get("_sites", function (response) {
            //Login form detected, now determine the PopupFormType that has to get called
            if (!response._sites) {
                formTypeLoginNoUserData();
            }
            for (let site of response._sites) {
                if (window.location.href.indexOf(site.domain) >= 0) {
                    thisSite = new Site(site.domain, site.salt, site.userId, site.sequenceNr, site.maxPwdChars, site.allowedSpecialCharacters, site.lastUsed, site.remark);
                }
            }
            if (!thisSite) {
                formTypeUnknownSite();
            }
            else if (pwdInputs.length === 1) {
                formTypeLogin(thisSite, pwdInputs);
            }
            else if (pwdInputs.length === 2) {
                formType = `newPassword`;
            }
            else if (pwdInputs.length === 3) {
                formType = `changePassword`;
            }
        });
    }
    let thisSite;
    let popupForm = document.createElement(`div`);
    let popupOverlay = document.createElement(`div`);
    popupOverlay.id = "OPFES_popup_overlay";
    document.body.appendChild(popupOverlay);
    function formTypeLoginNoUserData() {
    }
    function formTypeUnknownSite() {
        let popupForm = new UnknownSite();
    }
    function formTypeLogin(thisSite, pwdInputs) {
        let popupForm = new LoginForm(thisSite, pwdInputs);
    }
    // This function checks if the given element is visible
    // Returns a boolean
    function isHidden(el) {
        return (el.offsetParent === null);
    }
})();
//# sourceMappingURL=LoginElement.js.map