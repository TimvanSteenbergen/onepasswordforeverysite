/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the template Form used by every other PopupForm. It contains functions used by all of them:
 */
class UnknownSite extends AbstractForm {
    /**
     * Simply set the message and show the popupForm
     */
    constructor() {
        super();
        let shortMessage = `Opfes asks: Can I help you to log in?`;
        let message = `I, Opfes, recognize this page as a login form, but you have not yet logged in to this ${(SiteService.getDomain(window.location.href))} using my assistance. If you wish to do so, then: ` +
            `<ol>` +
            `<li>login like you used to</li>` +
            `<li>go to your account-settings to the option where you can change your password.</li>` +
            `<li>enter your old password</li>` +
            `<li>Let me help you to generate and enter a new strong and safe password</li>` +
            `</ol>`;
        AbstractForm.showPopupForm(shortMessage, message, null, false);
    }
}
//# sourceMappingURL=UnknownSite.js.map