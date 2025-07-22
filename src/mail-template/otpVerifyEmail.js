const otpMailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr>
            <td style="padding: 30px 20px; text-align: center; background-color: #0275d8; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">Verify Your Email Address</h1>
                <p style="margin: 10px 0 0; font-size: 18px;">Dear Property Partner,</p>
                <p style="margin: 10px 0; font-size: 16px;">To complete your registration, please verify your email address by entering the following One-Time Password (OTP):</p>
                <div style="margin: 20px auto; font-size: 26px; font-weight: bold; background-color: #fff; color: #0275d8; display: inline-block; padding: 12px 24px; border-radius: 8px; letter-spacing: 2px;">
                    ${otp}
                </div>
                <p style="margin: 20px 0 0; font-size: 14px; color: #e2e2e2;">If you did not initiate this request, please ignore this email.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>If you need any assistance, please contact us at <a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                <p><strong>Best regards,</strong></p>
                <p><strong>Team RROOMS</strong><br>www.rrooms.in</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;
export default otpMailTemplate;
