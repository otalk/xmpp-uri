var test = require('tape');
var xmppuri = require('../');

test('Wrong protocol', function (t) {
    var res = xmppuri.parse('https://example.com');
    t.equal(res, false);
    t.end();
});

test('JID only', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com');
    t.equal(res.jid.full, 'user@example.com');
    t.end();
});

test('JID with resource', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com/resource');
    t.equal(res.jid.full, 'user@example.com/resource');
    t.end();
});

test('JID with only domain', function (t) {
    var res = xmppuri.parse('xmpp:example.com');
    t.equal(res.jid.full, 'example.com');
    t.end();
});

test('JID with domain and resource', function (t) {
    var res = xmppuri.parse('xmpp:example.com/resource');
    t.equal(res.jid.full, 'example.com/resource');
    t.end();
});

test('URI with query command, no parameters', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com/resource?message');
    t.equal(res.jid.full, 'user@example.com/resource');
    t.equal(res.action, 'message');
    t.end();
});

test('URI with query and parameters', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com/resource?message;body=test;subject=weeeee');
    t.equal(res.jid.full, 'user@example.com/resource');
    t.equal(res.action, 'message');
    t.same(res.parameters, {
        subject: 'weeeee',
        body: 'test'
    });
    t.end();
});

test('URI with encoded parameter values', function (t) {
    var res = xmppuri.parse('xmpp:user@example.com/resource?message;body=test%20using%20%3d%20and%20%3b;subject=weeeee');
    t.equal(res.jid.full, 'user@example.com/resource');
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
    t.equal(res.jid.full, 'user@example.com');
    t.end();
});

test('Account selection with JID with resource', function (t) {
    var res = xmppuri.parse('xmpp://me@example.com/user@example.com/resource');
    t.equal(res.account, 'me@example.com');
    t.equal(res.jid.full, 'user@example.com/resource');
    t.end();
});

test('Account selection with full JID and query action with parameters', function (t) {
    var res = xmppuri.parse('xmpp://me@example.com/user@example.com/resource?message;body=kitchen%20sink;subject=allthethings');
    t.equal(res.account, 'me@example.com');
    t.equal(res.jid.full, 'user@example.com/resource');
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
    t.equal(res, 'xmpp:user@example.com/%40resource%3D');
    t.end();
});

test('Create URI with just JID and query action', function (t) {
    var res = xmppuri.create({
        jid: 'user@example.com/@resource=',
        action: 'subscribe'
    });
    t.equal(res, 'xmpp:user@example.com/%40resource%3D?subscribe');
    t.end();
});

test('Create URI with JID and query action with parameters', function (t) {
    var res = xmppuri.create({
        jid: 'user@example.com/@?resource=',
        action: 'message',
        parameters: {
            body: 'testing',
            thread: 'thread-id'
        }
    });
    t.equal(res, 'xmpp:user@example.com/%40%3Fresource%3D?message;body=testing;thread=thread-id');
    t.end();
});

test('Create URI with selected account and query with parameters', function (t) {
    var res = xmppuri.create({
        account: 'me@example.com',
        jid: 'user@example.com/@?resource=',
        action: 'message',
        parameters: {
            body: 'testing',
            thread: 'thread-id'
        }
    });
    t.equal(res, 'xmpp://me@example.com/user@example.com/%40%3Fresource%3D?message;body=testing;thread=thread-id');
    t.end();
});

test('Nasty examples from RFC', function (t) {
    var res = xmppuri.create({
        jid: 'nasty!#$%()*+,-.;=?[\\]^_`{|}~node@example.com/repulsive !#"$%&\'()*+,-./:;<=>?@[\\]^_`{|}~resource',
        action: 'message'
    });
    t.equal(res, 'xmpp:nasty!%23%24%25()*%2B%2C-.%3B%3D%3F%5B%5C%5D%5E_%60%7B%7C%7D~node@example.com/repulsive%20!%23%22%24%25%26\'()*%2B%2C-.%2F%3A%3B%3C%3D%3E%3F%40%5B%5C%5D%5E_%60%7B%7C%7D~resource?message');

    var res2 = xmppuri.parse(res);
    t.equal(res2.jid.full, 'nasty!#$%()*+,-.;=?[\\]^_`{|}~node@example.com/repulsive !#"$%&\'()*+,-./:;<=>?@[\\]^_`{|}~resource');
    t.end();
});
