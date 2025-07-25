exports.passwordUpdated = (email, name) => {
  const frontendURL = process.env.FRONTEND_URL;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Update Confirmation</title>
  <style>
    body {
      background-color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.4;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
    }
    .message {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #1a1a1a;
    }
    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .support {
      font-size: 14px;
      color: #999999;
      margin-top: 20px;
    }
    .highlight {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="${frontendURL}">
      <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo" />
    </a>
    <div class="message">Password Update Confirmation</div>
    <div class="body">
      <p>Hey ${name},</p>
      <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.</p>
      <p>If you did not request this password change, please contact us immediately to secure your account.</p>
    </div>
    <div class="support">
      If you have any questions or need further assistance, feel free to contact us at
      <a href="mailto:rajamitstm@gmail.com">rajamitstm@gmail.com</a>. We're here to help!
    </div>
  </div>
</body>
</html>`;
};
