export default (bookingDetails) => {
    return `
   <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Check-Out Notification</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                   <img alt="" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #5cb85c; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">Guest Checked Out</h1>
                <p style="margin: 5px 0 15px; font-size: 18px;">Dear Team,</p>
                <p style="margin: 0; font-size: 18px;">The guest for <strong>${bookingDetails.hotelName}</strong> has successfully checked out.</p>
                <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Guest Checked Out"
                    style="width: 100px; margin-top: 15px;">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>Booking Details:</h3>
                <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                <p><strong>Guest Name:</strong> ${bookingDetails.guestName}</p>
                <p><strong>Property Name:</strong> ${bookingDetails.hotelName}</p>
                <p><strong>Check-in:</strong> ${bookingDetails.checkInDate} & ${bookingDetails.checkInDateTime}</p>
                <p><strong>Check-out:</strong> ${bookingDetails.checkOutDate} & ${bookingDetails.checkOutDateTime}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h3>Action Required</h3>
                <p>✅ Process any pending payments as per policy.</p>
                <p>✅ Update system records.</p>
                <p>✅ Monitor guest and host feedback for quality assurance.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>If you have any concerns, please contact <a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                <p><strong>Best regards,</strong></p>
                <p><strong>RROOMS Hospitality India Pvt. Ltd.</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};