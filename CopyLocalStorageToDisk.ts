(function (view) {
    "use strict";
    let document = view.document
        // only get URL when necessary in case Blob.js hasn't defined it yet
        , get_blob = function () {
            return view.Blob;
        }

    document.getElementById("OPFESCopyLocalStorageToDiskButton").addEventListener("click", function (event) {
        event.preventDefault();

        let localStorageContent = JSON.parse(localStorage.getItem("sites"));
        let exportData = JSON.stringify(localStorageContent);
        //@todo encrypt this exportData
        if (confirm('This will copy the sites and their related properties to a file for you to store on your local drive.')) {
            let BB = get_blob();
            saveAs(
                new BB([exportData], {type: "text/plain;charset=" + document.characterSet}),
                "yourWebsiteLoginData.txt",
                true
            );
        }
    }, false);
}(self));
