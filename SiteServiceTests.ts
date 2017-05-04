/**
 * Created by Tim on 11-2-2017.
 */

(function runTests(): Event {
    let testSite = new Site('testdomain.com', 'demosalt','demo@testdomain.com',1, 120);
    let yourPasswordForThisSite: string = SiteService.getSitePassword(testSite, 'demo');
    console.log('pwd: ' + yourPasswordForThisSite);
    return new Event('All tests passed.');
})();