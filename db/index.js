const fs = require('fs');
const usernames = {
  data: [],

  add(item) {
    this.data.push(item);
    fs.writeFileSync('./db/usernames.json',
        JSON.stringify(this.data), (err) => {
          if (err) throw err;
        });
  },
  delete(item) {
    this.data = this.data.filter((user) => user.name !== item.name);
    fs.writeFileSync('./db/usernames.json',
        JSON.stringify(this.data), (err) => {
          if (err) throw err;
        });
  },
};

const chat = {
  data: [],

  add(item) {
    this.data.push(item);
    fs.writeFileSync('./db/chatMessages.json',
        JSON.stringify(this.data), (err) => {
          if (err) throw err;
        });
  },
};

module.exports = {usernames, chat};
