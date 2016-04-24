# access-points

parses iwlist output for access points on linux computers.

## install

```javascript
npm install access-points
```

## test

```javascript
var iw = require('access-points')();
iw.scan(console.log);
```

## scan(callback)

returns list of nearby wireless networks sorted by signal strength (high to low)

MIT LICENSED