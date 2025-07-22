export default (name) => `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to RROOMS</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin: auto; font-size: 17px;">
        <tr>
            <td style="background-color: #222; padding: 20px; text-align: left;">
                <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width: 200px;">
            </td>
        </tr>

        <tr>
            <td style="padding: 20px;">
                <p>Hello ${name},</p>
                <p>Welcome to <strong>RROOMS</strong> – we're absolutely thrilled to have you on board!</p>
                <p>Whether you're traveling for business, a weekend getaway, or simply exploring new destinations, RROOMS is here to make your journey smoother, more comfortable, and budget-friendly.</p>

                <h4 style="color: #333333; margin-top: 20px;">Why Choose RROOMS?</h4>
                <ul style="padding-left: 20px;">
                    <li><strong>Wide Selection:</strong> From cozy budget stays to premium comfort, we’ve got something for every traveler.</li>
                    <li><strong>Seamless Booking:</strong> Quick reservations and secure payment options at your fingertips.</li>
                    <li><strong>Member-Only Benefits:</strong> Enjoy special deals, discounts, and early access offers.</li>
                    <li><strong>24/7 Assistance:</strong> Our dedicated team is always here to help, anytime you need.</li>
                </ul>

                <h4 style="color: #333333; margin-top: 20px;">Ready to book your first stay?</h4>
                <p><a href="https://rrooms.in" target="_blank" style="color: #007BFF; text-decoration: none;">Browse and book now &rarr;</a></p>
            </td>
        </tr>

        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                <p>We look forward to being a part of your travel experiences!</p>
                <p><strong>Warm regards,</strong></p>
                <p><strong>Team RROOMS</strong></p>
                <p>
                    <a href="mailto:support@rrooms.in" style="color: #007BFF;">support@rrooms.in</a>&nbsp;&nbsp;
                    +91-7377378030&nbsp;&nbsp;
                    <a href="https://rrooms.in" style="color: #007BFF;">www.rrooms.in</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
`;
