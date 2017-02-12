"use strict";
var Site = (function () {
    function Site(domain, salt, username, sequenceNr, lastUsed, remark) {
        if (domain === void 0) { domain = ""; }
        if (salt === void 0) { salt = ""; }
        if (username === void 0) { username = ""; }
        if (sequenceNr === void 0) { sequenceNr = 1; }
        if (lastUsed === void 0) { lastUsed = new Date('19700101'); }
        if (remark === void 0) { remark = ""; }
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