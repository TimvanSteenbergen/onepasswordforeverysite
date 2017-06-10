/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the template Form used by every other PopupForm. It contains functions used by all of them:
 */
class AbstractForm {
    constructor() {

        /**
         * Adding the popup for user-interaction
         * @type {HTMLDivElement}
         */
        let popupForm: HTMLDivElement = <HTMLDivElement>document.createElement(`div`);
        let popupOverlay: HTMLDivElement = <HTMLDivElement>document.createElement(`div`);
        popupForm.id = "OPFES_popup_form";
        popupForm.innerHTML =
            `<h1 id="OPFES_popup_title">Hi, Opfes here.</h1>` +
            `<p id='OPFES_popup_message'></p>` +
            `<p id='OPFES_popup_password_element'>Enter your Opfes-password to log in: <input id='OPFES_popup_password' type='password' placeholder=''>` +
            `   <input id='OPFES_popup_submit' type='submit' value='Login'></p>` +
            `<p><input id='OPFES_popup_cancel' type='button' value='Close this popup'></p>`;
        document.body.appendChild(popupForm);
        popupOverlay.id = "OPFES_popup_overlay";
        document.body.appendChild(popupOverlay);

        document.getElementById('OPFES_popup_cancel').addEventListener('click', function(){
            AbstractForm.hidePopupForm();
        })
    }

    static showPopupForm(message = '', showSubmitPassword = false) {
        document.getElementById('OPFES_popup_message').innerHTML = message;
        document.getElementById('OPFES_popup_password_element').style.display = (showSubmitPassword) ? 'block' : 'none';
        document.getElementById('OPFES_popup_form').style.display = 'block';
        document.getElementById('OPFES_popup_overlay').style.display = 'block';
    }

    static hidePopupForm():string {
        document.getElementById('OPFES_popup_form').style.display = 'none';
        document.getElementById('OPFES_popup_overlay').style.display = 'none';
        return '';
    }

}
