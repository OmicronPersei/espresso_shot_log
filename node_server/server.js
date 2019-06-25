const http = require('http');

const config = require('./config.js');
const serverConfig = config();


const Roaster = "Roaster";
const RoasterBean = "Roaster/Bean";

//mock data for testing
//probably eventually replace with some kind of light weight SQL DB.
let mockShotStorage = [
    {
        roaster: "Counter culture",
        bean: "Apollo",
        grinder_setting: "1.8",
        dose_amount_grams: 18,
        brew_amount_grams: 24,
        brew_time_seconds: 35,
        bitter_sour: "+2 (bitter)",
        issues: "",
        id: 1,
        timestamp: new Date("2019-06-19 11:30")
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
        id: 2,
        timestamp: new Date("2019-06-19 11:32")
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
        id: 3,
        timestamp: new Date("2019-06-19 11:34")
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
        id: 4,
        timestamp: new Date("2019-06-19 11:36")
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

const filterShots = function(filterObj, shots) {
    switch (filterObj.filterType.toLowerCase()) {
        case Roaster.toLowerCase():
            return shots.filter(r => r.roaster.value === filter.roaster);

        case RoasterBean.toLowerCase():
            return shots.filter(r => (r.roaster.value === filter.roaster) && (r.bean.value === filter.bean));

        default:
            throw new Error("Unknown filter type");
    }
}

const sortShots = function(sortOrder, sortedColId, shots) {
    const cols = [
        { id: "timestamp", sortAsNumber: true },
        { id: "roaster", sortAsNumber: false },
        { id: "bean", sortAsNumber: false },
        { id: "dose_amount_grams", sortAsNumber: true },
        { id: "brew_amount_grams", sortAsNumber: true },
        { id: "brew_ratio", sortAsNumber: true },
        { id: "brew_time_seconds", sortAsNumber: true },
        { id: "bitter_sour", sortAsNumber: true },
    ];

    const getValForSorting = val => val[sortedColId];
    let matchingCol = cols.find(col => col.id === sortedColId);

    return shotDisplayRecords.sort((a,b) => {
        let aVal = getValForSorting(a);
        let bVal = getValForSorting(b);

        let isAsc = sortOrder === "asc";
        if (matchingCol.sortAsNumber) {
            if (isAsc) {
                return aVal - bVal;
            } else {
                return bVal - aVal;
            }
        } else {
            if (isAsc) {
                if (aVal.toUpperCase() > bVal.toUpperCase()) {
                    return 1;
                } else if (aVal.toUpperCase() < bVal.toUpperCase()) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                if (aVal.toUpperCase() < bVal.toUpperCase()) {
                    return 1;
                } else if (aVal.toUpperCase() > bVal.toUpperCase()) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }
    });
}

const requestHandlers = {
    "/shots/find": {
        POST: (req, res) => {
            getBodyFromRequest(req, body => {
                let parsedBody = JSON.parse(body);
                let shots = mockShotStorage;

                //append brew_ratio
                shots.forEach(shot => shot.brew_ratio = shot.brew_amount_grams / shot.dose_amount_grams);
                
                if (parsedBody.filter.filterType) {
                    shots = filterShots(parsedBody.filter, shots);
                }

                let totalItems = shots.length;
                
                if (parsedBody.sortedColId && parsedBody.sortDirection) {
                    shots = sortShots(parsedBody.sortOrder, parsedBody.sortedColId, shots);
                }
                
                let skipAmount = parsedBody.page * parsedBody.pageSize;
                let takeAmount = parsedBody.pageSize;
                //0 1 2 3 4
                //skip 2 take 2
                shots = shots.filter(index => 
                    index >= skipAmount && 
                    index < (skipAmount + takeAmount));
                
                let returnObj = {
                    shots: shots,
                    totalItems: totalItems
                };
                let returnObjJSON = JSON.stringify(returnObj);

                returnOk(res, returnObjJSON);
            });
        }
    },
    "/shots/add": {
        POST: (req, res) => {
            let newId = mockShotStorage.length + 1;
            getBodyFromRequest(req, body => {
                let obj = JSON.parse(body);
                let newShotRecord = {
                    ...obj,
                    id: newId
                };
                mockShotStorage.push(newShotRecord);

                returnOk(res, newId.toString());
            });
        }
    },
    "/beans": {
        GET: (req, res) => {
            respondWithJSON(res, mockShotStorage);
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
            respondWithJSON(res, mockShotStorage);
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
            respondWithJSON(res, mockShotStorage);
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
    "/metadata": {
        GET: (req, res) => {
            let all = {
                roasters: roasters,
                beans: beans,
                issues: issues
            };

            respondWithJSON(res, all);
        }
    }
};

//todo: refactor this to be a Promise.
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