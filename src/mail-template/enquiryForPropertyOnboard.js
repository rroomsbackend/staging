export default (email, name, mobile, property_name, address, state, cityName, pincode) => {
    return `
   <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enquiry Details - RROOMS</title>
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
                <h1 style="margin: 0; font-size: 28px;">New Enquiry Received!</h1>
                <p style="margin: 5px 0 15px; font-size: 18px;">Dear Admin,</p>
                <p style="margin: 0; font-size: 18px;">A new property enquiry has been submitted with the following details:</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>Enquiry Details:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Property Name:</strong> ${property_name}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>City:</strong> ${cityName}, ${state} - ${pincode}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h3>Next Steps:</h3>
                <p>✅ Review the enquiry and verify the details.</p>
                <p>✅ Reach out to the enquirer for further discussion.</p>
                <p>✅ Proceed with onboarding if the property meets criteria.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>If you need any further assistance, feel free to contact us at <a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                <p>We look forward to growing with you!</p>
                <p><strong>Best regards,</strong></p>
                <p><strong>RROOMS Hospitality India Pvt. Ltd.</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};