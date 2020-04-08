const Table = require('./Table')

const VoteStruc = {
  country: 'TEXT',
  year: 'INT',
  points: 'INT',
  voter: 'TEXT'
}

const Votes = new Table('votes')
Votes.define(VoteStruc)

Votes.sync()

module.exports = Votes
