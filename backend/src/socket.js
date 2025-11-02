const { createServer } = require('http');
const socketio = require('socket.io');

let ioInstance;

function init(server) {
    const io = socketio(server, {
        cors: {
            origin: process.env.FRONTEND_URL || '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', socket => {
        console.log('socket connected', socket.id);

        socket.on('joinResource', ({ resourceId }) => {
            socket.join(`resource_${resourceId}`);
        });

        socket.on('leaveResource', ({ resourceId }) => {
            socket.leave(`resource_${resourceId}`);
        });

        socket.on('disconnect', () => {
            // handle
        });
    });

    ioInstance = io;
}

function notifyResource(resourceId, event, payload) {
    if (!ioInstance) return;
    ioInstance.to(`resource_${resourceId}`).emit(event, payload);
}

module.exports = { init, notifyResource };
