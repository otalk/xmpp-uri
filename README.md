# XMPP-URI
**Parse and Create XMPP URIs**

[![Build Status](https://travis-ci.org/otalk/xmpp-uri.png)](https://travis-ci.org/otalk/xmpp-uri)
[![Dependency Status](https://david-dm.org/otalk/xmpp-uri.png)](https://david-dm.org/otalk/xmpp-uri)
[![devDependency Status](https://david-dm.org/otalk/xmpp-uri/dev-status.png)](https://david-dm.org/otalk/xmpp-uri#info=devDependencies)

[![Browser Support](https://ci.testling.com/otalk/xmpp-uri.png)](https://ci.testling.com/otalk/xmpp-uri)

## What is this?

The `xmpp-uri` module is for both parsing an XMPP URI to extract action commands and parameters, and creating a URI based on an action. Since XMPP URIs use `;` to separate values in the querystring, the normal URL parsing libs don't work as-is.

## Installing

```sh
$ npm install xmpp-uri
```

## Building bundled/minified version (for AMD, etc)

```sh
$ make 
```

The bundled and minified files will be in the generated `build` directory.

## Usage

```javascript
var xmppuri = require('xmpp-uri');

var res = xmppuri.parse('xmpp:user@example.com?message;body=hi');
// res == {
//     jid: 'user@example.com',
//     action: 'message',
//     parameters: {
//         body: 'hi'
//     }
// }
```

Most use cases will be with `xmpp:` URIs, but you can also use `xmpp://` to specify
a specific account to use for the action:

```javascript
var res = xmppuri.parse('xmpp://me@example.com/user@example.com/res?subscribe');
// res == {
//     account: {
//         local: 'me',
//         domain: 'example.com',
//         bare: 'me@example.com',
//         full: 'me@example.com'
//     },
//     jid: {
//         local: 'user',
//         domain: 'example.com',
//         resource: 'res',
//         bare: 'user@example.com',
//         full: 'user@example.com/res'
//     },
//     action: 'subscribe'
// }
```

The inverse operation can be done by using `xmppuri.create`:

```javascript
xmppuri.create({
    account: 'me@example.com',
    jid: 'user@example.com',
    action: 'message',
    parameters: {
        body: 'hi'
    }
});
// res == 'xmpp://me@example.com/user@example.com?message;body=hi'
```

## License

MIT

## Created By

If you like this, follow [@lancestout](http://twitter.com/lancestout) on twitter.
