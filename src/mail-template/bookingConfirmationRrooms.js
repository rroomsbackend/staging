export default (bookingDetails) => {
    return `
      <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Confirmation</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px;  margin:auto">
        <tr>
           <td style="background-color: #222; padding: 20px; text-align: left;">
                <img alt="" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #ff8c00; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">New Booking Created</h1>    
                <p style="margin: 0; font-size: 18px;">A new booking has been confirmed on RROOMS. Please find the details below:</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>Booking Details</h3>
                <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                <p><strong>Guest Name:</strong> ${bookingDetails.guestName}</p>
                <p><strong>Guest Mobile:</strong> ${bookingDetails.guestMobile}</p>
                <p><strong>Property Name:</strong> ${bookingDetails.hotelName}</p>
                <p><strong>Property Email:</strong> ${bookingDetails.hotelEmail}</p>
                <p><strong>Property Mobile:</strong> ${bookingDetails.hotelPhone}</p>
                <p><strong>Check-in Date & Time:</strong> ${bookingDetails.checkInTime}</p>
                <p><strong>Check-out Date & Time:</strong> ${bookingDetails.checkOutTime}</p>
                <p><strong>Total Booking Amount:</strong> ₹${bookingDetails.bookingAmout}</p>
                <p><strong>Amount Paid Online:</strong> ₹${bookingDetails.collectedPayment ? bookingDetails.collectedPayment : "₹0"}</p>
                <p><strong>Pay at Hotel:</strong> ₹${parseInt(bookingDetails.balanceAmount)}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <h3>Action Required</h3>
                <ul>
                    <li>Ensure smooth coordination between guest and property owner.</li>
                    <li>Verify payment and update financial records.</li>
                    <li>Monitor property performance and guest feedback.</li>
                </ul>
                <p>For further details, visit the admin dashboard or contact the Support Team at <a href="mailto:info@rrooms.in">info@rrooms.in</a>.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #222; text-align: center; color: #ffffff; font-size: 14px;">
                <p>Best regards,</p>
                <p><strong>RROOMS Hospitality India Pvt. Ltd.</strong></p>
                <p>Email: <a href="mailto:info@rrooms.in" style="color: #ff8c00; text-decoration: none;">info@rrooms.in</a></p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};