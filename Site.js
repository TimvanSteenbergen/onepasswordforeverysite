class Site {
    constructor(domain = '', userId = '', salt = '', sequenceNr = 1, maxPwdChars = 120, allowedSpecialCharacters = '', lastUsed = new Date(), remark = '') {
        this.domain = domain;
        this.userId = userId;
        this.salt = salt;
        this.sequenceNr = sequenceNr;
        this.maxPwdChars = maxPwdChars;
        this.allowedSpecialCharacters = allowedSpecialCharacters;
        this.lastUsed = lastUsed;
        this.remark = remark;
    }
    getDomain() {
        return this.domain;
    }
    setDomain(value) {
        this.domain = value;
    }
    getUserId() {
        return this.userId;
    }
    setUserId(value) {
        this.userId = value;
    }
    getSalt() {
        return this.salt;
    }
    setSalt(value) {
        this.salt = value;
    }
    getSequenceNr() {
        return this.sequenceNr;
    }
    setSequenceNr(value) {
        this.sequenceNr = value;
    }
    getMaxPwdChars() {
        return this.maxPwdChars;
    }
    setMaxPwdChars(value) {
        this.maxPwdChars = value;
    }
    getAllowedSpecialCharacters() {
        return this.allowedSpecialCharacters;
    }
    setAllowedSpecialCharacters(value) {
        this.allowedSpecialCharacters = value;
    }
    getLastUsed() {
        return this.lastUsed;
    }
    setLastUsed(value) {
        this.lastUsed = value;
    }
    getRemark() {
        return this.remark;
    }
    setRemark(value) {
        this.remark = value;
    }
}
//# sourceMappingURL=Site.js.map