(function (view) {
    "use strict";
    let document = view.document;
    document.getElementById("OPFESCopyDiskToLocalStorageButton").addEventListener("change", function (evt) {
        evt.preventDefault();
        let file = (<HTMLInputElement>this).files[0];

        let reader = new FileReader();
        reader.onload = function(e) {
            // todo cast e.target to its type: let data = (<FileReader>e.target).result;
            let dataString:string = (<FileReader>e.target).result;
            let dataObject:{"sites": [Site]} = JSON.parse(dataString);
            //todo, sanitize the input
            // let sites = new ObjectArray<Site>();
            // sites = dataObject.sites;
            let sites:[Site] = dataObject.sites;
            //todo Replace this list of sites with the content of the uploaded file
            let dataHTML = '<table>';
            for (let site of sites) {
                dataHTML += `<tr>
<td>${site.domain}</td>
<td>${site.salt}</td>
<td>${site.userId}</td>
<td>${site.sequenceNr}</td>
<td>${site.maxPwdChars}</td>
<td>${site.lastUsed}</td>
<td>${site.remark}</td>
</tr>`;
            }
            dataHTML += '</table>';
            //todo store json in the onscreen table-content id=OPFESlocalyStoredUserData
            let localyStoredUserDataElement = document.getElementById('OPFESlocalyStoredUserData');
            localyStoredUserDataElement.innerHTML = dataHTML;

            let json: {"sites": Site[]} = {"sites": sites};
            // let json: {"sites": Site[]} = {
            //     "sites": [//domain, salt, username, sequencenr, maxPwdChars, lastused, remarks
            //         new Site("gavelsnipe.com", "koud", "timvans", 1, 120, new Date("20160101"), ""),
            //         new Site("myclaoud.com", "hout", "tim@tieka.nl", 1, 30, new Date("20170218"), ""),
            //         new Site("maycloud.com", "hout", "tim@tieka.nl", 1, 30, new Date("20170218"), ""),
            //         new Site("mycloud.com", "hout", "tim@tieka.nl", 1, 30, new Date("20170218"), ""),
            //         new Site("webassessor.com", "koud", "TimvanSteenbergen", 2, 120, new Date("20160101"), ""),//
            //         new Site("stackoverflow.com", "koud", "tim@tieka.nl", 1, 120, new Date(new Date("20160101")), ""),
            //         new Site("quora.com", "koud", "tim@tieka.nl", 1, 74, new Date("20160101"), "Max 75 karakters in het wachtwoord"),
            //         new Site("robbshop.com", "koud", "tim@tieka.nl", 1, 120, new Date("20160101"), ""),
            //         new Site("lynda.com", "koud", "tim@tieka.nl", 1, 120, new Date("20160101"), ""),
            //         new Site("nrc.nl", "koud", "elma@tieka.nl", 1, 120, new Date("20160101"), ""),
            //         new Site("ebay.com", "heet", "tivansteenberge_0", 3, 64, new Date("20160101"), "Max 64 karakters in het wachtwoord"),
            //         new Site("ebay.nl", "heet", "tivansteenberge_0", 3, 64, new Date("20160101"), "Max 64 karakters in het wachtwoord"),
            //         new Site("yetanothersite.nl", "koud", "alias24", 1, 120, new Date("20160101"), ""),
            //         new Site("andonemore.nl", "koud", "myusernamehere", 1, 120, new Date("20160101"), "")
            //     ]
            // };
            localStorage.setItem("sites", JSON.stringify(json));
        }
        reader.readAsText(file);//attempts to read the file in question.


    }, false);
}(self));
