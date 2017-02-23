/**
 * Created by Tim van Steenbergen on 21-1-2017.
 */

declare function SHA512(string): string;
///<reference path="chrome/index.d.ts"/>
console.log('before DOMContentLoaded');

document.addEventListener('DOMContentLoaded', function () {
    let json:{"sites": Site[]} = {
        "sites": [//domain, salt, username, sequencenr, maxPwdChars, lastused, remarks
            new Site("gavelsnipe.com", "koud", "timvans", 1, 120, new Date("20160101"), ""),
            new Site("mycloud.com", "hout", "tim@tieka.nl", 1, 30, new Date("20170218"), ""),
            new Site("webassessor.com", "koud", "TimvanSteenbergen", 2, 120, new Date("20160101"), ""),//
            new Site("stackoverflow.com", "koud", "tim@tieka.nl", 1, 120, new Date(new Date("20160101")), ""),
            new Site("quora.com", "koud", "tim@tieka.nl", 1, 74, new Date("20160101"), "Max 75 karakters in het wachtwoord"),
            new Site("robbshop.com", "koud", "tim@tieka.nl", 1, 120, new Date("20160101"), ""),
            new Site("lynda.com", "koud", "tim@tieka.nl", 1, 120, new Date("20160101"), ""),
            new Site("nrc.nl", "koud", "elma@tieka.nl", 1, 120, new Date("20160101"), ""),
            new Site("ebay.com", "heet", "tivansteenberge_0", 3, 64, new Date("20160101"), "Max 64 karakters in het wachtwoord"),
            new Site("ebay.nl", "heet", "tivansteenberge_0", 3, 64, new Date("20160101"), "Max 64 karakters in het wachtwoord"),
            new Site("yetanothersite.nl", "koud", "alias24", 1, 120, new Date("20160101"), ""),
            new Site("andonemore.nl", "koud", "myusernamehere", 1, 120, new Date("20160101"), "")
        ]
    };
    let sites = json.sites;
    localStorage.setItem("sites", JSON.stringify(json));
    showTheLocallyStoredData(5);
    setValueForElementDomain();
    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
            // chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
            let ourPopup = document;
            let domain = getDomain(tab.url);

            let domainElement = ourPopup.getElementById('OPFESinputDomain');
            domainElement.setAttribute('value', domain);

            setValueForElements(domain);

            function getDomain(url)
            //This function gets the domainname from the url.
            //Can't use "window.location.host" because this will return the domain of the popup.html
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
                json = JSON.parse(localStorage.getItem("sites"));
                sites = json.sites;
                for (let i = 0; i < sites.length; i++) {
                    let site: Site = new Site(sites[i]["domain"], sites[i]["salt"], sites[i]["userId"], sites[i]["sequenceNr"], sites[i]["maxPwdChars"], sites[i]["usedAt"], sites[i]["remark"] );
                    if (site.getDomain() == domain) {
                        document.getElementById('OPFESinputDomain').setAttribute('disabled', "disabled");
                        if (site.getSalt() != "") {
                            document.getElementById('OPFESinputSalt').setAttribute('value', site.getSalt());
                            document.getElementById('OPFESinputSalt').setAttribute('disabled', "disabled");
                        }
                        if (site.getUserId() != "") {
                            document.getElementById('OPFESinputUserId').setAttribute('value', site.getUserId());
                            document.getElementById('OPFESinputUserId').setAttribute('disabled', "disabled");
                        }
                        if (site.getSequenceNr() != 0) {
                            document.getElementById('OPFESinputSequenceNr').setAttribute('value', (site.getSequenceNr() + ""));
                            document.getElementById('OPFESinputSequenceNr').setAttribute('disabled', "disabled");
                        }
                        if (site.getMaxPwdChars()!= 120) {
                            // <HTMLSelectElement>(document.getElementById('selectMaxPwdChars')).setAttribute('value', <site._maxPwdChars);
                            document.getElementById('OPFESselectMaxPwdChars').setAttribute('disabled', "disabled");
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
     * @param numOfLines Number of lines to show in the popup.html
     */
    function showTheLocallyStoredData(numOfLines) {
        json = JSON.parse(localStorage.getItem("sites"));
        sites = json.sites;
        let dataTableHTML = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>maxPwdChars</td><td>used at</td></ts><td>remark</td></thead>";
        // sites.forEach((dataTableHTML: string, site: Site ): Site => {
        for (let i = 0; i < sites.length && i < numOfLines; i++) {
            let site: Site = new Site(sites[i]["domain"], sites[i]["salt"], sites[i]["userId"], sites[i]["sequenceNr"], sites[i]["maxPwdChars"], sites[i]["usedAt"], sites[i]["remark"] );
            dataTableHTML += '<tr><td>' + site.getDomain() + '</td>';
            dataTableHTML += '<td>' + site.getSalt() + '</td>';
            dataTableHTML += '<td>' + site.getUserId()+ '</td>';
            dataTableHTML += '<td>' + site.getSequenceNr() + '</td>';
            dataTableHTML += '<td>' + site.getMaxPwdChars() + '</td>';
            dataTableHTML += '<td>' + site.getLastUsed() + '</td>';
            dataTableHTML += '<td>' + site.getRemark() + '</td>';
            dataTableHTML += '<td>' + '</td></tr>';
        }
        if (sites.length > numOfLines) {
            document.getElementById('OPFESshowAllTheLocallyStoredData').setAttribute('style', "display: inline");
        } else {
            document.getElementById('OPFESshowAllTheLocallyStoredData').setAttribute('style', "display: none");
        }
        dataTableHTML += '</table>';
        document.getElementById('OPFESlocalyStoredUserData').innerHTML = dataTableHTML;
    }

    document.getElementById('OPFESshowAllTheLocallyStoredData').addEventListener('click', function () {
        showTheLocallyStoredData(100000);
    });

    function toggleChangability() {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    }

    document.getElementById('OPFESinputDomainToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESinputSaltToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESinputUserIdToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESinputSequenceNrToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESselectMaxPwdCharsToggle').addEventListener('click', function () {
        toggleChangability.call(this);
    });
    document.getElementById('OPFESinputAppPasswordShow').addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 4);
        let elementToToggle = document.getElementById(elementId);
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('OPFESinputAppPasswordShow').setAttribute('disabled', 'disabled');
        document.getElementById('OPFESinputAppPasswordHide').removeAttribute('disabled');
    });
    document.getElementById('OPFESinputAppPasswordHide').addEventListener('click', function () {
        let elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('OPFESinputAppPasswordShow').removeAttribute('disabled');
        document.getElementById('OPFESinputAppPasswordHide').setAttribute('disabled', 'disabled');
    });

    document.getElementById('sssOPFESexportDataButton').addEventListener('click', function () {
        alert('Still to implement using https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.js')
    });

    document.getElementById('OPFESimportDataButton').addEventListener('click', function () {
        alert('Still to implement using https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.js')
    });

    /*
     * Upon clicking the loginButton, generate the password for this site, salt, uid, sequence,
      * show the password in a popup and save the (changed) domain-data to the LocalStorage,
      * N.B. of course not saving the password!
     */
    document.getElementById('OPFESloginButton').addEventListener('click', function () {
        let ourPopup = document;
        let site = new Site(
            (<HTMLInputElement>ourPopup.getElementById('OPFESinputDomain')).value,
            (<HTMLInputElement>ourPopup.getElementById('OPFESinputSalt')).value,
            (<HTMLInputElement>ourPopup.getElementById('OPFESinputUserId')).value,
            +(<HTMLInputElement>ourPopup.getElementById('OPFESinputSequenceNr')).value,
            +(<HTMLSelectElement>ourPopup.getElementById('OPFESselectMaxPwdChars')).value,
            new Date(Date.now())
        );

        let inputValueAppPassword = (<HTMLInputElement>ourPopup.getElementById('OPFESinputAppPassword')).value;
        //save the sites data every time the password gets generated
        // siteService.add(site)
        let siteUpserted = false;
        for (let i = 0; i < json.sites.length; i++) {
            if (json.sites[i]["domain"] == site.getDomain()) {
                json.sites[i] = site;
                siteUpserted = true;
            }
        }
        if (!siteUpserted) {
            json.sites.push(site);
        }
        localStorage.setItem("sites", JSON.stringify(json));

        let siteService = new SiteService(sites);
        let sitePassword = siteService.getSitePassword(site, inputValueAppPassword);
        window.prompt('The password for this site for this user-id is: ' + sitePassword + ' To copy the password to your clipboard: Ctrl+C, Enter', sitePassword);
        let passwordElement = ourPopup.getElementById('OPFESinputSitePassword');
        passwordElement.setAttribute("value", sitePassword);
        // Insert the sitePassword in the password-input field in the document
        // insertPwd(sitePassword, passwordElement);

    }, false);
}, false);

/**
 * Created by Tim on 12-2-2017.
 */
interface ISite {
    getDomain();
    setDomain(value: string);
    getSalt();
    setSalt(value: string);
    getUserId();
    setUserId(value: string);
    getSequenceNr();
    setSequenceNr(value: number);
    getMaxPwdChars();
    setMaxPwdChars(value: number);
    getLastUsed();
    setLastUsed(value: Date);
    getRemark();
    setRemark(value: string);
}
class Site implements ISite {

    constructor(private domain: string = "",
                private salt?: string,
                private userId?: string,
                private sequenceNr?: number,
                private maxPwdChars?: number,
                private lastUsed?: Date,
                private remark?: string) {
    }

    public getDomain(): string {
        return this.domain;
    }

    public setDomain(value: string) {
        this.domain = value;
    }

    public getSalt(): string {
        return this.salt;
    }

    public setSalt(value: string) {
        this.salt = value;
    }

    public getUserId(): string {
        return this.userId;
    }

    public setUserId(value: string) {
        this.userId = value;
    }

    public getSequenceNr(): number {
        return this.sequenceNr;
    }

    public setSequenceNr(value: number) {
        this.sequenceNr = value;
    }

    public getMaxPwdChars(): number {
        return this.maxPwdChars;
    }

    public setMaxPwdChars(value: number) {
        this.maxPwdChars = value;
    }

    public getLastUsed(): Date {
        return this.lastUsed;
    }

    public setLastUsed(value: Date) {
        this.lastUsed = value;
    }

    public getRemark(): string {
        return this.remark;
    }

    public setRemark(value: string) {
        this.remark = value;
    }
}
/**
 * Created by Tim on 11-2-2017.
 */

declare function SHA512(string): string;

interface ISiteService {
    add(site: Site): Boolean;
    getByDomain(domain: string): Site;
    getAll(): Site[];
    getSitePassword(site: Site,
                    pwdUser: string): string;
}

function getTheLocallyStoredSites(numOfLines: number = 9999): Site[] {
    let json = JSON.parse(localStorage.getItem("sites"));
    let sites = json.sites;
    if (numOfLines == 9999) {
        return sites;
    } else {
        return sites.slice(0, numOfLines);
    }
}

class SiteService implements ISiteService {
    constructor(sites: Site[]) {
        if (sites) {
            sites.forEach(site => this.add(site))
        }
    }

    add(site: Site): Boolean {
        return true;
    };

    getByDomain(domain: string): Site {
        let site: Site = new Site;
        getTheLocallyStoredSites();
        // site->setDomain()
        return site;
    };

    getAll(): Site[] {
        return getTheLocallyStoredSites();
    };

    /**
     * This function takes its parameters and returns a hashed password that:
     * - has length of 120 characters (unless you change the constant passwordLength)
     * - is made up of 64 different characters
     * - includes at least one: uppercase, lowercase, integer and special character
     * @param site: Site
     * @param appPassword: string
     * @returns {string}
     */
    getSitePassword(site: Site, appPassword: string): string {
        const passwordLength: number = site.getMaxPwdChars(); //Between 20 and 120

        //get the SHA512
        let stringToHash: string = site.getDomain() + site.getSalt() + site.getUserId() + site.getSequenceNr() + appPassword;
        let generatedHash: string = SHA512(stringToHash);

        //Now we have got a hexadecimal hash. Let's create our own BASE-64 password character set and
        // transform the hex to that. There are 86 characters available in passwords:
        // a-z A-Z 0-9 and these 24: `'/\~!@#$%^()_+-=.:?[]{}
        //   @see https://docs.oracle.com/cd/E11223_01/doc.910/e11197/app_special_char.htm#BABGCBGA
        //op ebay.nl:  !@#$+*^~-
        // I choose to exclude these: iIjJlLoOqQxXyY`\$[]017 and we are leftover with these 64 possible password characters
        const lowerCaseCharacters: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "k", "m", "n", "p", "r", "s", "t", "u", "v", "w", "z"];
        const upperCaseCharacters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "Z"];
        const numberCharacters: string[] = ["2", "3", "4", "5", "6", "8", "9"];
        const specialCharacters: string[] = ["'", "/", "~", "@", "#", "%", "^", "(", ")", "_", "+", "-", "=", ".", ":", "?", "!", "{", "}"];
        const passwordCharacters: string[] = lowerCaseCharacters.concat(upperCaseCharacters).concat(numberCharacters).concat(specialCharacters);
        let counterHash: number = 0;
        let generatedPassword: string = "";
        for (let counterPwd = 0; counterPwd < (passwordLength / 2); counterPwd++) {
            let nextHashPart: string = generatedHash.substr(counterHash, 3);
            let nextDecimal: number = parseInt(nextHashPart, 16);
            let secondChar: number = nextDecimal % 64;
            let firstChar: number = ((nextDecimal - secondChar) / 64);
            generatedPassword += passwordCharacters[firstChar] + passwordCharacters[secondChar];
            counterHash = ((counterHash + 3) > 128) ? 1 : (counterHash + 3);//resetting counterHash to 1 (instead of 0) to get different nextHashParts the second time
        }

        //Make sure there is at least one uppercase
        if ((/[A-Z]/.test(generatedPassword)) === false) {
            let chosenUppercaseCharacter: string = upperCaseCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = chosenUppercaseCharacter + generatedPassword.substr(1, passwordLength - 1);
        }

        //Make sure there is at least one lowercase
        if ((/[a-z]/.test(generatedPassword)) === false) {
            let chosenLowercaseCharacter: string = lowerCaseCharacters[generatedHash.charCodeAt(3) % 19];
            let chosenPosition: number = generatedHash.charCodeAt(4) % 16 + 1; // = 1 to 16
            let firstPart: string = generatedPassword.substr(0, chosenPosition);
            let lastPart: string = generatedPassword.substr(chosenPosition + 1);
            generatedPassword = firstPart + chosenLowercaseCharacter + lastPart;
        }

        //Make sure there is at least one number
        if ((/[0-9]/.test(generatedPassword)) === false) {
            let chosenNumberCharacter: string = numberCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenNumberCharacter;
        }

        //Make sure there is at least one special character
        if ((/['/~@#%^()_+-=.:?!{}]/.test(generatedPassword)) === false) {
            let chosenSpecialCharacter: string = specialCharacters[generatedHash.charCodeAt(3) % 19];
            generatedPassword = generatedPassword.substr(0, passwordLength - 1) + chosenSpecialCharacter;
        }

        return generatedPassword;
    }
}
