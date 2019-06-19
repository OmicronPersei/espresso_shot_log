const http = require('http');

const config = require('../config.js');
const serverConfig = config();

//mock data for testing
//probably eventually replace with some kind of light weight SQL DB.
let shots = [
    {
        roaster: "Counter culture",
        bean: "Apollo",
        grinder_setting: "1.8",
        dose_amount_grams: 18,
        brew_amount_grams: 24,
        brew_time_seconds: 35,
        bitter_sour: "+2 (bitter)",
        issues: "",
        id: 1
    },
    {
        roaster: "Counter culture",
        bean: "Bsdfasdf",
        grinder_setting: "1.8",
        dose_amount_grams: 18,
        brew_amount_grams: 24,
        brew_time_seconds: 36,
        bitter_sour: "+33 (bitter)",
        issues: "",
        id: 2
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 18,
        brew_amount_grams: 24,
        brew_time_seconds: 37,
        bitter_sour: "+1 (bitter)",
        issues: "",
        id: 3
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 18,
        brew_amount_grams: 24,
        brew_time_seconds: 37,
        bitter_sour: "0",
        issues: "",
        id: 4
    }
];

let roasters = [
    "Counter culture",
    "Starbucks"
];

let beans = {
    "Counter culture": ["Apollo", "Hologram"],
    "Starbucks": ["House blend", "Yukon"]
};

let issues = [
    "Spritzers",
    "Extraction too fast"
];

const http_ok = 200;
const http_no_contents = 204;
const http_not_found = 404;

http.createServer((req, res) => {
    let method = req.method.toUpperCase();

    if (method === "OPTIONS") {
        processOptionsRequest(req, res);
    } else {
        processRequest(req, res);
    }

}).listen(serverConfig.listenport);

const processOptionsRequest = function(req, res) {
    let path = getPath(req);

    console.log(`received options request ${path}`);
    
    let requestedMethod = req.headers["access-control-request-method"];

    if (methodIsSupported(requestedMethod, path)) {
        sendMethodIsSupportedResponse(res);
    } else {
        sendMethodIsNotSupportedResponse(res);
    }
}

const methodIsSupported = function(requestedMethod, path) {
    let allowedMethods = getAllowedMethodsForPath(path);
    return (allowedMethods && allowedMethods.indexOf(requestedMethod) > -1);
}

const getAllowedMethodsForPath = function(path) {
    let matchingObj = requestHandlers[path];
    if (!matchingObj) {
        console.error(`Could not find any matching paths for ${path}`);
    } else {
        return Object.getOwnPropertyNames(matchingObj);
    }
}

getPath = function(req) {
    var url = require('url');
    let q = url.parse(req.url);
    return q.path;
}

sendMethodIsSupportedResponse = function(res) {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    addCORSHeader(res);
    res.writeHead(http_no_contents);
    res.end();
}

sendMethodIsNotSupportedResponse = function(res) {
    res.writeHead(http_not_found);
    res.end();
}

processRequest = function(req, res) {
    let path = getPath(req);
    let method = req.method.toUpperCase();

    console.log(`processing method ${method} path ${path}`);

    try {
        let reqHandler = requestHandlers[path][method];
        reqHandler(req, res);
    } catch (error) {
        console.error(`Could not find a matching handler for the path ${path} and the verb ${method}`);
        res.writeHead(http_not_found);
        res.end();
    }
}

const requestHandlers = {
    "/shots": {
        GET: (req, res) => {
            respondWithJSON(res, shots);
        }
    },
    "/shots/add": {
        POST: (req, res) => {
            let newId = shots.length + 1;
            getBodyFromRequest(req, body => {
                let obj = JSON.parse(body);
                let newShotRecord = {
                    ...obj,
                    id: newId
                };
                shots.push(newShotRecord);
                addCORSHeader(res);
                res.writeHead(http_ok);

                res.write(newId.toString());
                
                res.end();
            });
        }
    },
    "/beans": {
        GET: (req, res) => {
            respondWithJSON(res, shots);
        }
    },
    "/roasters": {
        GET: (req, res) => {
            respondWithJSON(res, shots);
        }
    },
    "/issues": {
        GET: (req, res) => {
            respondWithJSON(res, shots);
        }
    },
    "/all": {
        GET: (req, res) => {
            let all = {
                shots: shots,
                roasters: roasters,
                beans: beans,
                issues: issues
            };

            respondWithJSON(res, all);
        }
    }
};

const getBodyFromRequest = function(req, onFinishedCallback) {
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        let bodyStr = Buffer.concat(body).toString();
        onFinishedCallback(bodyStr);
    });
}

respondWithJSON = function(res, obj) {
    let asJSON = JSON.stringify(obj);

    addCORSHeader(res);
    addJSONContentTypeHeader(res);
    res.writeHead(http_ok);
    res.end(asJSON);
}

addCORSHeader = function(res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
}

addJSONContentTypeHeader = function(res) {
    res.setHeader("Content-Type", "application/json");
}
