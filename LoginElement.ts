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
    let pwdCounter: number = 0;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() === `password`
            && inputs[i].id.substring(0, 5) !== `OPFES`) {
            pwdCounter++;

            // I create the OPFES password input element
            let OPFES_PasswordInputElement: HTMLInputElement = <HTMLInputElement>document.createElement(`input`);
            OPFES_PasswordInputElement.id = `OPFES_password_${pwdCounter}_input`;
            OPFES_PasswordInputElement.type = `password`;
            OPFES_PasswordInputElement.border = `border:1px solid brown`;

            // I copy the OPFES image from the extension's images to the variable myImage
            let customerBrowser = get_browser();
            let myImage: string = chrome.extension.getURL("icons\/opfes_19.png");
            if (customerBrowser.name === 'Chrome') {
                myImage = chrome.extension.getURL("icons\/opfes_19.png");
            } else {
                myImage = browser.extension.getURL("icons\/opfes_19.png");
            }

            // I create the OPFES image element
            let OPFES_MyImage: HTMLImageElement = <HTMLImageElement>document.createElement(`img`);
            OPFES_MyImage.name = `OPFES_myImage`;
            OPFES_MyImage.src = `${myImage}`;
            OPFES_MyImage.title = `Enter your OPFES password and I will generate your password, and try and log you in.`;
            OPFES_MyImage.id = `OPFES_LoginImage`;

            // I add the new OPFES elements close to the original password element
            let OPFES_PasswordDiv: HTMLDivElement = <HTMLDivElement>document.createElement(`div`);
            OPFES_PasswordDiv.innerHTML = OPFES_PasswordInputElement.outerHTML + OPFES_MyImage.outerHTML;
            OPFES_PasswordDiv.id = `OPFES_password_${pwdCounter}_div`;
            inputs[i].parentNode.appendChild(OPFES_PasswordDiv);
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

            // I check your userData: have you logged in here before? And if so:
            // I get your userid for this domain and put it in the user-id's inputfield.
            chrome.storage.local.get("_sites", function (response) {
                // Look for the user-id in the userData...
                let userNameInputValue: string = '';
                for (let site of response._sites) {
                    if (window.location.href.indexOf(site.domain) >= 0) {
                        userNameInputValue = site.userId;
                    }
                }
                //todo: Make Finding the username-inputfield as smart as possible
                //... and put it in the user-id inputfield
                let userNameInput: HTMLInputElement = <HTMLInputElement>document.querySelector('form input[type="text"][id*=user]');
                if(!userNameInput){
                    userNameInput = <HTMLInputElement>document.querySelector('form input[type="text"][id*=User]');
                }else if(!userNameInput){
                    userNameInput = <HTMLInputElement>document.querySelector('form input[type="text"][id*=id]');
                }else if(!userNameInput){
                    userNameInput = <HTMLInputElement>document.querySelector('form input[type="text"][id*=Id]');
                }
                if (userNameInputValue !== '') {
                    if (userNameInput) {
                        userNameInput.value = userNameInputValue;
                    } else {
                        alert(`You have logged in to this site before and you used user-id ${userNameInputValue}.
                                \nPlease enter ${userNameInputValue} in the username input-field.
                                \nThen enter your password in my password-field and click on my icon next to it.`);
                    }
                } else {
                    // How to tempt the user to use Opfes now?
                }
            });
        }
    }
})();
