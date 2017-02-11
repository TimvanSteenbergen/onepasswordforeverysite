/**
 * Created by Tim van Steenbergen on 11-2-2017.
 */

interface ISite {
    domain: string,
    salt: string,
    username: string,
    sequenceNr: number,
    lastUsed?: Date,
    remark?: string
}
class Site implements ISite {
    constructor(public domain: string,
                public salt: string,
                public username: string,
                public sequenceNr: number,
                public lastUsed: Date,
                public remark: string) {
        alert(domain+salt+username+sequenceNr+lastUsed+remark);
    }
}
class SiteServices {
    AddSite() {

    };

}

let site0= new Site("gavelsnipe.com", "koud", "timvans", 1, new Date("20160101"), "gavel"); let site1 = new Site("webassessor.com", "koud", "TimvanSteenBergen", 2, new Date("20160101"), "webbie"); let sites = [
    site0,
    site1
];
