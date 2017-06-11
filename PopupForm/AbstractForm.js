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
        let popupForm = document.createElement(`div`);
        popupForm.id = "OPFES_popup_form";
        popupForm.innerHTML =
            `<p><span id='OPFES_popup_short_message'></span>
                <a id="OPFES_popup_read_more" href="#"> read more...</a>
                <a id="OPFES_popup_read_less" href="#"> read less...</a>
                <input id='OPFES_popup_cancel' type='button' value='x'></p>` +
                `<div id="OPFES_popup_read_more_block">
                <p id='OPFES_popup_message'></p>` +
                `<p id='OPFES_popup_password_element'>Enter your Opfes-password to log in: <input id='OPFES_popup_password' type='password' placeholder=''>` +
                `   <input id='OPFES_popup_submit' type='submit' value='Login'></p>` +
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
    static showPopupForm(shortMessage = '', message = '', vpos = '0', hpos = '0', showSubmitPassword = false) {
        if (vpos != '0' || hpos != '0') {
            document.getElementById('OPFES_popup_form').style.top = vpos;
            document.getElementById('OPFES_popup_form').style.right = hpos;
        }
        document.getElementById('OPFES_popup_short_message').innerHTML = shortMessage;
        document.getElementById('OPFES_popup_message').innerHTML = message;
        document.getElementById('OPFES_popup_password_element').style.display = (showSubmitPassword) ? 'block' : 'none';
        document.getElementById('OPFES_popup_form').style.display = 'block';
    }
    static hidePopupForm() {
        document.getElementById('OPFES_popup_form').style.display = 'none';
        return '';
    }
    static readMore() {
        document.getElementById('OPFES_popup_read_more_block').style.display = 'block';
        document.getElementById('OPFES_popup_read_more').style.display = 'none';
        document.getElementById('OPFES_popup_read_less').style.display = 'inline';
    }
    static readLess() {
        document.getElementById('OPFES_popup_read_more_block').style.display = 'none';
        document.getElementById('OPFES_popup_read_more').style.display = 'inline';
        document.getElementById('OPFES_popup_read_less').style.display = 'none';
    }
}
//# sourceMappingURL=AbstractForm.js.map