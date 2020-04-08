const db = require('../db/')

class Table {
  constructor (name) {
    this.name = name
  }

  define (schema) {
    this.schema = schema
  }

  serializedSchema () {
    if (!this.schema) throw new Error('Schema of the table must be defined first')
    const cols = Object.entries(this.schema)
    return cols.map(c => c.join(' ')).join(', ')
  }

  sync ({ force = false } = { }) {
    if (force) {
      db.run(`DROP TABLE ${this.name}`, e => { if (e) throw e })
    }
    const cols = this.serializedSchema()
    db.run(`CREATE TABLE IF NOT EXISTS ${this.name} (${cols})`, e => { if (e) throw e })
  }

}

module.exports = Table
