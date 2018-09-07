'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'POST',
    path: '/scrum',
    handler: (req, h) => {
        console.log(req.payload);
        return 'hi2';
    }
});

async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server running at: ${server.info.uri}`);
}

start();