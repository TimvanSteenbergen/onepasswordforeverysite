/**
 * Created by Tim van Steenbergen on 21-1-2017.
 */

// declare function SHA512(string): string;
console.log('before DOMContentLoaded');
///<reference path="chrome/index.d.ts"/>

document.addEventListener('DOMContentLoaded', function () {
    let userData: UserData = new UserData(
        [//domain, salt, username, sequencenr, maxPwdChars, lastused, remarks
            new Site("gavelsnipe.com", "koud", "timvans", 1, 120, new Date(2016, 1, 1), ""),
            // new Site("mycloud.com", "hout", "tim@tieka.nl", 1, 30, new Date(2017,2,18), ""),
            // new Site("webassessor.com", "koud", "TimvanSteenbergen", 2, 120, new Date(2016,1,1), ""),//
            // new Site("stackoverflow.com", "koud", "tim@tieka.nl", 1, 120, new Date(2016,1,1), ""),
            // new Site("quora.com", "koud", "tim@tieka.nl", 1, 74, new Date(2016,1,1), "Max 75 karakters in het wachtwoord"),
            // new Site("robbshop.com", "koud", "tim@tieka.nl", 1, 120, new Date(2016,1,1), ""),
            // new Site("lynda.com", "koud", "tim@tieka.nl", 1, 120, new Date(2016,1,1), ""),
            // new Site("nrc.nl", "koud", "elma@tieka.nl", 1, 120, new Date(2016,1,1), ""),
            new Site("ebay.com", "heet", "tivansteenberge_0", 3, 64, new Date(2016, 1, 1), "Max 64 karakters in het wachtwoord"),
            // new Site("ebay.nl", "heet", "tivansteenberge_0", 3, 64, new Date(2016,1,1), "Max 64 karakters in het wachtwoord"),
            // new Site("yetAnotherSite.nl", "koud", "alias24", 1, 120, new Date(2016,1,1), ""),
            // new Site("andOneMore.nl", "koud", "myusernamehere", 1, 120, new Date(2016,1,1), "")
        ]
    );
    // let sites = userData.sites;
    localStorage.setItem('OPFES_UserData', JSON.stringify(userData));
    showTheLocallyStoredData(5);
    setValueForElementDomain();
    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
            // chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
            let ourPopup = document;
            let domain = getDomain(tab.url);

            let domainElement = ourPopup.getElementById('OPFES_InputDomain');
            domainElement.setAttribute('value', domain);

            setValueForElements(domain);

            function getDomain(url)
            //This function gets the domainname from the url.
            //Can't use "window.location.host" because this will return the domain of the OnePasswordForEverySiteApp.html
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
                let sites = userData.getAll;
                for (let site of sites) {
                    if (site.getDomain() == domain) {
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
                        if (site.getMaxPwdChars() != 120) {
                            // <HTMLSelectElement>(document.getElementById('selectMaxPwdChars')).setAttribute('value', <site._maxPwdChars);
                            document.getElementById('OPFES_SelectMaxPwdChars').setAttribute('disabled', "disabled");
                        }
                    }
                }
            }
        });
    }

    function toggleChangability() {
        showTheLocallyStoredData();
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    }

    /**
     * This function retrieves the locally stored sites, changes the popup to:
     * - only show numOfLines of the sites
     * - show the "..." if some sites are not shown
     * @param numOfSitesToShow Number of sites to show in the OnePasswordForEverySiteApp.html
     */
    function showTheLocallyStoredData(numOfSitesToShow: number = 999999) {
        let userData: UserData = JSON.parse(localStorage.getItem("OPFES_UserData"), UserData.reviver);
        let sites: Site[] = userData.sites;
        let dataTableHTML: string = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>maxPwdChars</td><td>used at</td></ts><td>remark</td></thead>";
        let sitesToShow  = sites.slice(0, numOfSitesToShow);
        for (let site of sitesToShow) {
            dataTableHTML += `<tr><td>${site.getDomain()}</td>
                                 <td>${site.getSalt()}</td>
                                 <td>${site.getUserId()}</td>
                                 <td>${site.getSequenceNr()}</td>
                                 <td>${site.getMaxPwdChars()}</td>
                                 <td>${site.getLastUsed()}</td>
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
        showTheLocallyStoredData(100000);
    });

    document.getElementById('OPFES_InputDomainToggle').addEventListener('click', function () {
        showTheLocallyStoredData();
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
            '' //remark
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

});
