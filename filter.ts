/**
 * Created by tvansteenbergen on 2017-03-09.
 */
// Google's bad word filter:
// https://gist.githubusercontent.com/jamiew/1112488/raw/7ca9b1669e1c24b27c66174762cb04e14cf05aa7/google_twunter_lol

// Runs getPasswordInputElements on the document
function getPasswordInputElements():HTMLInputElement[]{
    let result = [];
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() === "password") {
            alert(`found password inputfield on ${i}-th input-field`);
            // let decoratedElement = new HTMLDivElement();
            let decoratedElement = document.createElement('div');
            decoratedElement.innerHTML = `${inputs[i]}`;
            decoratedElement.id = `OPFES_password_${i}`;
            inputs[i].parentNode.replaceChild(decoratedElement, inputs[i]);
            alert('found & replaced password');
        }
    }
    return result;
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
    // nowWhat;
}