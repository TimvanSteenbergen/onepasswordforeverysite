/**
 * Created by Tim van Steenbergen on 11-2-2017.
 */
(function runTests() {
    let results = [];
    let testSites = [];
    let resultsHTML;
    let resultaat = document.getElementById('unittests');
    let expectedPasswords = [];
    // Batch of tests
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 8));
    // expectedPasswords.push('88e@B-Kk');
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 9));
    // expectedPasswords.push('^%3vzZS32');
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 10));
    // expectedPasswords.push('uNcAuBR_50');
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 11));
    // expectedPasswords.push('N=/HDadS=23');
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 20));
    // expectedPasswords.push('vuVn~(3r{MRcVhSEB_80');
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 30));
    // expectedPasswords.push('?vu!tu6-!%kNP3_?!:}%Ew_=K_0rsc');
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 40));
    // expectedPasswords.push('4p4~@g%tgAmdT+/gamA(MZ~EhNTHUB+K%e/F-5dr');
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 50));
    // expectedPasswords.push('V#/M=Gre#pbn^/SC^@?6-:(^PU!Bh02SM{F-p369fC6M)-8FpV');
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 118));
    // expectedPasswords.push('r=Z:ME@e!nT}:A(-S8uw^~32KSu_ShcG/Gz(P2dC9}udK8#+8pD{t)Ts6+eC{DeHm=N=BC)/fF}ZFUp8#rSMdvtGP+f?buz3R{(!tkpd(M:.m_-d!3b@0K');
    // testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 119));
    // expectedPasswords.push('.VTg!6gzs33Z/C@8S_bkdDF_49(raRd5-R%3/a?zdErK4u{4~6aT48edE(4mafSKANM(@E0e5FG4em@{9a_?bc3-w~H#WVHnmKZMpksSza)0s5KNdah@./h');
    testSites.push(new Site('testdomain.com', 'demosalt', 'demo@testdomain.com', 1, 120));
    expectedPasswords.push('z~+8d.A?V0{e5Ww8Ra43Z:h=)_r?)~Uzew_U#65n96!bwkP)t@eswHEsSn5+UR30k.USmT#Rw^HK4p==-Vp!c46!:a{W}k=~Tn4eKh@nHmP#{NNVusK-WTeN');
    for (let i = 0; i < testSites.length; i++) {
        let generatedPassword = SiteService.getSitePassword(testSites[i], 'demo');
        let thisTest = [];
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
//# sourceMappingURL=SiteServiceTests.js.map