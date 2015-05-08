var url = require('url');
var querystring = require('querystring');
var xmppjid = require('xmpp-jid');


exports.parse = function (xmppURI) {
    var parsed = url.parse(xmppURI);
    var query = parsed.query;
    var queryType = null;
    var parameters = {};

    if (parsed.protocol !== 'xmpp:') {
        return false;
    }

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
            targetJID += decodeURIComponent(parsed.pathname);
        }
    }

    return {
        account: authJID,
        jid: xmppjid.parse(targetJID || ''),
        action: queryType,
        parameters: parameters
    };
};

exports.create = function (data) {
    var jid;
    var parts = ['xmpp:'];
    if (data.account) {
        parts.push('//');
        jid = xmppjid.parse(data.account);
        if (jid.local) {
            parts.push(encodeURIComponent(jid.local));
            parts.push('@');
        }
        parts.push(encodeURI(jid.domain));
    }
    if (data.jid) {
        if (data.account) {
            parts.push('/');
        }
        jid = xmppjid.parse(data.jid);
        if (jid.local) {
            parts.push(encodeURIComponent(jid.local));
            parts.push('@');
        }
        parts.push(encodeURI(jid.domain));
        if (jid.resource) {
            parts.push('/');
            parts.push(encodeURIComponent(jid.resource));
        }
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
