/*! FileSaver.js demo script
 *  2016-05-26
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT
 *    See LICENSE.md
 */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/demo/demo.js */

/*jshint laxbreak: true, laxcomma: true, smarttabs: true*/
/*global saveAs, self*/

(function (view) {
    "use strict";
// The canvas drawing portion of the demo is based off the demo at
// http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
    var
        document = view.document
        , $ = function (id) {
            return document.getElementById(id);
        }
        , session = view.sessionStorage
        // only get URL when necessary in case Blob.js hasn't defined it yet
        , get_blob = function () {
            return view.Blob;
        }

        , text = $("text")
        , text_options_form = $("text-options")
        // , text_filename = $("text-filename")
        ;

    if (session.text) {
        text.value = session.text;
        // } if (session.text_filename) {
        //     text_filename.value = session.text_filename;
    }
    OPFESexportDataButton.addEventListener("click", function (event) {
        event.preventDefault();
        var BB = get_blob();
        saveAs(
            new BB(
                [text.value || text.placeholder]
                , {type: "text/plain;charset=" + document.characterSet}
            )
            , "yourWebsiteLoginData.txt"
        );
    }, false);

    view.addEventListener("unload", function () {
        session.x_points = JSON.stringify(x_points);
        session.y_points = JSON.stringify(y_points);
        session.drag_points = JSON.stringify(drag_points);
        session.canvas_filename = canvas_filename.value;

        session.text = text.value;
        session.text_filename = "yourWebsiteLoginData";

        session.html = html.innerHTML;
        session.html_filename = html_filename.value;
    }, false);
}(self));
