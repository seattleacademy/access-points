// based on https://github.com/maxogden/iwlist/

var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var EventEmitter = require('events').EventEmitter;
var http = require('http')
var dns = require('dns')

module.exports = function (iface) {
    return new IW(iface);
};

function IW (iface) {
    if (!(this instanceof IW)) return new IW(iface);
    this.iface = iface;
}

IW.prototype = new EventEmitter;


IW.prototype.scan = function (cb) {
    var ps = spawn('iwlist', [ this.iface, 'scan' ]);
    
    var line = '';
    ps.stdout.on('data', function ondata (buf) {
        for (var i = 0; i < buf.length; i++) {
            if (buf[i] === 10) {
                parseLine(line);
                line = '';
            }
            else line += String.fromCharCode(buf[i]);
        }
    });
    
    var stderr = '';
    ps.stderr.on('data', function (buf) { stderr += buf });
    
    ps.on('close', function () {
        if (code !== 0) return cb('code = ' + code + '\n', stderr);
        ap.sort(function(a, b) {
            var x = a['signal']; var y = b['signal'];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }).reverse()
        cb(null, ap);
    });
    
    var code;
    ps.on('exit', function (c) {
        code = c;
    });
    
    var ap = []
    var current = null;
    function parseLine (line) {
        var m;
        
        if (m = /^\s+Cell \d+ - Address: (\S+)/.exec(line)) {
            current = { address : m[1] };
            ap.push(current);
            return;
        }
        if (!current) return;
        
        if (m = /^\s+ESSID:"(.+)"/.exec(line)) {
            current.essid = m[1];
        }

        if (m = /Signal level=(.+?)\//.exec(line)) {
          current.signal = +m[1]
        }
    }
};
