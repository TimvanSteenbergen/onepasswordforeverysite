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
    let pwdInputs: HTMLInputElement[] = getVisiblePwdInputs();

    function getVisiblePwdInputs(maxPwdInputs: number = null) {
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
        let customerBrowser;
        let myImage: string, myImageUnsetOpfes: string;
        let OPFES_HiddenOriginal: HTMLDivElement;
        let OPFES_PasswordDiv: HTMLDivElement;
        let OPFES_PasswordInput: HTMLInputElement;
        let OPFES_MyImage: HTMLImageElement, OPFES_MyImageUnsetOpfes: HTMLImageElement;
        let thisSite: Site;

        // I create the OPFES password input element
        OPFES_PasswordInput = <HTMLInputElement>document.createElement(`input`);
        OPFES_PasswordInput.id = `OPFES_PasswordInput_${pwdCounter}`;
        OPFES_PasswordInput.name = `${pwdCounter}`;
        OPFES_PasswordInput.type = `password`;
        OPFES_PasswordInput.border = `1px solid brown`;
        OPFES_PasswordInput.placeholder = `Your Opfes Password`;

        // I copy the OPFES image from the extension's images to the variable myImage
        customerBrowser = get_browser();
        if (customerBrowser.name === 'Chrome') {
            myImage = chrome.extension.getURL("icons\/opfes_19.png");
            myImageUnsetOpfes = chrome.extension.getURL("icons\/opfes_19_unset_opfes.png");
        } else {
            myImage = browser.extension.getURL("icons\/opfes_19.png");
            myImageUnsetOpfes = browser.extension.getURL("icons\/opfes_19_unset_opfes.png");
        }

        // I create the OPFES image element
        OPFES_MyImage = <HTMLImageElement>document.createElement(`img`);
        OPFES_MyImage.id = `OPFES_MyImage_${pwdCounter}`;
        OPFES_MyImage.name = `${pwdCounter}`;
        OPFES_MyImage.src = `${myImage}`;
        OPFES_MyImage.title = `Enter your OPFES password and I will generate your password, and prefill it in the original passwordfield.`;

        // I create the OPFES image Unset element, which you can use to restore the original passwordfield
        OPFES_MyImageUnsetOpfes = <HTMLImageElement>document.createElement(`img`);
        OPFES_MyImageUnsetOpfes.id = `OPFES_MyImageUnsetOpfes_${pwdCounter}`;
        OPFES_MyImageUnsetOpfes.name = `${pwdCounter}`;
        OPFES_MyImageUnsetOpfes.src = `${myImageUnsetOpfes}`;
        OPFES_MyImageUnsetOpfes.title = `Replace OPFES' password-field by the original password field.`;

        OPFES_HiddenOriginal = <HTMLDivElement>document.createElement(`div`);
        OPFES_HiddenOriginal.id = `OPFES_HiddenOriginal_${pwdCounter}`;
        OPFES_HiddenOriginal.setAttribute('style', 'display:none;');
        OPFES_HiddenOriginal.innerHTML = pwdInputs[pwdCounter].outerHTML;

        OPFES_PasswordDiv = <HTMLDivElement>document.createElement(`div`);
        OPFES_PasswordDiv.id = `OPFES_PasswordDiv_${pwdCounter}`;
        OPFES_PasswordDiv.innerHTML =
            OPFES_PasswordInput.outerHTML
            + OPFES_MyImage.outerHTML
            + OPFES_MyImageUnsetOpfes.outerHTML
            + OPFES_HiddenOriginal.outerHTML;

        // Now hide the found passwordfield and wrap it with my new OPFES element
        // <div id='OPFES_PasswordDiv_X'>
        //   <div id='OPFES_PasswordInput_X'>
        //   <div id='OPFES_HiddenOriginal_X' style='display:none;'>
        //      pwdInputs[pwdCounter]
        //   </div>
        // </div>
        pwdInputs[pwdCounter].outerHTML = OPFES_PasswordDiv.outerHTML;

        //Make it possible to remove Opfes-password and show the original passwordfield again
        document.getElementById(`OPFES_MyImageUnsetOpfes_${pwdCounter}`).addEventListener(`click`, function () {
            let counter = this.name.slice(-1);//Will never be more than 4
            let target = `OPFES_PasswordDiv_${counter}`;
            let original = <HTMLInputElement>(document.getElementById(`OPFES_HiddenOriginal_${counter}`).children[0]);
            let originalHTML = original.outerHTML;
            replaceTargetWith(target, originalHTML);
        });

        //Respond to clicking on Opfes by generating the password and showing the original field again, having the generated password.
        document.getElementById(`OPFES_MyImage_${pwdCounter}`).addEventListener(`click`, function () {
            if (13 == 13) { //TODO: replace this event with login in directly after event PressEnter in the passwordfield
                // document.getElementById(OPFES_PasswordInput.id).addEventListener(`keyup`, function (event: KeyboardEvent) {
                //     if (event.keyCode == 13) {
                event.stopPropagation();
                // let loginForm = this.form; Trigger the form submission with: loginForm.submit();
                let pwdItemNumber = this.name; // Usually 1, if it is 2 or 3 this most likely is a password-change-form
                let yourPasswordForOpfes: string;

                // Check with the extension for the password for this domain
                yourPasswordForOpfes = (this.value) ? this.value : (<HTMLInputElement>document.getElementById(`OPFES_PasswordInput_${pwdCounter}`)).value;
                let yourPasswordForThisSite: string = SiteService.getSitePassword(thisSite, yourPasswordForOpfes);
                let tmpElement: string = document.getElementById(`OPFES_HiddenOriginal_${pwdItemNumber}`).innerHTML;
                if (tmpElement.indexOf('value=""') > 0) {
                    tmpElement = tmpElement.replace('value=""', `value="${yourPasswordForThisSite}"`);
                } else {
                    tmpElement = tmpElement.replace('type=', `value="${yourPasswordForThisSite}" type=`);
                }

                //Make the original password-inputfield visible again now with value: yourPasswordForThisSite
                replaceTargetWith(`OPFES_PasswordDiv_${pwdItemNumber}`, tmpElement);
            }
        });

        function replaceTargetWith(targetID, html) {
            // find our target
            let i, div, elm, last, target = document.getElementById(targetID);
            // create a temporary div
            div = document.createElement('div');
            // fill that div with our html, this generates our children
            div.innerHTML = html;
            // step through the temporary div's children and insertBefore our target
            i = div.childNodes.length;
            // The insertBefore method was more complicated than I first thought so I have improved it.
            // Have to be careful when dealing with child lists as they are counted as live lists and so will
            // update as and when you make changes. This is why it is best to work backwards when moving
            // children around, and why I'm assigning the elements I'm working with to `elm` and `last`.
            last = target;
            while (i--) {
                target.parentNode.insertBefore((elm = div.childNodes[i]), last);
                last = elm;
            }
            // remove the target.
            target.parentNode.removeChild(target);
        }

        if (pwdCounter == 0) {//Only do this for the first password-inputfield
            chrome.storage.local.get("_sites", function (response) {
                // Look for the user-id in the userData...
                let userNameInputValue: string;
                let yourSites = (response._sites) ? response._sites : [];
                for (let site of yourSites) {
                    if (window.location.href.indexOf(site.domain) >= 0) {
                        thisSite = new Site(
                            site.domain, site.salt, site.userId, site.sequenceNr, site.maxPwdChars, site.lastUsed, site.remark
                        );
                    }
                }
                if (!thisSite) {
                    //First time opfes comes to this site, so user needs to log in the old-fashioned way, change her/his password using opfes and log in again.
                    thisSite = new Site(SiteService.getDomain(window.location.href));
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
                //This function returns the userNameInput. The first visible inputElement in the password-wrapping form
                function getVisibleUserIdElement(selectorTail: string) {
                    // Get the form wrapping the passwordfield
                    let loginForm = document.getElementById('OPFES_HiddenOriginal_0').children[0].form;
                    let selectorStart: string = (typeof loginForm.id == "string") ? ("#" + loginForm.id + " ") : "form ";
                    let selectorString: string = selectorStart + selectorTail;
                    //Todo Kill Annie
                    let inputElements: any = document.querySelectorAll(selectorString);
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
