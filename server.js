import koa from 'koa'

let app = koa()

app.use(function *(next) {
    console.log('Test middleware.')
    next()
})

app.use(function *() {
    this.body = `Hello Koa!`
})

app.listen(8080)
