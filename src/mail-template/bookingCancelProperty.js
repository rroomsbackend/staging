export default (bookingDetails) => {
    console.log("bookingDetails - ", bookingDetails);
    const reasonsList = bookingDetails.cancelReason
        ? bookingDetails.cancelReason.split(',')
            .filter(reason => reason.trim() !== '') // Remove empty values
            .map(reason => `<li>${reason.trim()}</li>`)
            .join('')
        : '<li>No reason provided.</li>'; // Default if no reason

    return `
   <!DOCTYPE html> 
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Cancellation Notification</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                   <img alt="" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #d9534f; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">Booking Cancelled</h1>
                <p style="margin: 0; font-size: 18px;">The booking for your property <strong>${bookingDetails.hotelName}</strong> has been cancelled.</p>
                <img src="https://cdn-icons-png.flaticon.com/512/11741/11741047.png" alt="Booking Cancelled"
                    style="width: 100px; margin-top: 15px;">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>Booking Details:</h3>
                <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                <p><strong>Guest Name:</strong> ${bookingDetails.guestName}</p>
                <p><strong>Check-in:</strong> ${bookingDetails.checkInDate} & ${bookingDetails.checkInTime}</p>
                <p><strong>Check-out:</strong> ${bookingDetails.checkOutDate} & ${bookingDetails.checkOutTime}</p>
                <p><strong>Booking Amount:</strong> ₹${bookingDetails.bookingAmout}</p>
                
                ${reasonsList ? `<h3>Cancellation Reason :</h3>
                    <div style="display: flex;">
                    <ul style="text-align: left; display: inline-block; margin:0px; padding:0px">${reasonsList}</ul>
                </div>` : ""}
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h3>Action Required</h3>
                <p>Please update your availability calendar accordingly.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>If you have any questions, reach out to us at <a href="mailto:info@rrooms.in">info@rrooms.in</a></p>
                <p>We look forward to hosting you!</p>
                <p><strong>Best regards,</strong></p>
                <p><strong>RROOMS Hospitality India Pvt. Ltd.</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};