const run = require('./app');
const port = 5002

run().then((app) => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
})
