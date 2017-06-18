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
        let popupForm = document.createElement(`div`);
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
        });
    }
    /**
     * This function displays the popupForm and sets the texts and buttons on it.
     *
     * @param shortMessage string Text that will get shown on the first line
     * @param message string Text that will get shown on the 'read more...'-part of the popupForm
     * @param passwordInputElement HTMLInputElement The element into which the password can get entered.
     * @param showSubmitPassword boolean Show or hide the passwordField and Login-button
     */
    static showPopupForm(shortMessage = '', message = '', passwordInputElement = null, showSubmitPassword = false) {
        let popupForm = document.getElementById('OPFES_popup_form');
        if (passwordInputElement == null) {
            popupForm.style.top = '0';
            popupForm.style.right = '0';
        }
        else {
            // let passwordInputElement = (<HTMLInputElement>document.getElementById(passwordInputElement));
            if (passwordInputElement) {
                popupForm.style.top = `${passwordInputElement.getBoundingClientRect().top}px`;
                popupForm.style.left = `${passwordInputElement.getBoundingClientRect().right}px`;
            }
            else {
                popupForm.style.top = `50px`;
                popupForm.style.left = `45%`;
            }
        }
        document.getElementById('OPFES_popup_short_message').innerHTML = shortMessage;
        document.getElementById('OPFES_popup_message').innerHTML = message;
        document.getElementById('OPFES_popup_password_element').style.display = (showSubmitPassword) ? 'block' : 'none';
        document.getElementById('OPFES_popup_form').style.display = 'block';
    }
    /**
     * This function refreshes the popupForm and sets the texts and buttons on it.
     *
     * @param shortMessage string Text that will get shown on the first line
     * @param message string Text that will get shown on the 'read more...'-part of the popupForm
     * @param passwordInputElement HTMLInputElement The element into which the password can get entered.
     * @param showSubmitPassword boolean Show or hide the passwordField and Login-button
     */
    static changeMessages(shortMessage = '', message = '', passwordInputElement = null, showSubmitPassword = false) {
        document.getElementById('OPFES_popup_short_message').innerHTML = shortMessage;
        document.getElementById('OPFES_popup_message').innerHTML = message;
        document.getElementById('OPFES_popup_password_element').style.display = (showSubmitPassword) ? 'block' : 'none';
        document.getElementById('OPFES_popup_form').style.display = 'block';
        if (shortMessage == '') {
            this.readMore();
        }
    }
    /**
     * This function hides the popupForm entirely. Of course this function is used by the Form's close-button
     */
    static hidePopupForm() {
        document.getElementById('OPFES_popup_form').style.display = 'none';
        return '';
    }
    /**
     * This function unhides the longer message in the popupForm
     */
    static readMore() {
        document.getElementById('OPFES_popup_read_more_block').style.display = 'block';
        document.getElementById('OPFES_popup_read_more').style.display = 'none';
        document.getElementById('OPFES_popup_read_less').style.display = 'inline';
        document.getElementById('OPFES_popup_form').style.width = 'auto';
    }
    /**
     * This function hides the longer message in the popupForm
     */
    static readLess() {
        document.getElementById('OPFES_popup_read_more_block').style.display = 'none';
        document.getElementById('OPFES_popup_read_more').style.display = 'inline';
        document.getElementById('OPFES_popup_read_less').style.display = 'none';
    }
    /**
     * This function returns the login button that is related to the given passwordInputField
     *
     * @param pwdInput passwordInputField for which we want to find the related submitButton
     * @returns {HTMLInputElement|null} either the found submitButton or null if no submitButton is found
     */
    static getSubmitButton(pwdInput) {
        let submitButton;
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
     * @param thisElement The Form or entire document in which the search for the submitButton will take place
     * @param pwdInput HTMLInputElement The element next to which the submitButton will be
     * @returns {null}
     */
    static getSubmitButtonFrom(thisElement, pwdInput) {
        let submitButtons = [];
        let selectedElements = thisElement.querySelectorAll('[type="submit"],[class*="submit"],[id*="submit"]');
        let submitButton = null;
        for (let element of selectedElements) {
            if (element.id != 'OPFES_popup_submit') {
                submitButtons.push(element);
            }
        }
        if (submitButtons.length == 1) {
            // Only one button here, so that is the one! Return it.
            submitButton = submitButtons[0];
        }
        else if (submitButtons.length >= 2) {
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
    static getSubmitButtonClosestTo(eligibleButtons, closeToThis) {
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
                return button;
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
}
//# sourceMappingURL=AbstractForm.js.map