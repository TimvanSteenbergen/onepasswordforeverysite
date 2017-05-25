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
    // if (thisIsLoginForm) {
    //     if(thisFormHasOneUseridInputAndOnePasswordInput){
    //         let PasswordForm: PasswordForm = new LoginForm;
    //     } else {
    //         // This is a LoginForm with an unknown format, so:
    //         Do nothing
    //     }
    // } else if (thisIsPasswordChangeForm) {
    //     if(thisFormHasCurrentNewVerify){
    //         let PasswordForm: PasswordForm = new ChangeForm;
    //     } else {
    //         // This is a changepasswordForm with an unknown format, so:
    //         Do nothing
    //     }
    // } else { // This is page without any password form
    //    Do Nothing
    // }
    let pwdInputs = getVisiblePwdInputFields();
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
    if (!pwdInputs) {
        //There are no password-fields on this page, so for this page I do nothing.
        return;
    }
    for (let pwdCounter = 0; pwdCounter < pwdInputs.length; pwdCounter++) {
        if (pwdCounter > 2)
            return; //With more then three password-input-fields this tool has no use.
        let customerBrowser;
        let myImage, myImageUnsetOpfes;
        let OPFES_PasswordInput;
        let thisSite;
        // // I create the OPFES password input element
        // OPFES_PasswordInput = <HTMLInputElement>document.createElement(`input`);
        // OPFES_PasswordInput.id = `OPFES_PasswordInput_${pwdCounter}`;
        // OPFES_PasswordInput.name = `${pwdCounter}`;
        // OPFES_PasswordInput.type = `password`;
        // OPFES_PasswordInput.border = `1px solid brown`;
        // OPFES_PasswordInput.placeholder = `Your Opfes Password`;
        //
        // // I copy the OPFES image from the extension's images to the variable myImage
        // customerBrowser = get_browser();
        // if (customerBrowser.name === 'Chrome') {
        //     myImage = chrome.extension.getURL("icons\/opfes_32.png");
        //     myImageUnsetOpfes = chrome.extension.getURL("icons\/opfes_19_unset_opfes.png");
        // } else {
        //     myImage = browser.extension.getURL("icons\/opfes_32.png");
        //     myImageUnsetOpfes = browser.extension.getURL("icons\/opfes_19_unset_opfes.png");
        // }
        let addedLightbox = document.createElement(`div`);
        addedLightbox.id = "light";
        addedLightbox.setAttribute('class', "white_content");
        addedLightbox.innerHTML = "What is your password? <input id='OPFESUserPassword' type='password'>";
        document.body.appendChild(addedLightbox);
        let overlay = document.createElement(`div`);
        overlay.id = "fade";
        overlay.setAttribute('class', "black_overlay");
        document.body.appendChild(overlay);
        if (pwdCounter == 0) {
            chrome.storage.local.get("_sites", function (response) {
                // Look for the user-id in the userData...
                let userNameInputValue;
                let yourSites = (response._sites) ? response._sites : [];
                let generatedPassword;
                for (let site of yourSites) {
                    if (window.location.href.indexOf(site.domain) >= 0) {
                        thisSite = new Site(site.domain, site.salt, site.userId, site.sequenceNr, site.maxPwdChars, site.allowedSpecialCharacters, site.lastUsed, site.remark);
                    }
                }
                if (!thisSite) {
                    //First time opfes comes to this site, so user needs to log in the old-fashioned way, change her/his password using opfes and log in again.
                    thisSite = new Site(SiteService.getDomain(window.location.href));
                }
                userNameInputValue = thisSite.getUserId();
                //todo: Make Finding the username-inputfield as smart as possible
                //... and put it in the user-id inputfield
                let userNameInput = getVisibleUserIdElement('input[type="text"][id*=user]');
                if (!userNameInput) {
                    userNameInput = getVisibleUserIdElement('input[type="text"][id*=User]');
                }
                if (!userNameInput) {
                    userNameInput = getVisibleUserIdElement('input[type="text"][id*=id]');
                }
                if (!userNameInput) {
                    userNameInput = getVisibleUserIdElement('input[type="text"][id*=Id]');
                }
                if (!userNameInput) {
                    userNameInput = getVisibleUserIdElement('input');
                }
                if (userNameInputValue !== '') {
                    if (userNameInput) {
                        userNameInput.value = userNameInputValue;
                    }
                    else {
                        // let pwdInput: HTMLInputElement = <HTMLInputElement>getVisiblePwdInputs(1)[0];
                        // alert(`You have logged in to this site before and you used user-id ${userNameInputValue}.
                        //         \nPlease enter ${userNameInputValue} in the username input-field.
                        //         \nThen enter your password in my password-field and click on my icon next to it.`);
                    }
                }
                else {
                    // How to tempt the user to use Opfes now?
                }
                //todo integrate this better into the rest of the code
                if (pwdInputs.length === 1) {
                    // then let me ask the Opfes-password, generate the password and put it in the passwordfield.
                    document.getElementById('light').style.display = 'block';
                    document.getElementById('fade').style.display = 'block';
                    let opfesPassword = prompt('Your Opfes password please', '');
                    document.getElementById('light').style.display = 'none';
                    document.getElementById('fade').style.display = 'none';
                    if (opfesPassword !== null && opfesPassword !== "") {
                        generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
                        pwdInputs[0].value = generatedPassword;
                    }
                }
                if (generatedPassword) {
                    // pwdInputs[0].form.submit();//triggers the form but does not work at gavelsnipe.com
                    let submitButton = pwdInputs[0].form.querySelector('[type="submit"]'); //works at lots, for instance: gavelsnipe.com, npmjs.com
                    if (!submitButton) {
                        submitButton = pwdInputs[0].form.querySelector('[class*="submit"]'); //works at jetbrains.com
                    }
                    else if (!submitButton) {
                        submitButton = pwdInputs[0].form.querySelector('[id*="submit"]'); //works at jetbrains.com
                    }
                    if (submitButton) {
                        document.body.appendChild(pwdInputs[0].form);
                        submitButton.click();
                    }
                }
                //This function returns the userNameInput. The first visible inputElement in the password-wrapping form
                function getVisibleUserIdElement(selectorString) {
                    // Get the form wrapping the passwordfield
                    let loginForm = pwdInputs[0].form;
                    // let selectorStart: string = (typeof loginForm.id == "string" && loginForm.id !== "")
                    //     ? ("#" + loginForm.id + " ")
                    //     : "form ";
                    // let selectorString: string = selectorStart + selectorTail;
                    //Todo Kill Annie
                    let inputElements = loginForm.querySelectorAll(selectorString);
                    if (inputElements) {
                        for (let i = 0; i < inputElements.length; i++) {
                            if (!isHidden(inputElements[i])) {
                                // We found a password field! Let's add it to our collection:
                                return inputElements[i];
                            }
                        }
                    }
                }
            });
        }
    }
    // This function checks if the given element is visible
    // Returns a boolean
    function isHidden(el) {
        return (el.offsetParent === null);
    }
})();
//# sourceMappingURL=LoginElement.js.map