/**
 * Created by Tim on 12-2-2017.
 */
export interface Site {
    domain: string,
    salt: string,
    username: string,
    sequenceNr: number,
    lastUsed: Date,
    remark: string
}
export class Site implements Site{
    constructor(public domain: string = "",
                public salt: string = "",
                public username: string = "",
                public sequenceNr: number = 1,
                public lastUsed: Date = new Date('19700101'),
                public remark: string = ""){
    }
}
