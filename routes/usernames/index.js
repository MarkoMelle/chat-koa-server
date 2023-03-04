const Router = require('koa-router');
const {usernames} = require('../../db');

const router = new Router();

router.post('/usernames', (ctx) => {
  ctx.response.body = 'usernames';

  const {name} = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (usernames.data.some((user) => user.name === name)) {
    ctx.response.body = {status: 'username exists'};

    return;
  }

  usernames.add({name});
  ctx.response.body = {status: 'OK'};
});

router.delete('/usernames/:name', (ctx) => {
  const {name} = ctx.params;
  console.log(ctx.params);
  console.log(name);

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (usernames.data.every((user) => user.name !== name)) {
    ctx.response.status = 400;
    ctx.response.body = {status: 'username doesn\'t exists'};
    return;
  }

  usernames.delete({name});

  ctx.response.body = {status: 'OK'};
});

module.exports = router;
