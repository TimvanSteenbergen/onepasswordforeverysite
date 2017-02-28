/**
 * Created by Tim on 12-2-2017.
 */
interface ISite {
    getDomain();
    setDomain(value: string);
    getSalt();
    setSalt(value: string);
    getUserId();
    setUserId(value: string);
    getSequenceNr();
    setSequenceNr(value: number);
    getMaxPwdChars();
    setMaxPwdChars(value: number);
    getLastUsed();
    setLastUsed(value: Date);
    getRemark();
    setRemark(value: string);
}
class ObjectArray<Object> extends Array<Object> {
    add(element: Object) {
        this.push(element);
    }
}
class Site implements ISite {
    constructor(private domain: string = "",
                private salt?: string,
                private userId?: string,
                private sequenceNr?: number,
                private maxPwdChars?: number,
                private lastUsed?: Date,
                private remark?: string) {
    }

    public getDomain(): string {
        return this.domain;
    }

    public setDomain(value: string) {
        this.domain = value;
    }

    public getSalt(): string {
        return this.salt;
    }

    public setSalt(value: string) {
        this.salt = value;
    }

    public getUserId(): string {
        return this.userId;
    }

    public setUserId(value: string) {
        this.userId = value;
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
