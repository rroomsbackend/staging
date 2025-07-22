export default (bookingDetails) => {
    return `
   <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Staying with Us!</title>
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
                <h1 style="margin: 0; font-size: 28px;">Thank You for Staying with Us!</h1>
                <p style="margin: 5px 0 15px; font-size: 18px;">Dear ${bookingDetails.guestName},</p>
                <p style="margin: 0; font-size: 18px;">We hope you had a wonderful stay at <strong>${bookingDetails.hotelName}</strong>!</p>
                <p style="margin: 0; font-size: 18px;">Your check-out on <strong>${bookingDetails.checkOutTime}</strong> has been successfully recorded.</p>
                <img src="https://cdn-icons-png.flaticon.com/512/1040/1040236.png" alt="Thank You" style="width: 100px; margin-top: 15px;">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>Booking Details :</h3>
                <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                <p><strong>Hotel:</strong> ${bookingDetails.hotelName}, ${bookingDetails.hotelAddress}</p>
                <p><strong>Check-in:</strong> ${bookingDetails.checkInTime} &  ${bookingDetails.checkInDateTime}</p>
                <p><strong>Check-out:</strong> ${bookingDetails.checkOutTime} &  ${bookingDetails.checkOutDateTime}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h3>We'd Love Your Feedback!</h3>
                <p>Your experience matters to us! Please take a moment to share your feedback by leaving a review.</p>
                <a href="https://rrooms.in/login" style="display: inline-block; padding: 10px 20px; background-color: #ff8c00; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 18px;">Leave a Review</a>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>If you need any further assistance, feel free to contact us at <a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                <p>We look forward to welcoming you again soon!</p>
                <p><strong>Best regards,</strong></p>
                <p><strong>RROOMS Hospitality India Pvt. Ltd.</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};