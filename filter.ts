/**
 * Created by tvansteenbergen on 2017-03-09.
 */
// Google's bad word filter:
// https://gist.githubusercontent.com/jamiew/1112488/raw/7ca9b1669e1c24b27c66174762cb04e14cf05aa7/google_twunter_lol

// Runs decoratePasswordInputElements on the document
function decoratePasswordInputElements():HTMLInputElement[]{
    let result = [];
    let inputs = document.getElementsByTagName("input");
    let pwdCounter:number = 0;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() === "password") {
            pwdCounter++;
            let OPFES_PasswordInputElement:string = `<input id="OPFES_password${pwdCounter}" type="text"/>`;
            let myImage:string = browser.extension.getURL("icons\/opfes_19.png");
            let OPFES_MyImage:string = `<img name="OPFES_myImage" src="${myImage}"/>`;

            // let decoratedElement = new HTMLDivElement();
            let decoratedElement = document.createElement('div');
            decoratedElement.innerHTML = inputs[i].outerHTML + OPFES_PasswordInputElement + OPFES_MyImage;
            decoratedElement.id = `OPFES_password_${i}`;
            inputs[i].parentNode.replaceChild(decoratedElement, inputs[i]);
        }
    }
    return result;
}

// Set up a mutation observer to listen for title changes
// Will fire if framework AJAX stuff switches page title
let createObserver = function() {
    let observer = new MutationObserver((mutations) => {
            // Disconnect the MO so there isn't an infinite title update loop
            // Run title decoratePasswordInputElements again
            // Create a new MO to listen for more changes
            console.log('Mutations!', mutations);
    observer.disconnect();
    observer = null;
    decoratePasswordInputElements;
    createObserver()
});

    observer.observe(
        document.querySelector('title'),
        { subtree: true, characterData: true, childList: true }
    )
};
createObserver();
// browser.extension.getURL('icons\/opfes_19.png');

// Kick off initial page load check
let passwordInputElements = decoratePasswordInputElements;
if (passwordInputElements().length >= 1){
    // nowWhat;
}