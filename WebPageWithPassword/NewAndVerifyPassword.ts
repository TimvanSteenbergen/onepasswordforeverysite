/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the WebPageWithPassword for webpages having two password-fields: new and verify.
 * We are trying to generate a new password, copy it to both fields and submit the form.
 *
 * Example sites:
 * - fsfe.org: Log in and go to Application Settings
 * - sourcerers.nl: Log in and click button "Edit Profile"
 */
class NewAndVerifyPassword extends AbstractForm {
    thisSite: Site;

    constructor(thisSite, pwdInputs) {
        super();
        if (pwdInputs.length != 2){
            console.log('Error in Password-change-form-detection: This Password-change-form should have two password-fields.');
            return
        }

        this.thisSite = thisSite;

        // Now let me ask the Opfes-password, generate the password and put it in the new and verify passwordfields.
        let shortMessage = `Opfes says: NEW password for "${thisSite.getUserId()}"`;
        let message = `I see two password-fields:<br> - one for your new password and<br>` +
            ` - a second one also for you new password.<br>You just have to enter your opfes-password and I will `+
            `generate a new password for you, fill both fields and submit them.`;
        AbstractForm.showPopupForm(shortMessage, message, pwdInputs[0], true);
        document.getElementById('OPFES_popup_password').focus();
        document.getElementById('OPFES_popup_password').addEventListener('keydown', function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                NewAndVerifyPassword.generatePasswordAndSave(thisSite, pwdInputs);
            }
        });
        document.getElementById('OPFES_popup_submit').addEventListener('click', function () {
            thisSite.setSequenceNr(thisSite.getSequenceNr() + 1);
            NewAndVerifyPassword.generatePasswordAndSave(thisSite, pwdInputs);
        });
    }

    protected static generatePasswordAndSave(thisSite: Site, pwdInputs) {
        let opfesPassword: string = (<HTMLInputElement>document.getElementById('OPFES_popup_password')).value;
        let submitButton: HTMLElement;
        let generatedPassword: string;

        AbstractForm.hidePopupForm();
        if (opfesPassword !== null && opfesPassword !== "") {
            generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
            console.log(`pwd: ${generatedPassword}`);
            pwdInputs[0].value = generatedPassword;
            pwdInputs[1].value = generatedPassword;
            submitButton = this.getSubmitButton(pwdInputs[0]);
            if (submitButton) { // If the submitbutton is found: click it!
                SiteService.persist(thisSite);//Since you changed the sequencenr of this site, save it!
                alert('Please via the ToolbarButton: manually increase the Sequencenumber by 1. See <a href="https://github.com/TimvanSteenbergen/onepasswordforeverysite/issues/58"> github</a>');
                submitButton.click();
            } else {
                this.submitButtonNotFound();
            }
        }
    }
}
