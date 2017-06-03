/**
 * Created by tvansteenbergen on 2017-03-09.
 *
 * This is the template Form used by every other PopupForm. It contains functions used by all of them:
 */
class UnknownSite extends AbstractForm{

    /**
     * Simply set the message and show the popupForm
     */
    constructor() {
        super();
        let message: string =
            `I, Opfes, do see a login form, but you have not yet logged in to ${(SiteService.getDomain(window.location.href))} using my assistance. If you wish to do so, then: ` +
            `<ol>` +
            `<li>login like you used to</li>` +
            `<li>go to your account-settings to the option where you can change your password.</li>` +
            `<li>enter your old password</li>` +
            `<li>Let me help you to generate and enter a new strong and safe password</li>` +
            `</ol>`;
        AbstractForm.showPopupForm(message, false);
    }
}
