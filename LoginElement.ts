/**
 * Created by tvansteenbergen on 2017-03-09.
 */

// Runs decoratePasswordInputElements on the document
function decoratePasswordInputElements(): HTMLInputElement[] {
    let result = [];
    let inputs = document.getElementsByTagName("input");
    let pwdCounter: number = 0;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() === `password`
            && inputs[i].id.substring(0, 5) !== `OPFES`) {
            pwdCounter++;
            let OPFES_PasswordInputElement: string = `<input id="OPFES_password_${pwdCounter}_input" type="password" style="border:1px solid brown";/>`;
            let customerBrowser = get_browser();
            let myImage: string = chrome.extension.getURL("icons\/opfes_19.png");
            if (customerBrowser.name === 'Chrome') {
                myImage = chrome.extension.getURL("icons\/opfes_19.png");
            } else {
                myImage = browser.extension.getURL("icons\/opfes_19.png");
            }
            let OPFES_MyImage: string = `<img name="OPFES_myImage" src="${myImage}"/>`;

            // let decoratedElement = new HTMLDivElement();
            let decoratedElement = document.createElement(`div`);
            decoratedElement.innerHTML = OPFES_PasswordInputElement + OPFES_MyImage;
            decoratedElement.id = `OPFES_password_${pwdCounter}_div`;
            inputs[i].parentNode.appendChild(decoratedElement);
        }
    }
    return result;
}

// Set up a mutation observer to listen for title changes
// Will fire if framework AJAX stuff switches page title
let createObserver = function () {
    let observer = new MutationObserver((mutations) => {
        // Disconnect the MO so there isn't an infinite title update loop
        // Run title decoratePasswordInputElements again
        // Create a new MO to listen for more changes
        console.log(`Mutations!`, mutations);
        observer.disconnect();
        observer = null;
        decoratePasswordInputElements;
        createObserver()
    });

    observer.observe(
        document.querySelector(`title`),
        {subtree: true, characterData: true, childList: true}
    )
};
createObserver();
// browser.extension.getURL(`icons\/opfes_19.png`);

// Kick off initial page load check
let passwordInputElements = decoratePasswordInputElements;
if (passwordInputElements().length >= 1) {
    // nowWhat;
}/**
 * Created by Tim on 2017-03-18.
 */
