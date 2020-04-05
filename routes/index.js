const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')

const state = {
    country: 'France'
}
const clients = {}

const sendUpdate = (msg) => {
    const clientsArr = Object.values(clients)
    for (let i = 0 ; i < clientsArr.length ; i++) {
        const res = clientsArr[i]
        res.write(`data: ${JSON.stringify(msg)}\n\n`)
    }
}

router.get('/', (req, res) => {
    console.info(req)
    res.send('Not Eurovision Voting System Server')
})

router.get('/info', (req, res) => {
    res.json({ started: false, year: new Date().getFullYear() })
})

router.get('/current', (req, res) => {
    res.json({ country: state.country })
})

router.post('/current', (req, res) => {
    const keys = Object.keys(req.body)
    for (let k = 0 ; k < keys.length ; k++) {
        if (state[keys[k]]) {
            state[keys[k]] = req.body[keys[k]]
        }
    }

    sendUpdate(state)
    res.sendStatus(204)
})

router.get('/current/stream', (req, res) => {
   res.writeHead(200, {
       'Content-Type': 'text/event-stream',
       'Cache-Control': 'no-cache',
       'Connection': 'keep-alive'
   })
   res.write('\n')

   const uuid = uuidv4()
   clients[uuid] = res
   console.info(`New client: ${uuid}`)

   res.write(`data: ${JSON.stringify({ country: state.country })}\n\n`)

   req.on('close', () => {
       console.info(`Client disconnected: ${uuid}`)
       delete clients[uuid]
   })
})

module.exports = router
