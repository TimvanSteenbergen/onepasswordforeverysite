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
            return;
        }
        let pwdInput = pwdInputs[0];
        let userNameInputValue = thisSite.getUserId();
        if (userNameInputValue !== '') {
            //todo: Make Finding the username-inputfield as smart as possible
            //... and put it in the user-id inputfield
            let userNameInputElement = this.getVisibleUserIdElement('input[type="text"][id*=user], ' +
                'input[type="text"][id*=User], ' +
                'input[type="text"][id*=id], ' +
                'input[type="text"][id*=Id], ' +
                'input[type="text"]', pwdInput);
            if (!userNameInputElement) {
                // Appearently the username is already stored somewhere else, not in a HTMLInputElement
                // so there is no need to worry about it.
            }
            else {
                userNameInputElement.value = userNameInputValue;
            }
        }
        else {
            /** Not possible, every site does have a value in field 'userid';
             * At least that's what I think right now. Will probably stand corrected in the near future...*/
        }
        // then let me ask the Opfes-password, generate the password and put it in the passwordfield.
        let shortMessage = `Enter your Opfes-password to log in: `;
        let message = `On this site you have logged in previously with user-id ${thisSite.getUserId()}. ` +
            `After you have entered your Opfes-password, I will generate your password for this site, ` +
            `put it in the password-inputfield and press the submit-button. If all goes well ` +
            `you will then be logged in to this site.`;
        AbstractForm.showPopupForm(shortMessage, message, pwdInput, true);
        document.getElementById('OPFES_popup_password').focus();
        document.getElementById('OPFES_popup_password').addEventListener('keydown', function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                Login.generatePasswordAndSubmit(thisSite, pwdInputs);
            }
        });
        document.getElementById('OPFES_popup_submit').addEventListener('click', function () {
            Login.generatePasswordAndSubmit(thisSite, pwdInputs);
        });
    }
    //This function returns the userNameInputElement. The first visible inputElement in the password-wrapping form
    getVisibleUserIdElement(selectorString, pwdElement) {
        // Get the form wrapping the password field
        let loginForm = pwdElement.form;
        let inputElements = loginForm.querySelectorAll(selectorString);
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
    isHidden(el) {
        return (el.offsetParent === null);
    }
}
//# sourceMappingURL=Login.js.map