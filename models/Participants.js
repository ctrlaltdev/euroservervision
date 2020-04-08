const Table = require('./Table')

const ParticipantStruct = {
  country: 'TEXT',
  year: 'INT',
  semifinale: 'INT',
  finale: 'INT'
}

const Participants = new Table('participants')
Participants.define(ParticipantStruct)

Participants.sync()

module.exports = Participants
