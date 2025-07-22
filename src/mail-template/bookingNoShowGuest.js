export default (bookingDetails) => {
    return `
   <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking No-Show Notification</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto; font-size:17px">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr >
            <td style="padding: 20px;">
                <p>Dear ${bookingDetails.guestName},</p>
                Greetings from RROOMS.</p>
                <p>We noticed that your booking at Hotel ${bookingDetails.hotelName} for ${bookingDetails.checkInDate} was marked as a No Show, and we truly missed the opportunity to host you.</p>
                <p>At RROOMS, we always look forward to welcoming our guests with warmth and comfort, and it’s unfortunate that we couldn’t serve you this time. Sometimes, due to last-minute changes or unforeseen reasons, plans do get affected — and we completely understand.</p>
                <p>We’re reaching out just to confirm if you were indeed unable to check in, or if there might have been any confusion regarding the booking. Your confirmation will help us keep our records accurate and ensure proper coordination with the booking platform.</p>
                <p style="padding:0px;margin:0px;">If there’s anything we can assist you with or if you plan to visit us in the future, we would love to welcome you again with the hospitality you deserve.</p>
            </td>
        </tr>
        <tr>
  <td style="padding-bottom:10px; text-align: center;">
    <p>If this was a mistake or you want to confirm your stay, please click below:</p>
    <a href="mailto:support@rrooms.in?subject=Stay Confirmation - ${bookingDetails.bookingId}&amp;body=Yes, I stayed at the hotel as booked." style="background-color:#28a745; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; margin:5px; display:inline-block;">
      Yes, I Stayed
    </a>
    <a href="mailto:support@rrooms.in?subject=Stay Confirmation - ${bookingDetails.bookingId}&amp;body=No, I didn't stay at the hotel." style="background-color:#dc3545; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; margin:5px; display:inline-block;">
      No, I Didn't Stay
    </a>
  </td>
</tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>We hope to assist you with a future booking!</p>
                <p><strong>Best regards,</strong></p>
                <p><strong>RROOMS Hospitality India Pvt. Ltd.</strong></p>
                <p><a href="mailto:support@rrooms.in">support@rrooms.in</a>&nbsp; +91-7377378030</p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};