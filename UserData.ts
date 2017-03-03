/**
 * Created by Tim on 12-2-2017.
 */
interface IUserData {
    "sites": Site[],
    // TODO, when we start using this for apps as well, add:
    // "app": App[],
}
class UserData implements IUserData {
    public get sites(): Site[] {
        return this._sites;
    }

    public set sites(value: Site[]) {
        this._sites = value;
    }

    constructor(public _sites: Site[]) {
    }

    /**
     * This function gets called with every key/value pair in the object as it’s being JSON.parsed
     * This function turns the given string into a UserData object having valid Site objects instead of string-values
     *
     * @param key
     * @param value if this contains a stringified UserData-instance, a UserData-instance will get returned
     * @returns {any}
     */
    static reviver(key, value): any {
        if (key !== "") {//Even better: create a sanitizer for value that checks if the value has the format needed for reviving a UserData Object
            return value;
        }
        let sites: Site[] = []; //the target array of sites
        let sitesArray: String[] = value._sites; //the source array of sites
        for (let key in sitesArray) {
            // let remark: string = (sitesArray[key]["remark"]) ? sitesArray[key]["remark"] : "asdf";
            let site: Site = new Site(
                sitesArray[key]["domain"],
                sitesArray[key]["salt"],
                sitesArray[key]["userId"],
                sitesArray[key]["sequenceNr"],
                sitesArray[key]["maxPwdChars"],
                new Date(sitesArray[key]["lastUsed"]),
                sitesArray[key]["remark"]
            );
            sites.push(site);
        }
        return new UserData(sites);
        // TODO, when we start using this for apps as well, change this to:
        // return new UserData(sites, apps);
    }

    /**
     * This function retrieves the current userData from the localStorage.
     *
     * @returns {any} if the stored value can get revived, a UserData instance is returned, otherwise the value itself is returned
     */
    static retrieve() {
        return JSON.parse(localStorage.getItem("OPFES_UserData"), UserData.reviver);
    }

    /**
     * Store the userData to the LocalStorage
     */
    persist() {
        localStorage.setItem("OPFES_UserData", JSON.stringify(this));
    }

    /**
     * This function downloads the UserData to your local pc
     */
    static download() {
        (function (view) {
            "use strict";
            let document = view.document
                // only get URL when necessary in case Blob.js hasn't defined it yet
                , get_blob = function () {
                    return view.Blob;
                };

            let userData = UserData.retrieve();
            let exportData = JSON.stringify(userData);
            //@todo encrypt this exportData
            if (confirm('This will copy the sites and their related properties to a file for you to store on your local drive.')) {
                let BB = get_blob();
                saveAs(
                    new BB([exportData], {type: "text/plain;charset=" + document.characterSet}),
                    "yourWebsiteLoginData.txt",
                    true
                );
            }
            // });
        }(self));
    }

    /**
     * This function uploads the UserData from your local pc into memory
     */
    static upload(file: File) {
        (function (view) {
            "use strict";

            let reader = new FileReader();
            reader.onload = function (e) {
                // todo cast e.target to its type: let data = (<FileReader>e.target).result;
                let dataString: string = (<FileReader>e.target).result;
                let userData: UserData = JSON.parse(dataString, UserData.reviver);
                let sites: Site[] = userData._sites;

                let dataTableHTML: string = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>maxPwdChars</td><td>used at</td></ts><td>remark</td></thead>";
                for (let site of sites) {
                    dataTableHTML += `<tr><td>${site.getDomain()}</td>
                                      <td>${site.getSalt()}</td>
                                      <td>${site.getUserId()}</td>
                                      <td>${site.getSequenceNr()}</td>
                                      <td>${site.getMaxPwdChars()}</td>
                                      <td>${site.getLastUsed()}</td>
                                      <td>${site.getRemark()}</td>
                                   </tr>`;
                }
                dataTableHTML += '</table>';
                let localStoredUserDataElement = document.getElementById('OPFES_localStoredUserData');
                localStoredUserDataElement.innerHTML = dataTableHTML;
                userData.persist();
            };
            reader.readAsText(file);//attempts to read the file in question.
        }(self));
    }
}
