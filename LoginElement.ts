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
    let pwdInputs: HTMLInputElement[] = getVisiblePwdInputFields();

    function getVisiblePwdInputFields(maxPwdInputs: number = 5) {
        let inputElements: NodeListOf<HTMLInputElement> = document.getElementsByTagName("input");
        let cnt: number = 0;
        let pwdInputs: HTMLInputElement[] = [];
        for (let i = 0; i < inputElements.length; i++) {
            if (inputElements[i].type.toLowerCase() === `password`
                && inputElements[i].id.substring(0, 5) !== `OPFES`
                && !isHidden(inputElements[i])) {
                // We found a password field! Let's add it to our collection:
                pwdInputs[cnt++] = inputElements[i];
                if (cnt > maxPwdInputs) return pwdInputs;
            }
        }
        return pwdInputs;
    }

    if (!pwdInputs) {
        //There are no password-fields on this page, so for this page I do nothing.
        return;
    }

    for (let pwdCounter = 0; pwdCounter < pwdInputs.length; pwdCounter++) {
        if (pwdCounter > 2) return; //With more then three password-input-fields this tool has no use.
        let thisSite: Site;
        let popupForm:HTMLDivElement = <HTMLDivElement>document.createElement(`div`);
        let overlay: HTMLDivElement = <HTMLDivElement>document.createElement(`div`);
        overlay.id ="OPFES_popup_overlay";
        document.body.appendChild(overlay);

        if (pwdCounter == 0) {//Only do this for the first password-inputfield
            chrome.storage.local.get("_sites", function (response) {

                //Setup the Popup for userinteraction
                popupForm.id ="OPFES_popup_form";
                popupForm.innerHTML =
                    `<h1 id="OPFES_popup_title">Hi, Opfes here.</h1>` +
                    `<p id='OPFES_popup_message'></p>` +
                    `<p id='OPFES_popup_password_element'>Enter your Opfes-password to log in: <input id='OPFES_popup_password' type='password' placeholder='____'>` +
                    `   <input id='OPFES_popup_submit' type='submit' value='Login'></p>` +
                    `<p><input id='OPFES_popup_cancel' type='button' value='Close this popup'></p>`;
                document.body.appendChild(popupForm);
                function showPopupForm(message = '', showSubmitPassword = false) {
                    document.getElementById('OPFES_popup_message').innerHTML = message;
                    document.getElementById('OPFES_popup_password_element').style.display = (showSubmitPassword)?'block':'none';
                    document.getElementById('OPFES_popup_form').style.display = 'block';
                    document.getElementById('OPFES_popup_overlay').style.display = 'block';
                }
                function hidePopupForm() {
                    document.getElementById('OPFES_popup_form').style.display = 'none';
                    document.getElementById('OPFES_popup_overlay').style.display = 'none';
                }
                document.getElementById('OPFES_popup_cancel').addEventListener('click', function () {
                    hidePopupForm();
                });

                // Look for the user-id in the userData...
                let userNameInputValue: string;
                let yourSites = (response._sites) ? response._sites : [];
                let generatedPassword : string;

                for (let site of yourSites) {
                    if (window.location.href.indexOf(site.domain) >= 0) {
                        thisSite = new Site(
                            site.domain, site.salt, site.userId, site.sequenceNr, site.maxPwdChars, site.allowedSpecialCharacters, site.lastUsed, site.remark
                        );
                    }
                }
                
                //If on a loginpage of a domain that is not in the userData... 
                if (!thisSite) {
                    //...then tell the user to change her password and add this domain to the userData
                    let message:string =
                        `I, Opfes, do see a login form, but you have not yet logged to this site using my assistance. If you wish to do so, then: ` +
                        `<ol>` +
                            `<li>login like you used to</li>` +
                            `<li>go to your account-settings to the option where you can change your password.</li>` +
                            `<li>enter your old password</li>` +
                            `<li>Let me help you to generate and enter a new strong and safe password</li>` +
                        `</ol>`;
                    showPopupForm(message, false);
                    return;
                }

                userNameInputValue = thisSite.getUserId();

                //todo: Make Finding the username-inputfield as smart as possible
                //... and put it in the user-id inputfield
                let userNameInput: HTMLInputElement = <HTMLInputElement>getVisibleUserIdElement('input[type="text"][id*=user]');
                if (!userNameInput) {
                    userNameInput = <HTMLInputElement>getVisibleUserIdElement('input[type="text"][id*=User]');
                }
                if (!userNameInput) {
                    userNameInput = <HTMLInputElement>getVisibleUserIdElement('input[type="text"][id*=id]');
                }
                if (!userNameInput) {
                    userNameInput = <HTMLInputElement>getVisibleUserIdElement('input[type="text"][id*=Id]');
                }
                if (!userNameInput) {
                    userNameInput = getVisibleUserIdElement('input');
                }

                if (userNameInputValue !== '') {
                    if (userNameInput) {
                        userNameInput.value = userNameInputValue;
                    } else {
                        // let pwdInput: HTMLInputElement = <HTMLInputElement>getVisiblePwdInputs(1)[0];
                        // alert(`You have logged in to this site before and you used user-id ${userNameInputValue}.
                        //         \nPlease enter ${userNameInputValue} in the username input-field.
                        //         \nThen enter your password in my password-field and click on my icon next to it.`);
                    }
                } else {
                    // How to tempt the user to use Opfes now?
                }

                //todo integrate this better into the rest of the code
                if (pwdInputs.length === 1) {//There is exactly one password-field on this page
                    // then let me ask the Opfes-password, generate the password and put it in the passwordfield.
                    showPopupForm(`On this site you have logged in previously with user-id ${thisSite.getUserId()}`, true);
                    document.getElementById('OPFES_popup_submit').focus();
                    // event.stopPropagation();

                    document.getElementById('OPFES_popup_submit').addEventListener('click', function () {
                        let opfesPassword: string = (<HTMLInputElement>document.getElementById('OPFES_popup_password')).value;
                        let submitButton: HTMLElement;
                        hidePopupForm();
                        if (opfesPassword !== null && opfesPassword !== "") {
                            generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
                            pwdInputs[0].value = generatedPassword;
                            // alert (generatedPassword);
                            submitButton = <HTMLElement>pwdInputs[0].form.querySelector('[type="submit"]');//works at lots, for instance: gavelsnipe.com, npmjs.com
                            if (!submitButton) {
                                submitButton = <HTMLElement>pwdInputs[0].form.querySelector('[class*="submit"]');//works at for instance jetbrains.com
                            }
                            if (!submitButton) {
                                submitButton = <HTMLElement>pwdInputs[0].form.querySelector('[id*="submit"]');//works at for instance ...
                            }
                            if (submitButton) { // If the submitbutton is found: click it!
                                if(thisSite.getDomain() !== 'ebay.nl') {
                                    submitButton.click();
                                } else {
                                    alert('You will need to click the submit button yourself for this site. This is a known bug in the Ebay.nl-site. Feel free to contribute to this tool by solving it. ' +
                                          'See <a href="https://github.com/TimvanSteenbergen/onepasswordforeverysite/issues/38">Issue 38</a>.')
                                }//Does not work on ebay.nl...
                                // pwdInputs[0].form.submit(); //.. but this neither...
                            }
                        }
                    });
                }

                    //This function returns the userNameInput. The first visible inputElement in the password-wrapping form
                function getVisibleUserIdElement(selectorString: string) {
                    // Get the form wrapping the passwordfield
                    let loginForm = pwdInputs[0].form;
                    
                    //Todo Kill Annie
                    let inputElements: any = loginForm.querySelectorAll(selectorString);
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
    function isHidden(el) { // Check if the password-input-field is hidden for the user
        return (el.offsetParent === null)
    }
})();
