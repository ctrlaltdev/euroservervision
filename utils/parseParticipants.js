const path = require('path')
const fs = require('fs')

const file = process.argv[2]

const participants = require(file)

fs.writeFile(path.join(__dirname, file), JSON.stringify(participants.map(({ country }) => country)), () => {
  console.info('Done')
})

