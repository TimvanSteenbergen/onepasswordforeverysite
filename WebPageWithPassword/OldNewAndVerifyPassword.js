/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the WebPageWithPassword for webpages having three password-fields: old, new and verify.
 * We are trying to generate a new password, copy it to both fields and submit the form.
 *
 * Example sites:
 * - npmjs.com, log in and got to Profile settings, and to tab Password
 * - toernooi.nl when changing your password.
 *
 */
class OldNewAndVerifyPassword extends AbstractForm {
    constructor(thisSite, pwdInputs) {
        super();
        if (pwdInputs.length != 3) {
            console.log('Error in Password-change-form-detection: This Password-change-form should have three password-fields.');
            return;
        }
        // Now let me ask the Opfes-password, generate the password and put it in the new and verify password-fields.
        let shortMessage = `Opfes says: get a NEW password for '${thisSite.getUserId()}'`;
        let message = `I see three password-fields:<br>` +
            ` - one for your current password<br>` +
            ` - one for your new password<br>` +
            ` - a third one also for you new password.<br>You just have to enter your opfes-password and I will ` +
            `generate a new password for you, fill both fields and submit them.`;
        AbstractForm.showPopupForm(shortMessage, message, pwdInputs[0], true);
        document.getElementById('OPFES_popup_password').focus();
        document.getElementById('OPFES_popup_password').addEventListener('keydown', function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                OldNewAndVerifyPassword.generatedPasswordAndPutInCurrent(thisSite, pwdInputs[0]);
                NewAndVerifyPassword.generatePasswordAndSubmit(thisSite, [pwdInputs[1], pwdInputs[2]]);
            }
        });
        document.getElementById('OPFES_popup_submit').addEventListener('click', function () {
            NewAndVerifyPassword.generatePasswordAndSubmit(thisSite, pwdInputs);
        });
    }
    static generatedPasswordAndPutInCurrent(thisSite, pwdInput) {
        let opfesPassword = document.getElementById('OPFES_popup_password').value;
        let generatedPassword;
        if (opfesPassword !== null && opfesPassword !== "") {
            generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
            pwdInput.value = generatedPassword;
        }
    }
}
//# sourceMappingURL=OldNewAndVerifyPassword.js.map