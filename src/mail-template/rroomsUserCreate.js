export default (employeeName, userCode, email, designation, role, password) => `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to RROOMS!</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #5cb85c; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">Welcome to RROOMS!</h1>
                <p style="margin: 5px 0 15px; font-size: 18px;">Dear ${employeeName},</p>
                <p style="margin: 0; font-size: 18px;">Your account has been successfully created!</p>
                <p style="margin: 0; font-size: 18px;">You are now ready to explore and manage your account with ease.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>Your Account Details:</h3>
                <p><strong>Employee ID:</strong> ${userCode}</p>
                <p><strong>Role:</strong> ${role == 1 ? "Rrooms Super Admin" : role == 2 ? "Rrooms Admin" : role == 3 ? "Property Super Admin" : role == 4 ? "Property Admin" : role == 5 ? "Manager" : role == 6 ? "Captain" : "Admin"}</p>
                <p><strong>Designation:</strong> ${designation == 1 ? "MD" : designation == 2 ? "GM" : designation == 3 ? "AGM" : designation == 4 ? "FOM" : designation == 5 ? "SDM" : designation == 6 ? "SDC" : designation == 7 ? "HK Supervisor" : designation == 8 ? "HK Executive" : designation == 9 ? "Accounts Manager" : designation == 10 ? "Accounts Executive" : designation == 11 ? "Store Manager (Kitchen)" : designation == 12 ? "Store Incharge" : "RSOT"}</p>
                <p><strong>Username:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> ${password} (You can update this in your profile settings)</p>
                <p><strong>Login Link:</strong> <a href="https://rrooms.in/admin-login" style="color: #ff8c00; text-decoration: none;">Click here to log in</a></p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h3>Next Steps:</h3>
                <p>✅ Log in to your account and explore your dashboard.</p>
                <p>✅ Update your profile with essential details.</p>
                <p>✅ Add or manage properties seamlessly.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                <p>We look forward to having you on board!</p>
                <p><strong>Best regards,</strong></p>
                <p><strong>RROOMS Hospitality India Pvt. Ltd.</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>

`;
