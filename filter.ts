/**
 * Created by tvansteenbergen on 2017-03-09.
 */
// Google's bad word filter:
// https://gist.githubusercontent.com/jamiew/1112488/raw/7ca9b1669e1c24b27c66174762cb04e14cf05aa7/google_twunter_lol
let badWords = "w3schools|david|walsh|jquery.....".split('|'); // loool

// Runs getPasswordInputElements on the document title
function getPasswordInputElements():HTMLInputElement[]{
    let result = [];
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() === "password") {
            result.push(inputs[i]);
        }
    }
    return result;
}

function helpUserToLogon(elements:HTMLInputElement[]):void{
    for (let element of elements){
        let decoratedElement: HTMLDivElement = new HTMLDivElement;
        decoratedElement.innerHTML = `${element}`;
        decoratedElement.id = `OPFES_password_1`;
    }
}

// Set up a mutation observer to listen for title changes
// Will fire if framework AJAX stuff switches page title
let createObserver = function() {
    let observer = new MutationObserver((mutations) => {
            // Disconnect the MO so there isn't an infinite title update loop
            // Run title getPasswordInputElements again
            // Create a new MO to listen for more changes
            console.log('Mutations!', mutations);
    observer.disconnect();
    observer = null;
    getPasswordInputElements;
    createObserver()
});

    observer.observe(
        document.querySelector('title'),
        { subtree: true, characterData: true, childList: true }
    )
};
createObserver();

// Kick off initial page load check
let passwordInputElements = getPasswordInputElements;
if (passwordInputElements().length >= 1){
    helpUserToLogon(passwordInputElements);
}