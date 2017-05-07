/**
 * Created by Tim van Steenbergen on 11-2-2017.
 */

(function runTests(): Event {
    let results: Array<Array<boolean>> = [];
    let testSites: Array<Site> = [];
    let resultsHTML: string;
    let resultaat: HTMLElement = document.getElementById('unittests');

    let expectedPasswords: Array<string> = [];
    // Batch of tests
    testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 119));
    expectedPasswords.push('.VTg!6gzs33Z/C@8S_bkdDF_49(raRd5-R%3/a?zdErK4u{4~6aT48edE(4mafSKANM(@E0e5FG4em@{9a_?bc3-w~H#WVHnmKZMpksSza)0s5KNdah@./h');

    testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 120));
    expectedPasswords.push('z~+8d.A?V0{e5Ww8Ra43Z:h=)_r?)~Uzew_U#65n96!bwkP)t@eswHEsSn5+UR30k.USmT#Rw^HK4p==-Vp!c46!:a{W}k=~Tn4eKh@nHmP#{NNVusK-WTeN');

    for (let i = 0; i < testSites.length; i++) {
        let generatedPassword: string = SiteService.getSitePassword(testSites[i], 'demo');
        let thisTest: Array<boolean> = [];
        thisTest['passwordMatches'] = (expectedPasswords[i] === generatedPassword);
        thisTest['lengthMatches'] = (generatedPassword.length === testSites[i].getMaxPwdChars());
        thisTest['minTwoUpper'] = (generatedPassword.length - generatedPassword.replace(/[A-Z]/g, '').length > 1);
        thisTest['minTwoLower'] = (generatedPassword.length - generatedPassword.replace(/[a-z]/g, '').length > 1);
        thisTest['minTwoSpecials'] = (generatedPassword.length - generatedPassword.replace(/[/~@#%^()_+-=.:?!{}]/g, '').length > 1);
        thisTest['minTwoNumbers'] = (generatedPassword.length - generatedPassword.replace(/[0-9]/g, '').length > 1);
        results.push(thisTest);
    }
    resultsHTML = `<table><tr><td>Testcase<br/>nr</td><td>password<br/>matches</td><td>Length<br/>matches</td>
<td>has 2<br/>upper</td><td>has 2<br/>lower</td><td>has 2<br/>specials</td><td>has 2<br/>digits</td></tgd></tr>`;
    for (let i = 0; i < results.length; i++) {
        resultsHTML += `<tr><td>${i}
        <td>${results[i]['passwordMatches']}</td>
        <td>${results[i]['lengthMatches']}</td>
        <td>${results[i]['minTwoUpper']}</td>
        <td>${results[i]['minTwoLower']}</td>
        <td>${results[i]['minTwoSpecials']}</td>
        <td>${results[i]['minTwoNumbers']}</td>
        </tr>`;
    }
    resultaat.innerHTML = resultsHTML;
    return new Event('All tests passed.');
})();
