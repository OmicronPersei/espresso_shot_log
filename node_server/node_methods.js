const http_status_codes = require('./http_status_codes');

const getBodyFromRequest = function(req) {
    return new Promise(resolve => {
        let body = [];
        req.on('data', chunk => {
            body.push(chunk);
        }).on('end', () => {
            let bodyStr = Buffer.concat(body).toString();
            resolve(bodyStr);
        });
    });
}
module.exports.getBodyFromRequest = getBodyFromRequest;

const respondOkWithJSON = function(res, obj) {
    let asJSON = JSON.stringify(obj);

    addJSONContentTypeHeader(res);
    returnOk(res, asJSON);
}
module.exports.respondOkWithJSON = respondOkWithJSON;

const returnOk = function(res, bodyJSON = null) {
    addCORSHeader(res);
    res.writeHead(http_status_codes.ok);
    
    if (bodyJSON) {
        res.end(bodyJSON);
    } else {
        res.end();
    }
}
module.exports.returnOk = returnOk;

const addCORSHeader = function(res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
}
module.exports.addCORSHeader = addCORSHeader;

const addJSONContentTypeHeader = function(res) {
    res.setHeader("Content-Type", "application/json");
}
module.exports.addJSONContentTypeHeader = addJSONContentTypeHeader;

const addAllowableHeadersHeader = function(res) {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
module.exports.addAllowableHeadersHeader = addAllowableHeadersHeader;