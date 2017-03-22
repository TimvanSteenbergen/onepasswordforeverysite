/**
 * Created by tvansteenbergen on 2017-03-22.
 */

//See https://developer.chrome.com/extensions/messaging and
// https://developer.chrome.com/extensions/storage#type-StorageArea

// chrome.storage.local.set({
//     "you": "Jane",
//     "me": "timq"
//     // "_sites": [{
//     //     "domain": "gavelsnipe.com",
//     //     "salt": "demo",
//     //     "userId": "demo@opfes.com",
//     //     "sequenceNr": 1,
//     //     "maxPwdChars": 120,
//     //     "lastUsed": "2017-03-20T11:47:58.859Z",
//     //     "remark": "Demo-account"
//     // }]
// });
//
// chrome.storage.local.get("_sites", function (response) {
//     alert(`Ik: ${response._sites}`);
// });
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.pleaseGiveMe == "thePassword") {
            sendResponse({itIs: "asdfasdfasdf"});
        }
        if (request.pleaseGiveMe == "theUserid") {
            sendResponse({itIs: "tim@tieka.nl"});
        }
    }
);
