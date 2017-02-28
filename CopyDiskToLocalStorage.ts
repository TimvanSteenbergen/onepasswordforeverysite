declare function escape(s:string): string;
(function (view) {
    "use strict";
    let document = view.document
        // only get URL when necessary in case Blob.js hasn't defined it yet
        , get_blob = function () {
            return view.Blob;
        }
        ;

    document.getElementById("OPFESCopyDiskToLocalStorageButton").addEventListener("change", function (evt) {
        evt.preventDefault();
        let files = evt.target.files ; // FileList object

        // files is a FileList of File objects. List some properties.
        let output = [];
        for (let i = 0, f; f = files[i]; i++) {
            output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
        }
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
alert('asdf');
        //todo Replace this
        let json: {"sites": Site[]} = {
            "sites": [//domain, salt, username, sequencenr, maxPwdChars, lastused, remarks
                new Site("gavelsnipe.com", "koud", "timvans", 1, 120, new Date("20160101"), ""),
                new Site("myclaoud.com", "hout", "tim@tieka.nl", 1, 30, new Date("20170218"), ""),
                new Site("maycloud.com", "hout", "tim@tieka.nl", 1, 30, new Date("20170218"), ""),
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
        localStorage.setItem("sites", JSON.stringify(json));
    }, false);
}(self));
