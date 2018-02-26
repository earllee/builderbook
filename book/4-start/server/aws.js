import aws from 'aws-sdk';

export default function sendEmail(options) {
  aws.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.Amazon_accessKeyId,
    secretAccessKey: process.env.Amazon_secretAccessKey,
  });

  const ses = new aws.SES({ apiVersion: 'latest' });

  ses.sendEmail({
    Source: options.from,
    Destination: {
      CcAddresses: options.cc,
      ToAddresses: options.to,
    },
    Message: {
      Subject: {
        Data: options.subject,
      },
      Body: {
        Html: {
          Data: options.body,
        },
      },
    },
    ReplyToAddresses: options.replyTo,
  });
}
