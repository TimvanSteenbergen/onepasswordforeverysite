/**
 * Created by Tim van Steenbergen on 21-1-2017.
 */
// declare function SHA512(string): string;
let a: number = 1;
///<reference path="chrome/index.d.ts"/>

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
        if(response){
            console.log(`received response: ${response.farewell}`);
        } else {
            console.log(`received response: No response recieved`);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {

    let userData: UserData = JSON.parse(localStorage.getItem("OPFES_UserData"), UserData.reviver);
    if (userData.sites.length === 0) { //then show the Upload-button
        console.log('Ik heb nog geen data gevonden.');
    } else { //then show the userData in the popup screen
        console.log('Ik heb data gevonden.');
        // document.getElementById('OPFES_InputGetUserData').hidden;
        OPFES_WorkWithUserData(userData);
    }

    function toggleChangability() {
        // showTheLocallyStoredData(userData);
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    }

    document.getElementById('OPFES_InputDomainToggle').addEventListener('click', function () {
        // showTheLocallyStoredData(userData);
        toggleChangability.call(this);
    });
    document.getElementById('OPFES_InputSaltToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFES_InputUserIdToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFES_InputSequenceNrToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFES_SelectMaxPwdCharsToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFES_InputRemarkToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFES_InputAppPasswordShow').addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 4);
        let elementToToggle = document.getElementById(elementId);
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('OPFES_InputAppPasswordShow').setAttribute('disabled', 'disabled');
        document.getElementById('OPFES_InputAppPasswordHide').removeAttribute('disabled');
    });
    document.getElementById('OPFES_InputAppPasswordHide').addEventListener('click', function () {
        let elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('OPFES_InputAppPasswordShow').removeAttribute('disabled');
        document.getElementById('OPFES_InputAppPasswordHide').setAttribute('disabled', 'disabled');
    });

    /**
     * This links the UserData-download function to the export button
     */
    document.getElementById("OPFES_CopyDiskToLocalStorageButton").addEventListener("change", function (event) {
        event.preventDefault();
        UserData.upload((<HTMLInputElement>this).files[0]);
    }, false);

    /**
     * This links the UserData-download function to the export button
     */
    document.getElementById("OPFES_CopyLocalStorageToDiskButton").addEventListener("click", function (event) {
        event.preventDefault();
        UserData.download();
    }, false);

    /**
     * This links the Password-download function to the export button
     */
    document.getElementById("OPFES_CopyPasswordsToDiskButton").addEventListener("click", function (event) {
        event.preventDefault();
        UserData.downloadPasswords();
    }, false);
}, false);

let OPFES_WorkWithUserData = function (userData: UserData) {
    console.log('addEventListener gestart en zo, userdata\'s eerste domein is ' + userData.sites[0].getDomain());

    showTheLocallyStoredData(userData, 5);
    setValueForElementDomain();
    function setValueForElementDomain() {
        let customerBrowser = get_browser();
        let myBrowser;
        if (customerBrowser.name === 'Chrome') {
            myBrowser = chrome;
        } else {
            myBrowser = browser;
        }
        myBrowser.tabs.query({active: true}, function (tabs) {
            let ourPopup = document;
            let domain = getDomain(tabs[0].url);
            let domainElement = ourPopup.getElementById('OPFES_InputDomain');
            domainElement.setAttribute('value', domain);
            setValueForElements(domain);

            //This function will abstract the domain-part from the url
            function getDomain(url)
            //This function gets the domainname from the url.
            //Can't use "window.location.host" because this will return the domain of the OnePasswordForEverySiteApp.html
            //@todo: solve issue #27, www.amazon.co.uk -> now co.uk instead of amazon.co.uk
            {
                let domain = url.match(/:\/\/(.[^/]+)/)[1];
                //remove the sub-domain(s)
                let numberOfDotsInDomain = (domain.match(/\./g) || []).length;
                for (let dot = 1; dot < numberOfDotsInDomain; dot++) {
                    domain = domain.substr(domain.indexOf('.') + 1, domain.length);
                }
                return domain;
            }

            function setValueForElements(domain) {
                let userData = UserData.retrieve();
                let sites = userData.sites;
                for (let site of sites) {
                    if (site.getDomain() == domain) {
                        //Set the values of the other input-fields on the popup-screen
                        document.getElementById('OPFES_InputDomain').setAttribute('disabled', "disabled");
                        if (site.getSalt() != "") {
                            document.getElementById('OPFES_InputSalt').setAttribute('value', site.getSalt());
                            document.getElementById('OPFES_InputSalt').setAttribute('disabled', "disabled");
                        }
                        if (site.getUserId() != "") {
                            document.getElementById('OPFES_InputUserId').setAttribute('value', site.getUserId());
                            document.getElementById('OPFES_InputUserId').setAttribute('disabled', "disabled");
                        }
                        if (site.getSequenceNr() != 0) {
                            document.getElementById('OPFES_InputSequenceNr').setAttribute('value', (site.getSequenceNr() + ""));
                            document.getElementById('OPFES_InputSequenceNr').setAttribute('disabled', "disabled");
                        }
                        (<HTMLSelectElement>document.getElementById('OPFES_SelectMaxPwdChars')).selectedIndex = site.getMaxPwdChars();
                        document.getElementById('OPFES_SelectMaxPwdChars').setAttribute('disabled', "disabled");
                        if (site.getRemark() != "") {
                            document.getElementById('OPFES_InputRemark').setAttribute('value', site.getRemark());
                            document.getElementById('OPFES_InputRemark').setAttribute('disabled', "disabled");
                        }
                    }
                }
            }
        });
    }

    /**
     * This function retrieves the locally stored sites, changes the popup to:
     * - only show numOfLines of the sites
     * - show the "..." if some sites are not shown
     * @param userData
     * @param numOfSitesToShow Number of sites to show in the OnePasswordForEverySiteApp.html
     */
    function showTheLocallyStoredData(userData: UserData, numOfSitesToShow: number = 999999) {
        let sites: Site[] = userData.sites;
        let dataTableHTML: string = "<table id='locallyStoredUserData' border='1px solid brown'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>#chars</td><td>used at</td></ts><td>remark</td></thead>";
        let sitesToShow = sites.slice(0, numOfSitesToShow);
        for (let site of sitesToShow) {
            dataTableHTML += `<tr><td>${site.getDomain()}</td>
                                 <td>${site.getSalt()}</td>
                                 <td>${site.getUserId()}</td>
                                 <td>${site.getSequenceNr()}</td>
                                 <td>${site.getMaxPwdChars()}</td>
                                 <td>${site.getLastUsed().getFullYear()} ${site.getLastUsed().getMonth() + 1} ${site.getLastUsed().getDate()}</td>
                                 <td>${site.getRemark()}</td>
                             </tr>`;
        }
        if (sites.length > numOfSitesToShow) {
            document.getElementById('OPFES_ShowAllTheLocallyStoredData').setAttribute('style', "display: inline");
        } else {
            document.getElementById('OPFES_ShowAllTheLocallyStoredData').setAttribute('style', "display: none");
        }
        dataTableHTML += '</table>';
        document.getElementById('OPFES_localStoredUserData').innerHTML = dataTableHTML;
    }

    document.getElementById('OPFES_ShowAllTheLocallyStoredData').addEventListener('click', function () {
        showTheLocallyStoredData(userData, 100000);
    });

    /* The functions for the buttons to Copy LocalStorage to disk and back again, (OPFES_CopyLocalStorageToDiskButton and
     * OPFES_CopyDiskToLocalStorageButton) are defined in their own files. */

    /*
     * Upon clicking the loginButton, generate the password using the domain-name, salt, userId and sequenceNr,
     * show the password in a popup and save the (changed) domain-data to the LocalStorage,
     * N.B. of course not saving the password!
     */
    document.getElementById('OPFES_LoginButton').addEventListener('click', function () {
        let ourPopup = document;
        let site = new Site(
            (<HTMLInputElement>ourPopup.getElementById('OPFES_InputDomain')).value,
            (<HTMLInputElement>ourPopup.getElementById('OPFES_InputSalt')).value,
            (<HTMLInputElement>ourPopup.getElementById('OPFES_InputUserId')).value,
            +(<HTMLInputElement>ourPopup.getElementById('OPFES_InputSequenceNr')).value,
            +(<HTMLSelectElement>ourPopup.getElementById('OPFES_SelectMaxPwdChars')).value,
            new Date(Date.now()),
            (<HTMLInputElement>ourPopup.getElementById('OPFES_InputRemark')).value
        );

        let inputValueAppPassword = (<HTMLInputElement>ourPopup.getElementById('OPFES_InputAppPassword')).value;
        //save the sites data every time the password gets generated
        // siteService.add(site)
        let siteUpserted: boolean = false;
        for (let key in userData.sites) {
            if (userData.sites[key]["domain"] == site.getDomain()) {
                userData.sites[key] = site;
                siteUpserted = true;
            }
        }
        if (!siteUpserted) {
            userData.sites.push(site);
        }
        userData.persist();

        let sitePassword = SiteService.getSitePassword(site, inputValueAppPassword);
        window.prompt('The password for this site for this user-id is: ' + sitePassword + ' To copy the password to your clipboard: Ctrl+C, Enter', sitePassword);
        let passwordElement = ourPopup.getElementById('OPFES_InputSitePassword');
        passwordElement.setAttribute("value", sitePassword);
        // Insert the sitePassword in the password-input field in the document
        // insertPwd(sitePassword, passwordElement);

    }, false);
};

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     alert('Listener toegevoegd!');
//     console.log('listening');
//     if (request.method == "getLocalStorage") {
//         console.log('getting localStorage');
//         sendResponse({data: localStorage[request.key]});
//         console.log('sending it back including data');
//     } else {
//         console.log('snubbing...');
//         sendResponse({}); // snub them.
//     }
// });