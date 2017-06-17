/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is PopupForm for webpages having one password-field. We are trying to log in.
 */
class Login extends AbstractForm {
    constructor(thisSite, pwdInputs) {
        super();

        if (pwdInputs.length > 1){
            console.log('Error in Login-form-detection: This loginForm should only have one passwordfield.');
            return
        }

        let pwdInput: HTMLInputElement = pwdInputs[0];
        let userNameInputValue: string = thisSite.getUserId();
        if (userNameInputValue !== '') {

            //todo: Make Finding the username-inputfield as smart as possible
            //... and put it in the user-id inputfield
            let userNameInputElement: HTMLInputElement = <HTMLInputElement>getVisibleUserIdElement('input[type="text"][id*=user]');
            if (!userNameInputElement) {
                userNameInputElement = <HTMLInputElement>getVisibleUserIdElement('input[type="text"][id*=User]');
            }
            if (!userNameInputElement) {
                userNameInputElement = <HTMLInputElement>getVisibleUserIdElement('input[type="text"][id*=id]');
            }
            if (!userNameInputElement) {
                userNameInputElement = <HTMLInputElement>getVisibleUserIdElement('input[type="text"][id*=Id]');
            }
            if (!userNameInputElement) {
                userNameInputElement = <HTMLInputElement>getVisibleUserIdElement('input[type="text"]');
            }
            if (!userNameInputElement) {
                alert('I have not been able to find the input field for the accountname/userid. ' +
                    'Please manually enter the accountname where possible. ');
            }

            if (userNameInputElement) {
                userNameInputElement.value = userNameInputValue;
            }
        } else {
            /** Not possible, every site does have a value in field 'userid'; */
        }

        // then let me ask the Opfes-password, generate the password and put it in the passwordfield.
        let shortMessage: string = `Enter your Opfes-password to log in: `;
        let message: string = `On this site you have logged in previously with user-id ${thisSite.getUserId()}. ` +
            `After you have entered your Opfes-password, I will generate your password for this site, ` +
            `put it in the password-inputfield and press the submit-button. If all goes well ` +
            `you will then be logged in to this site.`;

        /**todo
         * Determine the place of the passwordbox here and pass it on to the showPopupForm
         */
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

        //This function returns the userNameInputElement. The first visible inputElement in the password-wrapping form
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

    private static generatePasswordAndLogin(thisSite, pwdInput: HTMLInputElement) {
        let opfesPassword: string = (<HTMLInputElement>document.getElementById('OPFES_popup_password')).value;
        let submitButton: HTMLElement;
        let generatedPassword: string;

        AbstractForm.hidePopupForm();
        if (opfesPassword !== null && opfesPassword !== "") {
            generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
            pwdInput.value = generatedPassword;
            // alert (generatedPassword);
            submitButton = this.getSubmitButton(pwdInput);
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
    }

}
