var test = require('tape');
var xmppuri = require('../');


test('JID only', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com');
    t.equal(res.jid, 'user@example.com');
    t.end();
});

test('JID with resource', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com/resource');
    t.equal(res.jid, 'user@example.com/resource');
    t.end();
});

test('JID with only domain', function (t) {
    var res = xmppuri.parse('xmpp:example.com');
    t.equal(res.jid, 'example.com');
    t.end();
});

test('JID with domain and resource', function (t) {
    var res = xmppuri.parse('xmpp:example.com/resource');
    t.equal(res.jid, 'example.com/resource');
    t.end();
});

test('URI with query command, no parameters', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com/resource?message');
    t.equal(res.jid, 'user@example.com/resource');
    t.equal(res.action, 'message');
    t.end();
});

test('URI with query and parameters', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com/resource?message;body=test;subject=weeeee');
    t.equal(res.jid, 'user@example.com/resource');
    t.equal(res.action, 'message');
    t.same(res.parameters, {
        subject: 'weeeee',
        body: 'test'
    });
    t.end();
});

test('URI with encoded parameter values', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com/resource?message;body=test%20using%20%3d%20and%20%3b;subject=weeeee');
    t.equal(res.jid, 'user@example.com/resource');
    t.equal(res.action, 'message');
    t.same(res.parameters, {
        subject: 'weeeee',
        body: 'test using = and ;'
    });
    t.end();
});

test('Account selection only', function (t) {
    var res = xmppuri.parse('xmpp://me@example.com');
    t.equal(res.account, 'me@example.com');
    t.end();
});

test('Account selection with JID', function (t) {
    var res = xmppuri.parse('xmpp://me@example.com/user@example.com');
    t.equal(res.account, 'me@example.com');
    t.equal(res.jid, 'user@example.com');
    t.end();
});

test('Account selection with JID with resource', function (t) {
    var res = xmppuri.parse('xmpp://me@example.com/user@example.com/resource');
    t.equal(res.account, 'me@example.com');
    t.equal(res.jid, 'user@example.com/resource');
    t.end();
});

test('Account selection with full JID and query action with parameters', function (t) {
    var res = xmppuri.parse('xmpp://me@example.com/user@example.com/resource?message;body=kitchen%20sink;subject=allthethings');
    t.equal(res.account, 'me@example.com');
    t.equal(res.jid, 'user@example.com/resource');
    t.equal(res.action, 'message');
    t.same(res.parameters, {
        subject: 'allthethings',
        body: 'kitchen sink'
    });
    t.end();
});

test('Create URI with just account', function (t) {
    var res = xmppuri.create({
        account: 'me@example.com'
    });
    t.equal(res, 'xmpp://me@example.com');
    t.end();
});

test('Create URI with just JID', function (t) {
    var res = xmppuri.create({
        jid: 'user@example.com'
    });
    t.equal(res, 'xmpp:user@example.com');
    t.end();
});

test('Create URI with just JID and resource', function (t) {
    var res = xmppuri.create({
        jid: 'user@example.com/@resource='
    });
    t.equal(res, 'xmpp:user@example.com/@resource=');
    t.end();
});

test('Create URI with just JID and query action', function (t) {
    var res = xmppuri.create({
        jid: 'user@example.com/@resource=',
        action: 'subscribe'
    });
    t.equal(res, 'xmpp:user@example.com/@resource=?subscribe');
    t.end();
});

test('Create URI with JID and query action with parameters', function (t) {
    var res = xmppuri.create({
        jid: 'user@example.com/@resource=',
        action: 'message',
        parameters: {
            body: 'testing',
            thread: 'thread-id'
        }
    });
    t.equal(res, 'xmpp:user@example.com/@resource=?message;body=testing;thread=thread-id');
    t.end();
});

test('Create URI with selected account and query with parameters', function (t) {
    var res = xmppuri.create({
        account: 'me@example.com',
        jid: 'user@example.com/@resource=',
        action: 'message',
        parameters: {
            body: 'testing',
            thread: 'thread-id'
        }
    });
    t.equal(res, 'xmpp://me@example.com/user@example.com/@resource=?message;body=testing;thread=thread-id');
    t.end();
});
