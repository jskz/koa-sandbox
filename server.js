import koa from 'koa'
import koaMount from 'koa-mount'
import koaStatic from 'koa-static'
import basicAuth from 'basic-auth'

let app = koa()

const validUsers = [
    { name: 'username', password: 'password' },
    { name: 'another', password: '123456789' }
]
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
})

secret.use(function *(next) {
    let credentials = basicAuth(this)
    if(!credentials || !credentials.name || !credentials.pass)
        this.throw(401)
    console.log(credentials)

    for(let user of validUsers) {
        if(user.name == credentials.name && user.password == credentials.pass) {
            this.user = user
            yield next;
        }
    }

    if(!this.user)
        this.throw(401)
})

secret.use(function *(next) {
    this.body = `Highly secretive information here for ${this.user.name}'s eyes only.`
})

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
