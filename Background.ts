/**
 * Created by tvansteenbergen on 2017-03-22.
 */
//See https://developer.chrome.com/extensions/messaging
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.pleaseGiveMe == "thePassword"){
            sendResponse({itIs: "asdfasdfasdf"});
        }
        if (request.pleaseGiveMe == "theUserid"){
            sendResponse({itIs: "tim@tieka.nl"});
        }
    }
);
