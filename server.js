//Web Server to access web page
const http = require('http')

const server = http.createServer((req, res) => {

    //Create routes
    if (request.url === '/'){
        response.writeHead(200, {'Content-Type': 'text/plain'})
        response.end('Welcome to the landing page.')
    }
    else if(request.url === '/about'){
        response.writeHead(200, {'Content-Type': 'text/plain'})
        response.end('This is the landing page.')

    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'})
        response.end('Page not found')
    }
        

})

//Define a port
const port = 3300;

//Start server
server.listen(port, () => {
    console.log('Server is running')
})