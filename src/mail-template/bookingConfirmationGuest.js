export default (bookingDetails) => {
    console.log(bookingDetails);
    const categoryMap = {
        1: "Executive",
        2: "Deluxe",
        3: "Suite",
        5: "Executive Single",
        6: "Twin Bed Executive"
    };
    const categoryName = categoryMap[bookingDetails?.RoomsCategoryId] || "";
    const propertyPolicy = [
        "Unmarried Couples above 18 years allowed.",
        "Unmarried Couples above 18 years not allowed.",
        "Local ID accepted.",
        "Local ID not accepted.",
        "No cancellation charges before 24hrs of hotel check-in And within 15 min of same day.",
        "Only Indian residents & NRIs with Indian ID can check in.",
    ];
    // Parse the string if bookingPolicy is stringified JSON
    const policyIndices = Array.isArray(bookingDetails?.bookingPolicy)
        ? bookingDetails?.bookingPolicy
        : JSON.parse(bookingDetails?.bookingPolicy);

    // Filter out empty strings and invalid indices
    const selectedPolicies = policyIndices
        .filter(i => i !== "" && !isNaN(parseInt(i)) && propertyPolicy[parseInt(i)])
        .map(i => propertyPolicy[parseInt(i)]);

    // Create HTML list
    const policiesHtml = selectedPolicies?.map(p => `<li>${p}</li>`).join("");
    return `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #000000;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px;  margin:auto">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                   <img alt="" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #ff8c00; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">Your Booking is Confirmed!</h1>
                <p style="margin: 5px 0 15px; font-size: 18px;">Hello ${bookingDetails?.guestName},</p>
                <p style="margin: 0; font-size: 18px;">Thank you for booking with RROOMS!</p>
                <img src="https://cdn-icons-png.flaticon.com/512/11349/11349793.png" alt="Booking Confirmed"
                    style="width: 80px; margin-top: 15px;">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #fff4e5;">
                <table width="100%" cellspacing="0" cellpadding="10" border="0">
                    <tr>
                        <td style="text-align: center; font-size: 18px; font-weight: bold;"><img src="https://cdn-icons-png.flaticon.com/512/11349/11349793.png" alt="Booking Confirmed"
                    style="width: 18px; margin-top: 15px;"> Check-in</td>
                        <td style="text-align: center; font-size: 18px; font-weight: bold;"><img src="https://cdn-icons-png.flaticon.com/512/11349/11349793.png" alt="Booking Confirmed"
                    style="width: 18px; margin-top: 15px;"> Check-out</td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-size: 16px;">${bookingDetails?.checkInTime}<br>  12:00 PM (onwards)</td>
                        <td style="text-align: center; font-size: 16px;">${bookingDetails?.checkOutTime}<br> 11:00 AM (upto)</td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;padding-bottom:0px !important">
                <h3 style="margin-bottom: 10px;">Booking Details (ID: ${bookingDetails?.bookingId})</h3>
                <p><strong>Property Name:</strong> 
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bookingDetails?.hotelName + ', ' + bookingDetails?.hotelAddress)}" 
                       target="_blank" 
                       style="color: blue; text-decoration: underline;">
                       ${bookingDetails?.hotelName}
                    </a>
                </p>
                <p><strong>Property Address:</strong> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bookingDetails?.hotelName + ', ' + bookingDetails?.hotelAddress)}" 
                       target="_blank" 
                       style="color: blue; text-decoration: underline;">
                       ${bookingDetails?.hotelAddress}
                    </a></p>
                <p><strong>Room Type:</strong> ${categoryName}</p>
                <p><strong>Number of Rooms:</strong> ${bookingDetails?.noOfRooms}</p>
                <p><strong>Guests:</strong> ${bookingDetails?.adults > 1 ? bookingDetails?.adults + " Adults" : bookingDetails?.adults + " Adult"} & ${bookingDetails?.children > 0 ? bookingDetails?.children + " child" : "0 Child"}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; padding-top:0px !important">
                <h3 style="margin-bottom: 10px;">Payment Summary</h3>
                <p><strong>Total Booking Amount:</strong> ₹${bookingDetails?.bookingAmout}</p>
                <p><strong>Amount Paid Online:</strong> ${bookingDetails?.collectedPayment ? bookingDetails?.collectedPayment : "₹0"}</p>
                <p><strong>To be paid at Hotel:</strong> ₹${parseInt(bookingDetails?.balanceAmount)}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <p style="color: black; font-size: 16px;">Hotel Policies:</p>
                <ul style="text-align: left; padding-left: 30px;">
                    ${policiesHtml}
                </ul>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center;">
                <p style="color: black; font-size: 16px;">Booking Cancellation Policy:</p>
                <ul style="text-align: left; padding-left: 30px;">
                    <li>Refund will be provided only if cancellation is done 24 hours prior to selected check-in time.</li>
                    <li>In case booking has been done within 24 hours of check-in time, the refund will be provided only if the booking is cancelled within 15 minutes from the time of booking.</li>
                    <li>There will be no refund if you decide to cancel the booking in the middle of your stay.</li>
                    <li>If eligible, refund will be initiated, which will reflect in your account within 5-7 business days.</li>                    
                </ul>
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