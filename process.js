const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const nodeMailer = require ('nodeMailer');
const QRCode = require('QRCode');
const Email = require('email-templates');
const uuid4 = require('uuid4')
const filenamify = require('filenamify');

const keys = require('./keys');

let transporter = nodeMailer.createTransport({
	logger: true,
	debug: true,
        host: 'smtp.sparkpostmail.com',
        port: 587,
        auth: {
	    user: 'SMTP_injection',
            pass: keys.APIKEY,
        },
    });

fs.createReadStream('orders.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
	    let i = 0;
	    console.log(results.length);
	    while (i < results.length) {
		let amount = parseFloat(results[i]['Amount - Paid by Customer']);

		if (amount >= 100.00) {

		    // we have a valid order.
		    const order_id  = results[i]['Order - Number'];
		    const name      = results[i]['Ship To - Name'];
		    const amount    = results[i]['Amount - Paid by Customer'];
		    const emailAddr = results[i]['Customer Email'];
		    //const emailAddr = 'jna@retina.net';
		    const qty       = results[i]['Count - Number of Items'];
		    const thisuuid = uuid4() + '.png';
		    const fn = 'codes/' + filenamify(emailAddr,{replacment:'_'}) + '.png';

		    console.log(thisuuid + ' - ' + emailAddr + ' - ' + fn);

		    let img = QRCode.toFile(fn,
					    emailAddr,
					    { errorCorrectionLevel: 'H', scale: 8 } );

		    const email = new Email({
			    message: {
				from: 'Team Ides <sales@troupeit.com>',
				subject: 'da Bomb: DEFCON 27 Badge Pickup',
				replyTo: 'sales@retina.net',
				attachments:
				    [{
					filename: 'qrcode.png',
					path: fn,
					cid: thisuuid //same cid value as in the html img src
				    },
				    {
					filename: 'face.png',
					path: 'face.png',
					cid: 'bombface' //same cid value as in the html img src
				    }],
			    },
			    // uncomment below to send emails in development/test env:
			    send: true,
			    transport: transporter,
			});

      email
			.send({
				template: 'ides',
				    message: {
				    to: emailAddr
					},
				    locals: {
				        name: name,
					qty: qty,
					paid: amount,
					email: emailAddr,
					cid: thisuuid
					}
			    })
			.then(console.log)
		}
		i = i + 1;
	    }
	});
