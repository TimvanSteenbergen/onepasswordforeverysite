/**
 * Created by Tim on 12-2-2017.
 */
interface ISite {
    getDomain();
    setDomain(value: string);
    getUserId();
    setUserId(value: string);
    getSalt();
    setSalt(value: string);
    getSequenceNr();
    setSequenceNr(value: number);
    getMaxPwdChars();
    setMaxPwdChars(value: number);
    getAllowedSpecialCharacters();
    setAllowedSpecialCharacters(value: string);
    getLastUsed();
    setLastUsed(value: Date);
    getRemark();
    setRemark(value: string);
}

class Site implements ISite {
    constructor(private domain: string = '',
                private userId: string = '',
                private salt: string = '',
                private sequenceNr: number = 1,
                private maxPwdChars: number = 120,
                private allowedSpecialCharacters: string = '',
                private lastUsed: Date = new Date(),
                private remark: string = '') {
    }

    public getDomain(): string {
        return this.domain;
    }

    public setDomain(value: string) {
        this.domain = value;
    }

    public getUserId(): string {
        return this.userId;
    }

    public setUserId(value: string) {
        this.userId = value;
    }

    public getSalt(): string {
        return this.salt;
    }

    public setSalt(value: string) {
        this.salt = value;
    }
    public getSequenceNr(): number {
        return this.sequenceNr;
    }

    public setSequenceNr(value: number) {
        this.sequenceNr = value;
    }

    public getMaxPwdChars(): number {
        return this.maxPwdChars;
    }

    public setMaxPwdChars(value: number) {
        this.maxPwdChars = value;
    }

    public getAllowedSpecialCharacters(): string {
        return this.allowedSpecialCharacters;
    }

    public setAllowedSpecialCharacters(value: string) {
        this.allowedSpecialCharacters = value;
    }

    public getLastUsed(): Date {
        return this.lastUsed;
    }

    public setLastUsed(value: Date) {
        this.lastUsed = value;
    }

    public getRemark(): string {
        return this.remark;
    }

    public setRemark(value: string) {
        this.remark = value;
    }
}
