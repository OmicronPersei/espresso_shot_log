const http = require('http');

const config = require('./config');
const serverConfig = config();

const rest_endpoints = require('./rest_endpoints');
const http_status_codes = require('./http_status_codes');
const node_methods = require('./node_methods');

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
    node_methods.addAllowableHeadersHeader(res);
    node_methods.addCORSHeader(res);
    res.writeHead(http_status_codes.http_status_no_contents);
    res.end();
}

const sendMethodIsNotSupportedResponse = function(res) {
    res.writeHead(http_status_codes.http_status_not_found);
    res.end();
}

const processRequest = function(req, res) {
    let path = getPath(req);
    let method = req.method.toUpperCase();

    console.log(`processing method ${method} path ${path}`);

    try {
        let reqHandler = rest_endpoints.requestHandlers[path][method];
        reqHandler(req, res);
    } catch (error) {
        console.error(`Could not find a matching handler for the path ${path} and the verb ${method}`);
        res.writeHead(http_status_not_found);
        res.end();
    }
}