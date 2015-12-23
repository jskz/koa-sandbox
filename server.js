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

app.use(koaBasicAuth)
app.use(koaStatic(__dirname + '/static'))

app.use(koaMount('/secret', auth({name: 'user', pass: 'password'})))

app.use(function *(next) {
    console.log('Test middleware - pre-yield.')
    yield next;
    console.log('Test middleware - post-yield.')
})

app.use(function *() {
    console.log('Setting responsive body to `Hello Koa!`')
    console.log(this)

    this.body = `Hello Koa!`
})

app.listen(8080)
