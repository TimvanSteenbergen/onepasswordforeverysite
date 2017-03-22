/**
 * Created by tvansteenbergen on 2017-03-09.
 */

/* This decorates (rather: 'appends to its parent') every InputElement of type password, with a extra inputElement called
 * OPFES_password_x_input
 */
function decoratePasswordInputElements(): HTMLInputElement[] {
    let result = [];
    let inputs = document.getElementsByTagName("input");
    let pwdCounter: number = 0;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() === `password`
            && inputs[i].id.substring(0, 5) !== `OPFES`) {
            pwdCounter++;

            // Create the OPFES password input element
            let OPFES_PasswordInputElement: HTMLInputElement = <HTMLInputElement>document.createElement(`input`);
            OPFES_PasswordInputElement.id = `OPFES_password_${pwdCounter}_input`;
            OPFES_PasswordInputElement.type = `password`;
            OPFES_PasswordInputElement.border = `border:1px solid brown`;

            // Copy the OPFES image from the extension's images to the variable myImage
            let customerBrowser = get_browser();
            let myImage: string = chrome.extension.getURL("icons\/opfes_19.png");
            if (customerBrowser.name === 'Chrome') {
                myImage = chrome.extension.getURL("icons\/opfes_19.png");
            } else {
                myImage = browser.extension.getURL("icons\/opfes_19.png");
            }

            // Create the OPFES image element
            let OPFES_MyImage: HTMLImageElement = <HTMLImageElement>document.createElement(`img`);
            OPFES_MyImage.name = `OPFES_myImage`;
            OPFES_MyImage.src = `${myImage}`;
            OPFES_MyImage.title = `Enter your OPFES password and I will generate your password, and try and log you in.`;
            OPFES_MyImage.id = `OPFES_LoginImage`;

            // Add the new OPFES elements close to the original password element
            let decoratedElement: HTMLDivElement = <HTMLDivElement>document.createElement(`div`);
            decoratedElement.innerHTML = OPFES_PasswordInputElement.outerHTML + OPFES_MyImage.outerHTML;
            decoratedElement.id = `OPFES_password_${pwdCounter}_div`;
            inputs[i].parentNode.appendChild(decoratedElement);
            document.getElementById(`OPFES_LoginImage`).addEventListener(`click`, function () {
                // Check with the extension for the password for this domain
                console.log(`Attempting to get a respone...`);
                chrome.runtime.sendMessage({"pleaseGiveMe": "thePassword", "password": "qwer"}, function (response) {
                    if (response) {
                        // Todo: put this response into the password-field and logon;
                        console.log(`received response: ${response.itIs}`);
                        // let passwordInput:HTMLInputElement = (<HTMLInputElement>document.getElementById(OPFES_PasswordInputElement.id));
                        // passwordInput.value = response.itIs;
                    } else {
                        console.log(`received response: No response recieved`);
                    }
                });
            });

            // Check with the extension if there is a userid for this domain
            console.log('sendMessage');
            chrome.storage.local.get("_sites", function (response) {
                //todo: Make Finding the username-inputfield as smart as possible
                let userNameInput = <HTMLInputElement>document.querySelector('#username');
                if (userNameInput) {
                    for (let site of response._sites) {
                        if (window.location.href.indexOf(site.domain) >= 0) {
                            userNameInput.value = site.userId;
                        }
                    }
                }
            });

            // chrome.runtime.sendMessage({"pleaseGiveMe": "theUserid"}, function(response) {
            //     if(response){
            //         // Todo: put this response into the login-field.
            //         console.log(`received response: ${response.itIs}`);
            //     } else {
            //         console.log(`received response: No response received`);
            //     }
            // });
        }
    }
    return result;
}

// Kick off initial page load check
let passwordInputElements = decoratePasswordInputElements;
if (passwordInputElements().length >= 1) {
    // nowWhat;
}
/**
 * Created by Tim on 2017-03-18.
 */
