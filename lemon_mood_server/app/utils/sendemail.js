const nodemailer = require('nodemailer');

const SendEmail = function() {

};

SendEmail.send = function(mail, code,text, call) {
	let mailOptions = {
		from: 'dyfc100@qq.com',// sender email
		to: mail,
		subject: 'Lemon Mood',
		text: text||'[Lemon Mood]Your verification code is '+code+', if you did not operate it yourself, please ignore it.',
	};
	
	let transporter = nodemailer.createTransport({
		service: 'qq',
		port: 587,
		secure: true,
		auth: {
			user: 'dyfc100@qq.com', // sender email
			pass: 'ybcmyektcqnjbgjc' // smtp code
		}
	});
	
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			call && call(false);
		} else {
			call && call(true);
		}
	});

};

module.exports = SendEmail;
