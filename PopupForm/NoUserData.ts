/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the template Form used by every other PopupForm. It contains functions used by all of them:
 */
class NoUserData extends AbstractForm {

    /**
     * Simply set the message and show the popupForm
     */
    constructor() {
        super();
        let message: string =
            `<p>I, Opfes, do see a login form, but you have not yet uploaded your user-data. </p>` +
            `<p>If you are new to Opfes and this is your first website on which you want to use Opfes, then follow these steps: ` +
            `<ul>` +
            `<li>Login like you use to;</li>` +
            `<li>Go to your account-settings option where you can change your password;</li>` +
            `<li>Enter your old password;</li>` +
            `<li>Let me help you to generate and enter a new strong and safe password.</li>` +
            `</ul>` +
            `</p>` +
            `<p>If you are familiar with Opfes and you do have a file containing user-data, then follow these steps:` +
            `<ul>` +
            `<li>In the browser's toolbar click on the Opfes-icon;</li>` +
            `<li>Click on button 'Choose file' located after the text 'Import your data to the browser:';</li>` +
            `<li>Select your file containing user-data;</li>` +
            `<li>And click 'Open'.</li>` +
            `</ul>` +
            `Then refresh this web-page and log in the Opfes way.</p>`;
        AbstractForm.showPopupForm(message, false);
    }
}
