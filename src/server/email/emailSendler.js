const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.timeweb.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'support@easyqr.ru',
        pass: 'nNZw6TsT'
    }
});


let sendMail = (mailOptions)=>{
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
};


module.exports = sendMail;
