var url = require('url');
var querystring = require('querystring');


exports.parse = function (xmppURI) {
    var parsed = url.parse(xmppURI);
    var query = parsed.query;
    var queryType = null;
    var parameters = {};

    if (query) {
        queryType = query.split(';', 1)[0];
        query = query.slice(queryType.length + 1);
        parameters = querystring.decode(query, ';', '=');
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
            parts.push(';');
            parts.push(querystring.encode(data.parameters, ';', '='));
        }
    }

    return parts.join('');
};
