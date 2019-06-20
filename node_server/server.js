const http = require('http');

const config = require('./config.js');
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
    "Extraction too fast",
    "Extraction too slow"
];

const http_status_ok = 200;
const http_status_no_contents = 204;
const http_status_not_found = 404;

const server = http.createServer((req, res) => {
    let method = req.method.toUpperCase();

    if (method === "OPTIONS") {
        processOptionsRequest(req, res);
    } else {
        processRequest(req, res);
    }

}).listen(serverConfig.listenport, listeningListener = () => {
    let address = server.address();
    console.log(`Server is listening at ${address.address}:${address.port}`);
});

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

const getPath = function(req) {
    var url = require('url');
    let q = url.parse(req.url);
    return q.path;
}

const sendMethodIsSupportedResponse = function(res) {
    addAllowableHeadersHeader(res);
    addCORSHeader(res);
    res.writeHead(http_status_no_contents);
    res.end();
}

const addAllowableHeadersHeader = function(res) {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const sendMethodIsNotSupportedResponse = function(res) {
    res.writeHead(http_status_not_found);
    res.end();
}

const processRequest = function(req, res) {
    let path = getPath(req);
    let method = req.method.toUpperCase();

    console.log(`processing method ${method} path ${path}`);

    try {
        let reqHandler = requestHandlers[path][method];
        reqHandler(req, res);
    } catch (error) {
        console.error(`Could not find a matching handler for the path ${path} and the verb ${method}`);
        res.writeHead(http_status_not_found);
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

                returnOk(res, newId.toString());
            });
        }
    },
    "/beans": {
        GET: (req, res) => {
            respondWithJSON(res, shots);
        }
    },
    "/beans/add": {
        POST: (req, res) => {
            getBodyFromRequest(req, body => {
                bodyJSON = JSON.parse(body);
                let roaster = bodyJSON.roaster;
                let bean = bodyJSON.bean;

                beans[roaster].push(bean);

                returnOk(res);
            });
        }
    },
    "/roasters": {
        GET: (req, res) => {
            respondWithJSON(res, shots);
        }
    },
    "/roasters/add": {
        POST: (req, res) => {
            getBodyFromRequest(req, body => {
                let roaster = body;
                roasters.push(roaster);
                beans[roaster] = [];

                returnOk(res);
            });
        }
    },
    "/issues": {
        GET: (req, res) => {
            respondWithJSON(res, shots);
        }
    },
    "/issues/add": {
        POST: (req, res) => {
            getBodyFromRequest(req, body => {
                let issue = body;
                issues.push(issue);

                returnOk(res);
            });
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

const getBodyFromRequest = function(req, bodyReadCallback) {
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        let bodyStr = Buffer.concat(body).toString();
        bodyReadCallback(bodyStr);
    });
}

const respondWithJSON = function(res, obj) {
    let asJSON = JSON.stringify(obj);

    addJSONContentTypeHeader(res);
    returnOk(res, asJSON);
}

const returnOk = function(res, bodyJSON = null) {
    addCORSHeader(res);
    res.writeHead(http_status_ok);
    
    if (bodyJSON) {
        res.end(bodyJSON);
    } else {
        res.end();
    }
}

const addCORSHeader = function(res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
}

const addJSONContentTypeHeader = function(res) {
    res.setHeader("Content-Type", "application/json");
}