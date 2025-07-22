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
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px;  margin:auto">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                   <img alt="" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #5cb85c; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">Guest Successfully Checked Out</h1>
                <p style="margin: 0; font-size: 18px;">The guest for your property <strong>${bookingDetails.hotelName}</strong> has successfully checked out on ${bookingDetails.checkOutTime}.</p>
                <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Check-Out Success" style="width: 100px; margin-top: 15px;">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>Booking Details :</h3>
                <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                <p><strong>Guest Name:</strong> ${bookingDetails.guestName}</p>
                <p><strong>Check-in:</strong> ${bookingDetails.checkInTime} & ${bookingDetails.checkInDateTime}</p>
                <p><strong>Check-out:</strong> ${bookingDetails.checkOutTime} & ${bookingDetails.checkOutDateTime}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: left;">
                <h3>Next Steps:</h3>
                <ul>
                    <li>✅ Prepare the property for the next guest.</li>
                    <li>✅ Review and rate the guest (if applicable).</li>
                    <li>✅ Update your availability calendar.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>If you have any questions, reach out to us at <a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                <p>Thank you for being a valued partner!</p>
                <p><strong>Best regards,</strong></p>
                <p><strong>RROOMS Hospitality India Pvt. Ltd.</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};