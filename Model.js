"use strict";
var Site = (function () {
    function Site(domain, salt, username, sequenceNr, lastUsed, remark) {
        if (domain === void 0) { domain = ""; }
        this.domain = domain;
        this.salt = salt;
        this.username = username;
        this.sequenceNr = sequenceNr;
        this.lastUsed = lastUsed;
        this.remark = remark;
    }
    return Site;
}());
exports.Site = Site;
//# sourceMappingURL=Model.js.map