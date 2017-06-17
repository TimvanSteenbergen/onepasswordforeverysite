/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the template Form used by every other WebPageWithPassword. It contains functions used by all of them:
 */
class UnknownSite extends AbstractForm {

    /**
     * Simply set the message and show the popupForm
     */
    constructor() {
        super();
        let shortMessage: string = `Opfes asks: Can I help you to log in?`;

        let message: string =
            `I, Opfes, recognize this page as a ${(SiteService.getDomain(window.location.href))}-login form, but I have not helped you to login here before.</br>
 If you wish me to help you login to this site as well, then: ` +
            `<ol>` +
            `<li>Login like you used to</li>` +
            `<li>gG to your account-settings to the option where you can change your password.</li>` +
            `<li>Enter your old password</li>` +
            `<li>Let me help you to generate and enter a new strong and safe password</li>` +
            `</ol>`;
        AbstractForm.showPopupForm(shortMessage, message, null, false);
    }
}
