'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

const config = {
    port: process.env.PORT || 9090
};

const latencies = {
    technologyLists: 0
}


app.set('config', config);
app.set('latencies', latencies);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Add CORS headers to the response
function setupCorsHeaders(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept, Authorization, applicationName');
    res.header('Content-Type', 'application/json');
    // res.header("Content-Security-Policy", "img-src 'self' data:; default-src 'self'");
    res.header('Access-Control-Allow-Origin', '*');
    if(req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
}

app.all('/*', setupCorsHeaders);

// For each api file js, create your own route with express
const apiFiles = fs.readdirSync('./server/api');
console.log('apiFiles => ', apiFiles);
apiFiles.forEach(apiFile => {
    if (apiFile.endsWith('.js')){
        require('./api/' + apiFile)(app);
    }
});

if (!module.parent) { // Launch server when i run directly, parent is deprecated, use module.childre (see : https://nodejs.org/api/modules.html#moduleparent)
    console.log('Starting server with nodeJS');
    startServer(app, config);

    process.on('msg', msg => {
        if(msg !== 'shutdown')
            return;

        stopServer(server);
    })
} else {
    console.log('Exporting server config options');
    exports.app     = app;
    exports.config  = config;
    exports.startServer = startServer;
    exports.stopServer  = stopServer;
}

function startServer(app, config) {
    app.listen(config.port, () => {
        console.log(`Starting server listening on port ${config.port} - ${app.settings.env} mode.`);
    });
};

function stopServer(server) {
    console.log('Server is down, force shutdown please...');
    server.close();
}
