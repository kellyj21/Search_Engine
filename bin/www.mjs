import http from 'http';
import app from '../app';
import { SERVER, ERROR_SERVER } from '../config';
import elasticsearch from 'elasticsearch';

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES': {
            console.error(`Port ${SERVER.port} ${ERROR_SERVER['200']}`);
            process.exit(1);
            break;
        }
        case 'EADDRINUSE': {
            console.error(`Port ${SERVER.port} ${ERROR_SERVER['201']}`);
            process.exit(1);
            break;
        }
        default: {
            throw error;
        }
    }
}

app.set('port', SERVER.port);
const server = http.createServer(app);
server.listen(SERVER.port);
server.on('error', onError);
server.on('listening', () => console.error(`Listening on port ${SERVER.port}`));

