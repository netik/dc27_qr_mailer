# dc27_qr_mailer

DC27 QR Code mailer (Node JS)

This is a set of scripts to take a CSV file from shipstation.com 
and then individually mail the people in that file with a QR code.

The QR code is just their email address. The mail also contains
some basic ordering information like Quantity ordered and price
ordered at.

We used this to send people a scannable QR code that we could lookup
using the shipstation mobile app, at a table at DEF CON. 

## To use:

```
mkdir keys
mkdir customers
mkdir codes
cp keys-dist.js keys/index.js
```

Edit keys/index.js -- add your sparkpost key.

Place a "orders.csv" file into `customers/`
there. You can get a dump from shipsation by using 'export orders'

Edit the files underneath `emails/ides/...` to set up the message.
These things use terrible PUG templates to get the job done. They work
but they're hard to maintain.

Run `node process.js` to start the run.

You might also want to disable sending to make sure the email will
go out correctly.
