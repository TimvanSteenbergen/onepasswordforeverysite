/**
 * Created by Tim on 11-2-2017.
 */
import { Site } from './Model';

export interface ISiteService {
    add(site: Site): Boolean;
    getByDomain(domain: string): Site;
    getAll(): Site[];
}

function getTheLocallyStoredSites (numOfLines: number = 999): Site[] {
    let json = JSON.parse(localStorage.getItem("sites"));
    let sites = json.sites;
    if (numOfLines == 999){
        return sites;
    } else {
        return sites;
    };
}

export default class SiteService implements ISiteService {
    constructor(sites: string[]){
        if (sites) {
            sites.forEach(site => this.add(site))
        }
    }
    add(site: Site): Boolean {
        return true;
    };
    getByDomain(domain: string): Site {
        let site: Site = new Site;
        getTheLocallyStoredSites();
        site->setDomain()
        return site;
    };
    getAll(): Site[]{
        return getTheLocallyStoredSites();
    };

}