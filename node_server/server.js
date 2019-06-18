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

http.createServer((req, res) => {
    var url = require('url');
    let q = url.parse(req.url);

    let reqHandlerKey = `${req.method.toLowerCase()} ${q.path}`;

    let reqHandler = requestHandlers[reqHandlerKey];
    if (!reqHandler) {
        console.log(`Could not find a matching handler for the following method / path pair '${reqHandlerKey}'`);
    } else {
        console.log(`Processing request ${reqHandlerKey}`);
        
        reqHandler(req, res);
    }
    
}).listen(serverConfig.listenport);

respondWithJSON = function(res, obj) {
    let asJSON = JSON.stringify(obj);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(asJSON);
}

const requestHandlers = {
    "get /shots": (req, res) => {
        respondWithJSON(res, shots);
    },
    "get /beans": (req, res) => {
        respondWithJSON(res, beans);
    },
    "get /roasters": (req, res) => {
        respondWithJSON(res, roasters);
    },
    "get /issues": (req, res) => {
        respondWithJSON(res, issues);
    },
    "get /all": (req, res) => {
        let all = {
            shots: shots,
            roasters: roasters,
            beans: beans,
            issues: issues
        };

        respondWithJSON(res, all);
    }
};