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
        let addedLightbox = document.createElement(`div`);
        addedLightbox.id = "OPFES_light";
        addedLightbox.setAttribute('class', "OPFES_white_content");
        addedLightbox.innerHTML =
            "What is your password? " +
                "<input id='OPFES_UserPassword' type='password'>" +
                "<input id='OPFES_SubmitPassword' type='submit'>" +
                "<input id='OPFES_Cancel' type='button' value='Close this popup and show this site's regular login-form'>" +
                "";
        document.body.appendChild(addedLightbox);
        let overlay = document.createElement(`div`);
        overlay.id = "OPFES_fade";
        overlay.setAttribute('class', "OPFES_black_overlay");
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
                    document.getElementById('OPFES_light').style.display = 'block';
                    document.getElementById('OPFES_fade').style.display = 'block';
                    document.getElementById('OPFES_SubmitPassword').addEventListener('click', function () {
                        let opfesPassword = document.getElementById('OPFES_UserPassword').value;
                        document.getElementById('OPFES_light').style.display = 'none';
                        document.getElementById('OPFES_fade').style.display = 'none';
                        if (opfesPassword !== null && opfesPassword !== "") {
                            generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
                            pwdInputs[0].value = generatedPassword;
                            let submitButton = pwdInputs[0].form.querySelector('[type="submit"]'); //works at lots, for instance: gavelsnipe.com, npmjs.com
                            if (!submitButton) {
                                submitButton = pwdInputs[0].form.querySelector('[class*="submit"]'); //works at for instance jetbrains.com
                            }
                            else if (!submitButton) {
                                submitButton = pwdInputs[0].form.querySelector('[id*="submit"]'); //works at for instance ...
                            }
                            if (submitButton) {
                                document.body.appendChild(pwdInputs[0].form);
                                submitButton.click();
                            }
                        }
                    });
                    document.getElementById('OPFES_Cancel').addEventListener('click', function () {
                        document.getElementById('OPFES_light').style.display = 'none';
                        document.getElementById('OPFES_fade').style.display = 'none';
                    });
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