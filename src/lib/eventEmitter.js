const EventEmitter = require('events');
const logger = require('../config/winston');

const emitter = new EventEmitter({ captureRejections: true });
emitter.on('error', error => {
    logger.log('error', `Event emitter rejection error: ${error}`);
})

module.exports = emitter;