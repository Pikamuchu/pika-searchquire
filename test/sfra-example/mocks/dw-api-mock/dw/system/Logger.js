'use strict';

function logMessage(message, param0, param1, param2, param3) {
    console.log(message
        .replace('{0}', param0)
        .replace('{1}', param1)
        .replace('{2}', param2)
        .replace('{3}', param3)
    );
}

function getLogger() {
    return {
        debugEnabled: false,
        infoEnabled: false,
        debug: logMessage,
        info: logMessage,
        warn: logMessage,
        error: logMessage
    };
}

module.exports = {
    debug: logMessage,
    info: logMessage,
    warn: logMessage,
    error: logMessage,
    getLogger: getLogger
};
