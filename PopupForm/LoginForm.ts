/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the template Form used by every other PopupForm. It contains functions used by all of them:
 */
class LoginForm extends AbstractForm {
    constructor(thisSite, pwdInputs) {
        super();
        // Look for the user-id in the userData...
        let userNameInputValue: string;
        let generatedPassword: string;

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

        // then let me ask the Opfes-password, generate the password and put it in the passwordfield.
        LoginForm.showPopupForm(`On this site you have logged in previously with user-id ${thisSite.getUserId()}`, true);
        document.getElementById('OPFES_popup_password_element').focus();

        document.getElementById('OPFES_popup_submit').addEventListener('click', function () {
            let opfesPassword: string = (<HTMLInputElement>document.getElementById('OPFES_popup_password')).value;
            let submitButton: HTMLElement;
            LoginForm.hidePopupForm();
            if (opfesPassword !== null && opfesPassword !== "") {
                generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
                pwdInputs[0].value = generatedPassword;
                // alert (generatedPassword);
                submitButton = <HTMLElement>pwdInputs[0].form.querySelector('[type="submit"]');//works at lots, for instance: gavelsnipe.com, npmjs.com
                if (!submitButton) {
                    submitButton = <HTMLElement>pwdInputs[0].form.querySelector('[class*="submit"]');//works at for instance jetbrains.com
                }
                if (!submitButton) {
                    submitButton = <HTMLElement>pwdInputs[0].form.querySelector('[id*="submit"]');//works at for instance ...??
                }
                if (submitButton) { // If the submitbutton is found: click it!
                    if (thisSite.getDomain() !== 'ebay.nl') {
                        submitButton.click();
                    } else {
                        alert('You will need to click the submit button yourself for this site. This is a known bug in the Ebay.nl-site. Feel free to contribute to this tool by solving it. ' +
                            'See <a href="https://github.com/TimvanSteenbergen/onepasswordforeverysite/issues/38">Issue 38</a>.')
                    }//Does not work on ebay.nl...
                    // pwdInputs[0].form.submit(); //.. but this neither...
                }
            }
        });

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

        // This function checks if the given element is visible
        // Returns a boolean
        function isHidden(el) { // Check if the password-input-field is hidden for the user
            return (el.offsetParent === null)
        }
    }
}
