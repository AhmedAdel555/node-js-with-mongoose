const fs = require('fs')

const requsetHandeler = function(req,res){
    const url = req.url
    const method = req.method
    if(url === '/'){
        res.setHeader('Content-Type', 'text/html')
        res.write('<html>')
        res.write('<head> <title> my first project </title> </head>')
        res.write(`<body> 
                <form action='/message' method='POST'> 
                    <input type='text' name='message'>
                    <button type='submit'> submit </button> 
                </form>
        </body>`)
        res.write('</html>')
        return res.end()
    }

    if(url === '/message' && method === 'POST'){
        const body = []
        req.on('data', (chunk) => {
            console.log(chunk)
            body.push(chunk)
        })
        return req.on('end', () => {
            const parseBody = Buffer.concat(body).toString()
            let message = parseBody.split('=')
            fs.writeFile('message.txt', message[1].replace('+', ' '), (err) => {
                if(err){
                    console.error(err)
                }
                else{
                    res.setHeader('Content-Type', 'text/html')
                    res.write('<html>')
                    res.write('<head> <title> my first project </title> </head>')
                    res.write(`<body> <h1> Hello ${message[1].replace('+', ' ')} </h1> </body>`)
                    res.write('</html>')
                    return res.end()
                }
            })
        })
        // res.statusCode = 302;
        // res.setHeader('Location', '/');
        // res.end()
    }
}

module.exports = {
    handler: requsetHandeler,
    text: 'Hello sir',
}

// module.exports = requsetHandeler

// module.exports.handler = requsetHandeler
// module.exports.text = 'Hello sir'