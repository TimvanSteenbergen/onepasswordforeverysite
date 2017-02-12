"use strict";
/**
 * Created by Tim on 11-2-2017.
 */
var Model_1 = require('./Model');
function getTheLocallyStoredSites(numOfLines) {
    if (numOfLines === void 0) { numOfLines = 999; }
    var json = JSON.parse(localStorage.getItem("sites"));
    var sites = json.sites;
    if (numOfLines == 999) {
        return sites;
    }
    else {
        return sites;
    }
    ;
}
var SiteService = (function () {
    function SiteService(sites) {
        var _this = this;
        if (sites) {
            sites.forEach(function (site) { return _this.add(site); });
        }
    }
    SiteService.prototype.add = function (site) {
        return true;
    };
    ;
    SiteService.prototype.getByDomain = function (domain) {
        var site = new Model_1.Site;
        getTheLocallyStoredSites();
        site -  > setDomain();
        return site;
    };
    ;
    SiteService.prototype.getAll = function () {
        return getTheLocallyStoredSites();
    };
    ;
    return SiteService;
}());
exports.__esModule = true;
exports["default"] = SiteService;
//# sourceMappingURL=SiteService.js.map