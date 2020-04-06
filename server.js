#!/usr/bin/env node

const app = require('./app')
const PORT = process.env.PORT || 1337

app.listen(PORT, e => {
    if (e) console.error(e)
    console.info(`Server started at http://localhost:${PORT}`)
})
