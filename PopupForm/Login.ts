/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is PopupForm for webpages having one password-field. We are trying to log in.
 */
class Login extends AbstractForm {
    constructor(thisSite, pwdInputs) {
        super();

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
                userNameInputElement = getVisibleUserIdElement('input');
            }

            if (userNameInputElement) {
                userNameInputElement.value = userNameInputValue;
            } else {
                alert('I have not been able to find the input field for the accountname/userid. ' +
                    'Please manually enter the accountname where possible. ');
                return;
            }
        } else {
            /** Not possible, every site does have a value in field 'userid'; */
        }

        // then let me ask the Opfes-password, generate the password and put it in the passwordfield.
        let shortMessage: string = `Opfes asks: Can I help you to log in?`;
        let message: string = `On this site you have logged in previously with user-id ${thisSite.getUserId()}`;

        /**todo
         * Determine the place of the passwordbox here and pass it on to the showPopupForm
         */
        let popupLeft = window.innerWidth - 306 -
            (<HTMLInputElement>document.getElementById(pwdInputs[0].name)).getBoundingClientRect().right;
        let popupTop =
            (<HTMLInputElement>document.getElementById(pwdInputs[0].name)).getBoundingClientRect().top;

        AbstractForm.showPopupForm(shortMessage, message, `${popupTop}px`, `${popupLeft}px` , true);
        document.getElementById('OPFES_popup_password').focus();
        document.getElementById('OPFES_popup_password').addEventListener('keydown', function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                Login.generatePasswordAndLogin(thisSite, pwdInputs);
            }
        });
        document.getElementById('OPFES_popup_submit').addEventListener('click', function () {
            Login.generatePasswordAndLogin(thisSite, pwdInputs);
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

    private static generatePasswordAndLogin(thisSite, pwdInputs) {
        let opfesPassword: string = (<HTMLInputElement>document.getElementById('OPFES_popup_password')).value;
        let submitButton: HTMLElement;
        let generatedPassword: string;

        AbstractForm.hidePopupForm();
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
    }
}
