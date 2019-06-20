import config from '../config';

class API {
    constructor() {
        this._config = config();
    }

    async getAllData() {
        let endpoint = `${this._config.apiurl}/all`;
        let headers = new Headers();
        headers.set("Content-type", "application-json");
        let requestInit = {
            headers: headers,
            method: "GET"
        };

        return fetch(endpoint, requestInit);
    }

    async addNewRoaster(newRoaster) {
        let url = `${this._config.apiurl}/roasters/add`;
        let headers = new Headers();
        let body = newRoaster
        let requestInit = {
            headers: headers,
            method: "POST",
            body: body
        };

        return fetch(url, requestInit);
    }

    async addNewBeanForRoaster(roaster, bean) {
        let url = `${this._config.apiurl}/beans/add`;
        let headers = new Headers();
        let body = JSON.stringify({ roaster: roaster, bean: bean });
        let requestInit = {
            headers: headers,
            method: "POST",
            body: body
        };

        return fetch(url, requestInit);
    }

    async addNewIssue(issue) {
        let url = `${this._config.apiurl}/issues/add`;
        let headers = new Headers();
        let body = issue
        let requestInit = {
            headers: headers,
            method: "POST",
            body: body
        };

        return fetch(url, requestInit);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async addNewShotRecord(shot) {
        let url = `${this._config.apiurl}/shots/add`;
        let headers = new Headers();
        let body = JSON.stringify(shot);
        let requestInit = {
            headers: headers,
            method: "POST",
            body: body
        };
        
        return fetch(url, requestInit);
    }
}

export default API;