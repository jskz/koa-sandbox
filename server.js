import koa from 'koa'
import koaBasicAuth from 'koa-basic-auth'
import koaMount from 'koa-mount'
import koaStatic from 'koa-static'

let app = koa()

const HTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Koa Sandbox</title>
</head>

<body>
</body>
</html>`

app.use(koaStatic(__dirname + '/static'))

let secret = koa()

secret.use(function *(next) {
    try {
        yield next
    } catch(err) {
        if(401 == err.status) {
            this.status = 401
            this.set('WWW-Authenticate', 'Basic')
            this.body = 'Authentication failed.'
        } else {
            throw err
        }
    }

    this.body = 'Highly secretive information here!'
})

secret.use(koaBasicAuth({name: 'username', pass: 'password'}))

app.use(koaMount('/secret', secret))

app.use(function *(next) {
    console.log('Test middleware - pre-yield.')
    yield next
    console.log('Test middleware - post-yield.')
})

app.use(function *(next) {
    yield next;

    this.body = 'Setting body from inner root middleware.'
})

app.listen(8080)
