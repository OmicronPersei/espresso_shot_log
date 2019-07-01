module.exports.getBodyFromRequest = function(req) {
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

module.exports.respondOkWithJSON = function(res, obj) {
    let asJSON = JSON.stringify(obj);

    addJSONContentTypeHeader(res);
    returnOk(res, asJSON);
}

module.exports.returnOk = function(res, bodyJSON = null) {
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

module.exports.addAllowableHeadersHeader = function(res) {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}