/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is what I do every time you visit any page:
 * - I check if this site allows you to log on.
 * - if so, I add my own version of the password-field
 * - and I put your userid, that you have used before on this site, in the user-id's inputfield
 */
(function () {
    let inputs = document.getElementsByTagName("input");
    let pwdInputs: HTMLInputElement[];

    function getPwdInputs(inputs) {
        pwdInputs = [];
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type.toLowerCase() === `password`
                && inputs[i].id.substring(0, 5) !== `OPFES`
                && !isHidden(inputs[i])) {
                pwdInputs.push(inputs[i]);
            }
            function isHidden(el) { //Just checking if the user can see the password-inputfield
                return (el.offsetParent === null)
            }
        }
        return pwdInputs;
    }

    pwdInputs = getPwdInputs(inputs);

    if (!pwdInputs) {
        return;
    }
    for (let pwdCounter = 1; pwdCounter <= pwdInputs.length; pwdCounter++) {
        if (pwdCounter > 3) return; //With more then three password-inputfields this tool has no use.
        let customerBrowser;
        let myImage: string;
        let OPFES_HiddenOriginal: HTMLDivElement;
        let OPFES_PasswordDiv: HTMLDivElement;
        let OPFES_PasswordInput: HTMLInputElement;
        let OPFES_MyImage: HTMLImageElement;
        let thisSite: Site;

        // I create the OPFES password input element
        OPFES_PasswordInput = <HTMLInputElement>document.createElement(`input`);
        OPFES_PasswordInput.id = `OPFES_PasswordInput_${pwdCounter}`;
        OPFES_PasswordInput.name = `${pwdCounter}`;
        OPFES_PasswordInput.type = `password`;
        OPFES_PasswordInput.border = `border:1px solid brown`;

        // I copy the OPFES image from the extension's images to the variable myImage
        customerBrowser = get_browser();
        if (customerBrowser.name === 'Chrome') {
            myImage = chrome.extension.getURL("icons\/opfes_19.png");
        } else {
            myImage = browser.extension.getURL("icons\/opfes_19.png");
        }

        // I create the OPFES image element
        OPFES_MyImage = <HTMLImageElement>document.createElement(`img`);
        OPFES_MyImage.id = `OPFES_MyImage_${pwdCounter}`;
        OPFES_MyImage.name = `${pwdCounter}`;
        OPFES_MyImage.src = `${myImage}`;
        OPFES_MyImage.title = `Enter your OPFES password and I will generate your password, and try and log you in.`;

        OPFES_HiddenOriginal = <HTMLDivElement>document.createElement(`div`);
        OPFES_HiddenOriginal.id = `OPFES_HiddenOriginal_${pwdCounter}`;
        OPFES_HiddenOriginal.setAttribute('style', 'display:none;');
        OPFES_HiddenOriginal.innerHTML = pwdInputs[pwdCounter].outerHTML;

        OPFES_PasswordDiv = <HTMLDivElement>document.createElement(`div`);
        OPFES_PasswordDiv.id = `OPFES_PasswordDiv_${pwdCounter}`;
        OPFES_PasswordDiv.innerHTML =
            OPFES_PasswordInput.outerHTML
            + OPFES_MyImage.outerHTML
            + OPFES_HiddenOriginal.outerHTML;

        // Now hide the found passwordfield and wrap it with my new OPFES element
        // <div id='OPFES_PasswordDiv_X'>
        //   <div id='OPFES_PasswordInput_X'>
        //   <div id='OPFES_HiddenOriginal_X' style='display:none;'>
        //      pwdInputs[pwdCounter]
        //   </div>
        // </div>
        pwdInputs[pwdCounter].outerHTML = OPFES_PasswordDiv.outerHTML;
        document.getElementById(`OPFES_MyImage_${pwdCounter}`).addEventListener(`click`, function () {
            if (13 == 13) {
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
            }
        });

        // I check in your userData if you have logged in to this site before. And if so:
        // I retrieve your userid for this site and copy the value to the user-id's inputfield.
        if (pwdCounter == 1) {//Only do this for the first password-inputfield
            chrome.storage.local.get("_sites", function (response) {
                // Look for the user-id in the userData...
                let userNameInputValue: string;
                for (let site of response._sites) {
                    if (window.location.href.indexOf(site.domain) >= 0) {
                        thisSite = new Site(
                            site.domain, site.salt, site.userId, site.sequenceNr, site.maxPwdChars, site.lastUsed, site.remark
                        );
                    }
                }
                if (!thisSite) {
                    thisSite = new Site();
                }

                userNameInputValue = thisSite.getUserId();

                //todo: Make Finding the username-inputfield as smart as possible
                //... and put it in the user-id inputfield
                let userNameInput: HTMLInputElement = <HTMLInputElement>document.querySelector(
                    'form input[type="text"][id*=user]');
                if (!userNameInput) {
                    userNameInput = <HTMLInputElement>document.querySelector('form input[type="text"][id*=User]');
                } else if (!userNameInput) {
                    userNameInput = <HTMLInputElement>document.querySelector('form input[type="text"][id*=id]');
                } else if (!userNameInput) {
                    userNameInput = <HTMLInputElement>document.querySelector('form input[type="text"][id*=Id]');
                }
                if (userNameInputValue !== '') {
                    if (userNameInput) {
                        userNameInput.value = userNameInputValue;
                    } else {
                        // alert(`You have logged in to this site before and you used user-id ${userNameInputValue}.
                        //         \nPlease enter ${userNameInputValue} in the username input-field.
                        //         \nThen enter your password in my password-field and click on my icon next to it.`);
                    }
                } else {
                    // How to tempt the user to use Opfes now?
                }
            });
        }
    }
})();
