var url = require('url');


exports.parse = function (xmppURI) {
    var parsed = url.parse(xmppURI);
    var query = parsed.query;
    var queryType = null;
    var parameters = {};

    if (query) {
        var parts = query.split(';');
        queryType = parts.shift();
        parts.forEach(function (part) {
            part = part.split('=');
            parameters[part[0]] = decodeURIComponent(part[1]);
        });
    }

    var authJID = null;
    var targetJID = null;

    if (parsed.slashes) {
        if (parsed.auth) {
            authJID = parsed.auth + '@' + parsed.host;
        } else {
            authJID = parsed.host;
        }
        if (parsed.pathname) {
            targetJID = parsed.pathname.substr(1);
        }
    } else {
        if (parsed.auth) {
            targetJID = parsed.auth + '@' + parsed.host;
        } else {
            targetJID = parsed.host;
        }
        if (parsed.pathname && parsed.pathname !== '/') {
            targetJID += parsed.pathname;
        }
    }

    return {
        account: authJID,
        jid: targetJID,
        action: queryType,
        parameters: parameters
    };
};

exports.create = function (data) {
    var parts = ['xmpp:'];
    if (data.account) {
        parts.push('//');
        parts.push(encodeURI(data.account));
    }
    if (data.jid) {
        if (data.account) {
            parts.push('/');
        }
        parts.push(encodeURI(data.jid));
    }
    if (data.action) {
        parts.push('?');
        parts.push(encodeURIComponent(data.action));
        if (data.parameters) {
            var keys = Object.keys(data.parameters);
            keys = keys.sort();

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                parts.push(';');
                parts.push(encodeURIComponent(key));
                parts.push('=');
                parts.push(encodeURIComponent(data.parameters[key]));
            }
        }
    }

    return parts.join('');
};
