Recursive CSS exfiltration server based on Pepe Vila's script (https://gist.github.com/cgvwzq/6260f0f0a47c009c87b4d46ce3808231).

Run the server with `node server.js` and open `index.html` to start the attack.

The page will recursively load CSS stylesheets and exfiltrate a CSRF token value.

Useful links to understand the attack:
- https://portswigger.net/research/blind-css-exfiltration
- https://vwzq.net/slides/2019-s3_css_injection_attacks.pdf
- https://book.hacktricks.xyz/pentesting-web/xs-search/css-injection#import
