/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the template Form used by every other WebPageWithPassword. It contains functions used by all of them:
 * - Show or Hide the form
 * - Show or hide the passwordField and Login button
 * - Finds the usernameField related to the passwordField
 * - Finds the submitButton related to the passwordField
 */
class AbstractForm {
    constructor() {

        /**
         * Adding the popup for user-interaction
         * @type {HTMLDivElement}
         */
        let popupForm: HTMLDivElement = <HTMLDivElement>document.createElement(`div`);
        popupForm.id = "OPFES_popup_form";
        popupForm.innerHTML =
            `<p><span id='OPFES_popup_short_message'></span>` +
            `<input id='OPFES_popup_cancel' type='button' value='X'>` +
            `<span id='OPFES_popup_password_element'><input id='OPFES_popup_password' type='password' placeholder=''>` +
            `   <input id='OPFES_popup_submit' type='submit' value='Login'></span>` +
            `<a id="OPFES_popup_read_more" href="#"> read more...</a>` +
            `<a id="OPFES_popup_read_less" href="#"> read less...</a>` +
            `</p>` +
            `<div id="OPFES_popup_read_more_block">
                <p id='OPFES_popup_message'></p>` +
            `<p>For more information go to <a href="http://www.opfes.com">Opfes.com</a>` +
            `</div>`;
        document.body.appendChild(popupForm);

        document.getElementById('OPFES_popup_cancel').addEventListener('click', function () {
            AbstractForm.hidePopupForm();
        });

        document.getElementById('OPFES_popup_read_more').addEventListener('click', function () {
            AbstractForm.readMore();
        });
        document.getElementById('OPFES_popup_read_less').addEventListener('click', function () {
            AbstractForm.readLess();
        })
    }

    /**
     * This function displays the popupForm and sets the texts and buttons on it.
     *
     * @param shortMessage string Text that will get shown on the first line
     * @param message string Text that will get shown on the 'read more...'-part of the popupForm
     * @param passwordInputElement HTMLInputElement The element into which the password can get entered.
     * @param showSubmitPassword boolean Show or hide the passwordField and Login-button
     */
    static showPopupForm(shortMessage = '', message = '', passwordInputElement: HTMLInputElement = null, showSubmitPassword: boolean = false) {
        let popupForm = (<HTMLFormElement>document.getElementById('OPFES_popup_form'));
        if (passwordInputElement == null) {
            popupForm.style.top = '0';
            popupForm.style.right = '0';
        } else {
            // let passwordInputElement = (<HTMLInputElement>document.getElementById(passwordInputElement));
            if (passwordInputElement) {
                popupForm.style.top = `${passwordInputElement.getBoundingClientRect().top}px`;
                popupForm.style.left = `${passwordInputElement.getBoundingClientRect().right}px`;
            } else {
                popupForm.style.top = `50px`;
                popupForm.style.left = `45%`;
            }

        }
        (<HTMLElement>document.getElementById('OPFES_popup_short_message')).innerHTML = shortMessage;
        (<HTMLElement>document.getElementById('OPFES_popup_message')).innerHTML = message;
        (<HTMLElement>document.getElementById('OPFES_popup_password_element')).style.display = (showSubmitPassword) ? 'block' : 'none';
        (<HTMLElement>document.getElementById('OPFES_popup_form')).style.display = 'block';
    }

    /**
     * This function refreshes the popupForm and sets the texts and buttons on it.
     *
     * @param shortMessage string Text that will get shown on the first line
     * @param message string Text that will get shown on the 'read more...'-part of the popupForm
     * @param passwordInputElement HTMLInputElement The element into which the password can get entered.
     * @param showSubmitPassword boolean Show or hide the passwordField and Login-button
     */
    static changeMessages(shortMessage = '', message = '', passwordInputElement: HTMLInputElement = null, showSubmitPassword: boolean = false) {
        (<HTMLElement>document.getElementById('OPFES_popup_short_message')).innerHTML = shortMessage;
        (<HTMLElement>document.getElementById('OPFES_popup_message')).innerHTML = message;
        (<HTMLElement>document.getElementById('OPFES_popup_password_element')).style.display = (showSubmitPassword) ? 'block' : 'none';
        (<HTMLElement>document.getElementById('OPFES_popup_form')).style.display = 'block';
        if (shortMessage == '') {
            this.readMore()
        }
    }

    /**
     * This function hides the popupForm entirely. Of course this function is used by the Form's close-button
     */
    static hidePopupForm(): string {
        document.getElementById('OPFES_popup_form').remove();
        return '';
    }

    /**
     * This function unhides the longer message in the popupForm
     */
    static readMore() {
        (<HTMLElement>document.getElementById('OPFES_popup_read_more_block')).style.display = 'block';
        (<HTMLElement>document.getElementById('OPFES_popup_read_more')).style.display = 'none';
        (<HTMLElement>document.getElementById('OPFES_popup_read_less')).style.display = 'inline';
        (<HTMLElement>document.getElementById('OPFES_popup_form')).style.width = 'auto';
    }

    /**
     * This function hides the longer message in the popupForm
     */
    static readLess() {
        (<HTMLElement>document.getElementById('OPFES_popup_read_more_block')).style.display = 'none';
        (<HTMLElement>document.getElementById('OPFES_popup_read_more')).style.display = 'inline';
        (<HTMLElement>document.getElementById('OPFES_popup_read_less')).style.display = 'none';
    }

    /**
     * This function returns the login button that is related to the given passwordInputField
     *
     * @param pwdInput passwordInputField for which we want to find the related submitButton
     * @returns {HTMLInputElement|null} either the found submitButton or null if no submitButton is found
     */
    protected static getSubmitButton(pwdInput: HTMLInputElement) {

        let submitButton: HTMLInputElement | void;

        // Try to find the submit-button on the form surrounding the password-field...
        if (pwdInput.form) {
            submitButton = this.getSubmitButtonFrom(pwdInput.form, pwdInput);
            if (submitButton) {
                return submitButton;
            }
        }

        // Seems like no submitButton is found yet... Next attempt:
        // Try to find the submit-buttons in the entire page,
        submitButton = this.getSubmitButtonFrom(document, pwdInput);
        if (submitButton) {
            return submitButton;
        }

        //No button determined! Should never arrive here but Murphy learns us that eventually we will. So let's handle this situation
        return null;
    }

    /**
     * This function looks for the submitButton in the given parent-element, next to the given passwordField
     *
     * @param thisElement ParentElement, The Form or entire document in which the search for the submitButton will take place
     * @param pwdInput HTMLInputElement The element next to which the submitButton will be
     * @returns {null}
     */
    private static getSubmitButtonFrom(thisElement, pwdInput: HTMLInputElement) {
        let submitButtons: HTMLInputElement[] = [];
        let selectedElements = thisElement.querySelectorAll(
            `[id*="submit"],` +
            `[type="submit"],` +
            `[class*="submit"],` +
            `[class*="login-button"]` //Used by: Joomla-sites
        );
        let submitButton = null;
        for (let element of selectedElements) {
            if (element.id != 'OPFES_popup_submit') {//Prevent our own popupForm-submitButton to get selected
                submitButtons.push(<HTMLInputElement>element);
            }
        }
        if (submitButtons.length == 1) {
            // Only one button here, so that is the one! Return it.
            submitButton = <HTMLInputElement>submitButtons[0];
        } else if (submitButtons.length >= 2) {
            submitButton = this.getSubmitButtonClosestTo(submitButtons, pwdInput);
        }
        return submitButton;
    }

    /**
     * This function takes an array of HTMLInputElements and selects the one that is most likely the submitButton
     * that belongs to the closeToThis-element, usually a passwordField.
     *
     * @param eligibleButtons HTMLInputElement[] The set of elements to choose from
     * @param closeToThis HTMLInputElement The element next to which the submitButton will be located
     * @returns {HTMLInputElement|null}
     */
    private static getSubmitButtonClosestTo(eligibleButtons: HTMLInputElement[],
                                            closeToThis: HTMLInputElement) {
        let top = closeToThis.getBoundingClientRect().top;
        let bottom = closeToThis.getBoundingClientRect().bottom;
        let left = closeToThis.getBoundingClientRect().left;
        let right = closeToThis.getBoundingClientRect().right;
        let width = closeToThis.getBoundingClientRect().width;
        let height = closeToThis.getBoundingClientRect().height;

        //select the button that is under the closeToThis-element, but not too far away (within five times the height)
        for (let button of eligibleButtons) {
            if (button.getBoundingClientRect().left >= left - 20
                && button.getBoundingClientRect().left <= right + 20
                && button.getBoundingClientRect().top > bottom
                && button.getBoundingClientRect().top < bottom + (height * 5)) {
                return <HTMLInputElement>button;
            }
        }

        //select the button that is to the right the closeToThis-element, but not too far away (within three times the width)
        for (let button of eligibleButtons) {
            if (button.getBoundingClientRect().top >= top - 10
                && button.getBoundingClientRect().top <= bottom + 10
                && button.getBoundingClientRect().right > left
                && button.getBoundingClientRect().right < left + (width * 3)) {
                return button;
            }
        }

        //No button determined! Should never arrive here but Murphy learns us that eventually we will. So let's handle this situation
        return null;
    }

    protected static submitButtonNotFound() {
        let shortMessage = (`Sorry! I have not been able to find the submit-button. You will have to click it yourself.`);
        let message = (`Your userid and password are ready to login. All you have to do is click the submit button yourself.<br>` +
        `<br>` +
        `Can you please inform me about this via <a href="https://opfes.com/bugreport">https://opfes.com/bugreport</a> ` +
        `so I can try to solve this issue.`);
        AbstractForm.changeMessages(shortMessage, message, null, false);
    }

    protected static generatePasswordAndSubmit(thisSite, pwdInputs) {
        let opfesPassword: string = (<HTMLInputElement>document.getElementById('OPFES_popup_password')).value;
        let submitButton: HTMLElement;
        let generatedPassword: string;
        let shortMessage: string;
        let message: string;

        if (opfesPassword !== null && opfesPassword !== "") {
            generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
            let pwdInput:HTMLInputElement = null;
            for (pwdInput of pwdInputs) {
                pwdInput.value = generatedPassword;
            }
            // alert (generatedPassword);
            submitButton = this.getSubmitButton(pwdInputs[0]);
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
