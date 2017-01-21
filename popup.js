
/**
 * Created by Gebruiker on 21-1-2017.
 */
document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('btn_login');
    checkPageButton.addEventListener('click', function() {

        chrome.tabs.getSelected(null, function(tab) {
            d = document;
            // var uidThisSite = $('#myuidthissite').value;
            // var pwdUser = $('#myonlypassword').value;
            // alert(uidThisSite + 'd en password: ' + pwdUser);
            // alert('d en password: ' + pwdUser);
            alert('d en password: ');
            var f = d.createElement('form');
            f.action = 'http://gtmetrix.com/analyze.html?bm';
            f.method = 'post';
            var i = d.createElement('input');
            i.type = 'hidden';
            i.name = 'url';
            i.value = tab.url;
            f.appendChild(i);
            d.body.appendChild(f);
            f.submit();
        });
    }, false);
}, false);
