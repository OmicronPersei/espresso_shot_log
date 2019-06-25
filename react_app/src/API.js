import config from './config';

class API {
    constructor() {
        this._config = config();
    }

    getAllData() {
        let endpoint = `${this._config.apiurl}/all`;
        let headers = new Headers();
        headers.set("Content-type", "application-json");
        let requestInit = {
            headers: headers,
            method: "GET"
        };

        return fetch(endpoint, requestInit);
    }

    addNewRoaster(newRoaster) {
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

    addNewBeanForRoaster(roaster, bean) {
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

    addNewIssue(issue) {
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

    addNewShotRecord(shot) {
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

    getShotPage(pageData) {
        let url = `${this._config.apiurl}/shots`;
        let headers = new Headers();
        let body = JSON.stringify(pageData);
        let requestInit = {
            headers: headers,
            method: "GET",
            body: body
        };

        return fetch(url, requestInit);
    }
}

export default API;