const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'projectinvitemailer@gmail.com', 
    pass: 'fnbs yvbt weie qite'       
  }
});

const sendInvitationEmail = async (recipientEmail, projectName) => {
  const mailOptions = {
    from: 'projectinvitemailer@gmail.com',
    to: recipientEmail,
    subject: `You're invited to join project: ${projectName}`,
    text: `You've been invited to collaborate on the project "${projectName}".`
  };

  return transporter.sendMail(mailOptions); 
};

module.exports = { sendInvitationEmail };
