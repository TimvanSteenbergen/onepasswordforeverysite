/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is WebPageWithPassword for webpages having one password-field. We are trying to log in.
 */
class Login extends AbstractForm {
    constructor(thisSite, pwdInputs) {
        super();

        if (pwdInputs.length > 1) {
            console.log('Error in Login-form-detection: This loginForm should only have one passwordfield.');
            return
        }

        let pwdInput: HTMLInputElement = pwdInputs[0];
        let userNameInputValue: string = thisSite.getUserId();
        if (userNameInputValue !== '') {

            //todo: Make Finding the username-inputfield as smart as possible
            //... and put it in the user-id inputfield
            let userNameInputElement: HTMLInputElement =
                <HTMLInputElement>this.getVisibleUserIdElement(
                    'input[type="text"][id*=user], ' +
                    'input[type="text"][id*=User], ' +
                    'input[type="text"][id*=id], ' +
                    'input[type="text"][id*=Id], ' +
                    'input[type="text"]',
                    pwdInput
                );
            if (!userNameInputElement) {
                // Appearently the username is already stored somewhere else, not in a HTMLInputElement
                // so there is no need to worry about it.
            }

            if (userNameInputElement) {
                userNameInputElement.value = userNameInputValue;
            }
        } else {
            /** Not possible, every site does have a value in field 'userid';
             * At least that's what I think right now. Will probably stand corrected in the near future...*/
        }

        // then let me ask the Opfes-password, generate the password and put it in the passwordfield.
        let shortMessage: string = `Enter your Opfes-password to log in: `;
        let message: string = `On this site you have logged in previously with user-id ${thisSite.getUserId()}. ` +
            `After you have entered your Opfes-password, I will generate your password for this site, ` +
            `put it in the password-inputfield and press the submit-button. If all goes well ` +
            `you will then be logged in to this site.`;

        AbstractForm.showPopupForm(shortMessage, message, pwdInput, true);
        document.getElementById('OPFES_popup_password').focus();
        document.getElementById('OPFES_popup_password').addEventListener('keydown', function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                Login.generatePasswordAndLogin(thisSite, pwdInput);
            }
        });
        document.getElementById('OPFES_popup_submit').addEventListener('click', function () {
            Login.generatePasswordAndLogin(thisSite, pwdInput);
        });
    }


    //This function returns the userNameInputElement. The first visible inputElement in the password-wrapping form
    getVisibleUserIdElement(selectorString: string, pwdElement: HTMLInputElement) {
        // Get the form wrapping the passwordfield
        let loginForm = pwdElement.form;

        //Todo Kill Annie
        let inputElements: any = loginForm.querySelectorAll(selectorString);
        if (inputElements) {
            for (let i = 0; i < inputElements.length; i++) {
                if (!this.isHidden(inputElements[i])) {
                    // We found a password field! Let's add it to our collection:
                    return inputElements[i];
                }
            }
        }
    }

    // This function checks if the given element is visible
    // Returns a boolean
    isHidden(el) { // Check if the password-input-field is hidden for the user
        return (el.offsetParent === null)
    }

    private static generatePasswordAndLogin(thisSite, pwdInput: HTMLInputElement) {
        let opfesPassword: string = (<HTMLInputElement>document.getElementById('OPFES_popup_password')).value;
        let submitButton: HTMLElement;
        let generatedPassword: string;
        let shortMessage: string;
        let message: string;

        if (opfesPassword !== null && opfesPassword !== "") {
            generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
            pwdInput.value = generatedPassword;
            // alert (generatedPassword);
            submitButton = this.getSubmitButton(pwdInput);
            if (submitButton) { // If the submitbutton is found: click it!
                if (thisSite.getDomain() !== 'ebay.nl') {
                    AbstractForm.hidePopupForm();
                    submitButton.click();
                } else {
                    shortMessage = `You will need to click the submit button yourself for this site. `;
                    message = `This is a known bug in the Ebay.nl-site. Feel free to contribute to this tool by solving it. ` +
                    `See <a href="https://github.com/TimvanSteenbergen/onepasswordforeverysite/issues/38">Issue 38</a>.`;
                    AbstractForm.changeMessages(shortMessage, message, null, false);
                }//Does not work on ebay.nl...
                // pwdInputs[0].form.submit(); //.. but this neither...
            } else {
                this.submitButtonNotFound();
            }
        }
    }

}
