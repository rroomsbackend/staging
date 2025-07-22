export default (propertyOwner, propertyName, propertyCode, initiatorName, propertyAddress) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Property Onboarding Successful</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto">
            <tr>
                <td style="background-color: #222; padding: 20px; text-align: left;">
                    <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; text-align: left; background-color: #00475b; color: #ffffff;">
                    <h3 style="margin: 0;">Dear ${propertyOwner},</h3>
                    <p style="margin: 10px 0 0;">We are pleased to inform you that the onboarding process for the following property has been successfully completed, and the property has been approved for listing on RROOMS.</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; background-color: #e8f4f8;">
                    <h3>Property Details:</h3>
                    <p><strong>Property Name:</strong> ${propertyName}</p>
                    <p><strong>Property ID:</strong> ${propertyCode}</p>
                    <p><strong>Location:</strong> ${propertyAddress}</p>
                    <p><strong>Growth Manager:</strong> ${initiatorName}</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 15px; background-color: #ffffff;">
                    <h3>What Happens Next:</h3>
                    <p>Your property is now listed and discoverable on the RROOMS platform within 24 hours.</p>
                    <p>You can manage availability, rates, and bookings from your dashboard.</p>
                    <p>Our team will continue to support you in maximizing your property's visibility and performance.</p>
                    <p>You should have received an email related to your property, which contains the PMS credentials and the PMS login link.</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 15px;text-align: center; background-color: #e8f4f8;">
                    <h3>Need Assistance?</h3>
                    <p>If you have any questions or require assistance, please don't hesitate to reach out to our support team:</p>
                    <p>Email: <a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                </td>
            </tr>
            <tr>
                <td style="padding: 15px; text-align: center; background-color: #f4f4f4;">
                    <p>Welcome aboard, and thank you for choosing RROOMS!</p>
                    <p><strong>Best regards,</strong></p>
                    <p><strong>The RROOMS Team</strong></p>
                    <p><a href="https://www.rrooms.in" target="_blank">www.rrooms.in</a></p>
                    <p><a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};
