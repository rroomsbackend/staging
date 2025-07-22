export default (bookingDetails) => {
    console.log("bookingDetails ---- ", bookingDetails);

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
                <h1 style="margin: 0; font-size: 28px;">New Booking Confirmed</h1>                
                <p style="margin: 0; font-size: 18px;">A new booking has been confirmed for your property <strong>${bookingDetails?.hotelName}</strong> on RROOMS</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fff4e5;">
                <h3>Booking Details</h3>
                <p><strong>Booking ID:</strong> ${bookingDetails?.bookingId}</p>
                <p><strong>Guest Name:</strong> ${bookingDetails?.guestName}</p>
                <p><strong>Check-in Date & Time:</strong> ${bookingDetails?.checkInTime}</p>
                <p><strong>Check-out Date & Time:</strong> ${bookingDetails?.checkOutTime}</p>
                <p><strong>Room Type:</strong> Deluxe</p>
                <p><strong>Number of Rooms:</strong> ${bookingDetails?.noOfRooms}</p>
                <p><strong>Guests:</strong> ${bookingDetails?.adults > 1 ? bookingDetails?.adults + " Adults" : bookingDetails?.adults + " Adult"} & ${bookingDetails?.children > 0 ? bookingDetails?.children + " child" : "0 Child"}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <h3>Payment Summary</h3>
                <p><strong>Total Booking Amount:</strong> ₹${bookingDetails?.bookingAmout}</p>
                <p><strong>Amount Paid Online:</strong> ${bookingDetails?.collectedPayment ? bookingDetails?.collectedPayment : "₹0"}</p>
                <p><strong>To be paid at Hotel:</strong> ₹${parseInt(bookingDetails?.balanceAmount)}</p>
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