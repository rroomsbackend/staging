export default (OwnerEmail, PropertyOwner, PropertyName, PropertyAddres, Password, noOfRooms) => {
    console.log(OwnerEmail, PropertyOwner, PropertyName, PropertyAddres, Password, noOfRooms);

    return `
  <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to RRooms!</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #fd9e22; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">Welcome to RROOMS!</h1>
                <p style="margin: 5px 0 15px; font-size: 18px;">Dear ${PropertyOwner},</p>
                <p style="margin: 0; font-size: 18px;">We are excited to inform you that your property, <strong>${PropertyName}</strong> - (${PropertyAddres}) with <strong>${noOfRooms}</strong> rooms, has successfully completed the onboarding process on RRooms!</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>What’s Next?</h3>
                <p>Please send your acceptance of the contract agreement, and your property will be available to receive your guest booking.</p>
                <p>You can manage bookings, update property details, and track performance via your RRooms. PMS Dashboard.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #ffffff;">
                <h3>PMS Login Details:</h3>
                <p><strong>Login ID:</strong> ${OwnerEmail}</p>
                <p><strong>Login Password:</strong> ${Password}</p>
                <p style="text-align: center; margin-top: 20px;">
                    <a href="https://rrooms.in/register" 
                       style="background-color: #fd9e22; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
                        Login to PMS
                    </a>
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h3>Need Assistance?</h3>
                <p>Our support team is available to assist you with any queries or optimizations.</p>
                <p>For any support or guidance, feel free to contact us at <a href="mailto:info@rrooms.in">info@rrooms.in</a> or visit our <a href="https://rrooms.in/help-center">Help Center</a>.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>We’re thrilled to have you onboard and look forward to a successful partnership!</p>
                <p><strong>Best regards,</strong></p>
                <p><strong>RRooms Hospitality India Pvt. Ltd.</strong></p>
                <p><a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
            </td>
        </tr>
    </table>

    <script>
      function copyToClipboard(elementId) {
        const text = document.getElementById(elementId).innerText;
        navigator.clipboard.writeText(text)
          .then(() => {
            alert('Copied to clipboard!');
          })
          .catch(err => {
            alert('Failed to copy text.');
          });
      }
    </script>
</body>
</html>
    `;
};