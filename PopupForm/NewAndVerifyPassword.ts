/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the PopupForm for webpages having two password-fields: new and verify.
 * We are trying to generate a new password, copy it to both fields and submit the form.
 */
class NewAndVerifyPassword extends AbstractForm {
    constructor(thisSite, pwdInputs) {
        super();

        // Now let me ask the Opfes-password, generate the password and put it in the new and verify passwordfields.
        AbstractForm.showPopupForm(`Let's create a new password for userid '${thisSite.getUserId()}'`, true);
        document.getElementById('OPFES_popup_password').focus();
        document.getElementById('OPFES_popup_password').addEventListener('keydown', function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                NewAndVerifyPassword.generatePasswordAndSave(thisSite, pwdInputs);
            }
        });
        document.getElementById('OPFES_popup_submit').addEventListener('click', function () {
            NewAndVerifyPassword.generatePasswordAndSave(thisSite, pwdInputs);
        });
    }

    protected static generatePasswordAndSave(thisSite, pwdInputs) {
        let opfesPassword: string = (<HTMLInputElement>document.getElementById('OPFES_popup_password')).value;
        let submitButton: HTMLElement;
        let generatedPassword: string;

        AbstractForm.hidePopupForm();
        if (opfesPassword !== null && opfesPassword !== "") {
            generatedPassword = SiteService.getSitePassword(thisSite, opfesPassword);
            pwdInputs[0].value = generatedPassword;
            pwdInputs[1].value = generatedPassword;
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
