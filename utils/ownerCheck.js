const { ownerID } = require('../config/config');

function isOwner(userId) {
    return userId === ownerID;
}

module.exports = { isOwner };
