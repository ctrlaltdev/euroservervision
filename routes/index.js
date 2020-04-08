const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const { Participants, Votes } = require('../models/')

const state = {
  live: false,
  year: new Date().getFullYear(),
  country: null,
  voting: false
}
const clients = {
  current: {},
  votes: {}
}

const sendUpdate = (type, msg) => {
  const clientsArr = Object.values(clients[type])
  for (let i = 0 ; i < clientsArr.length ; i++) {
    const res = clientsArr[i]
    res.write(`data: ${JSON.stringify(msg)}\n\n`)
  }
}

router.get('/', (req, res) => {
  res.send('Not Eurovision Voting System Server')
})

router.get('/current', (req, res) => {
  res.json(state)
})

router.post('/current', (req, res) => {
  const keys = Object.keys(req.body)
  for (let k = 0 ; k < keys.length ; k++) {
    if (keys[k] in state) {
      state[keys[k]] = req.body[keys[k]]
    }
  }

  sendUpdate('current', state)
  res.sendStatus(204)
})

router.post('/vote', (req, res) => {
  res.sendStatus(204)
})

router.get('/vote/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  })
  res.write('\n')

  const uuid = uuidv4()
  clients.votes[uuid] = res
  console.info(`${Object.keys(clients.votes).length} votes clients`)

  req.on('close', () => {
    delete clients.votes[uuid]
    console.info(`${Object.keys(clients.votes).length} votes clients`)
   })
})

router.get('/current/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  })
  res.write('\n')

  const uuid = uuidv4()
  clients.current[uuid] = res
  console.info(`${Object.keys(clients.current).length} current clients`)

  res.write(`data: ${JSON.stringify(state)}\n\n`)

  req.on('close', () => {
    delete clients.current[uuid]
    console.info(`${Object.keys(clients.current).length} current clients`)
  })
})

module.exports = router
