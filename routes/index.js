const combineRouters = require('koa-combine-routers');

const usernames = require('./usernames');

const router = combineRouters(
    usernames,
);

module.exports = router;
