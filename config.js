var config = function(env) {
    let config = {};

    config.server = {};
    config.server.listenport = 8080;

    config.client = {};
    config.client.apiurl = "http://localhost:8080";

    return config;
}

module.exports = config;