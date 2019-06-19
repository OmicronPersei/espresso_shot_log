const http = require('http');

const config = require('../config.js');
const serverConfig = config();

//mock data for testing
let shots = [
    {
        roaster: "Counter culture",
        bean: "Apollo",
        grinder_setting: "1.8",
        dose_amount_grams: 18,
        brew_amount_grams: 24,
        brew_time_seconds: 35,
        bitter_sour: "+2 (bitter)",
        issues: ""
    },
    {
        roaster: "Counter culture",
        bean: "Bsdfasdf",
        grinder_setting: "1.8",
        dose_amount_grams: 18,
        brew_amount_grams: 24,
        brew_time_seconds: 36,
        bitter_sour: "+33 (bitter)",
        issues: ""
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 18,
        brew_amount_grams: 24,
        brew_time_seconds: 37,
        bitter_sour: "+1 (bitter)",
        issues: ""
    },
    {
        roaster: "Counter culture",
        bean: "Csfsdf",
        grinder_setting: "1.8",
        dose_amount_grams: 18,
        brew_amount_grams: 24,
        brew_time_seconds: 37,
        bitter_sour: "0",
        issues: ""
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

    console.log(`received options request for ${path}`);

    let allowedMethods = getAllowedMethodsForPath(path);
    let requestedMethod = req.headers["access-control-request-method"];
    let origin = req.headers["origin"];
    if (allowedMethods && allowedMethods.indexOf(requestedMethod) > -1) {
        res.writeHead(http_no_contents, 
            { 
                "Access-Control-Request-Method": requestedMethod,
                "Access-Control-Request-Headers": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Origin": origin
            });
        res.end();
    } else {
        res.writeHead(http_not_found);
        res.end();
    }
}

const getAllowedMethodsForPath = function(path) {
    let matchingObj = requestHandlers[path];
    if (!matchingObj) {
        console.log(`Could not find any matching paths for ${path}`);
    } else {
        return Object.getOwnPropertyNames(matchingObj);
    }
}

getPath = function(req) {
    var url = require('url');
    let q = url.parse(req.url);
    return q.path;
}

processRequest = function(req, res) {
    let path = getPath(req);
    let method = req.method.toUpperCase();

    console.log(`processing method ${method} path ${path}`);

    try {
        let reqHandler = requestHandlers[path][method];
        console.log(`found matching handler for method ${method} path ${path}`);
        reqHandler(req, res);
    } catch (error) {
        console.error(`Could not find a matching handler for the path ${path} and the verb ${method}`);
        res.writeHead(http_not_found);
        res.end();
    }
}

respondWithJSON = function(res, obj) {
    let asJSON = JSON.stringify(obj);

    res.writeHead(http_ok, 
        {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"
        });
    res.end(asJSON);
}

const requestHandlers = {
    "/shots": {
        GET: (req, res) => {
            respondWithJSON(res, shots);
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


