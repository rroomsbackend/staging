export default (bookingDetails) => {
    return `
   <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>No-Show Notification</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #d9534f; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">No-Show Notification</h1>
                <p style="margin: 0; font-size: 18px;">The guest for <strong>${bookingDetails.hotelName}</strong> did not check in on <strong>${bookingDetails.checkInDate}</strong>. This booking has been marked as a No-Show in our system.</p>
                <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="No-Show" style="width: 60px; margin-top: 15px;">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>Booking Details :</h3>
                <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                <p><strong>Guest Name:</strong> ${bookingDetails.guestName}</p>
                <p><strong>Check-in:</strong> ${bookingDetails.checkInDate}</p>
                <p><strong>Check-out:</strong> ${bookingDetails.checkOutDate}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h3>Next Steps</h3>
                <ul style="list-style-type: none; padding: 0;">
                    <li>✅ Update your availability calendar if the property is now open for new bookings.</li>
                    <li>✅ Process any applicable charges as per your cancellation/no-show policy.</li>
                    <li>✅ Report any concerns regarding the booking to our support team.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>If you need any further assistance, feel free to contact us at <a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                <p><strong>Best regards,</strong></p>
                <p><strong>RROOMS Hospitality India Pvt. Ltd.</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};