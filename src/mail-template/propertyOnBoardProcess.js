export default (InitiatorEmail, propertyOwner, name, propertyAddress, propertyCode, InitiatorName, property_Mobile, property_Email, lat, long) => {
    return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Property Onboarding Initiated</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto">
          <tr>
              <td style="background-color: #222; padding: 20px; text-align: left;">
                  <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
              </td>
          </tr>
          <tr>
              <td style="padding: 20px; text-align: left; background-color: #fd9e22; color: #ffffff;">
                  <h2 style="margin: 0;">Dear ${propertyOwner},</h2>
                  <p style="margin: 10px 0 0;">We are pleased to inform you that the onboarding process for your property has been successfully initiated.</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px; background-color: #fff4e5;">
                  <h3>Property Details:</h3>
                  <p><strong>Property Name:</strong> ${name}</p>
                  <p><strong>Location:</strong> ${propertyAddress}</p>
                  <p><strong>Property ID:</strong> ${propertyCode}</p>
                  <p><strong>Email:</strong> ${property_Email}</p>
                  <p><strong>Mobile:</strong> ${property_Mobile}</p>
                  <p><strong>Initiated By:</strong> ${InitiatorName} (<a href="mailto:${InitiatorEmail}">${InitiatorEmail}</a>)</p>

                  <p><strong>View on Map:</strong> 
  <a href="https://www.google.com/maps/search/${lat},${long}/@${lat},${long},13z?entry=ttu&g_ep=EgoyMDI1MDYwNC4wIKXMDSoASAFQAw%3D%3D" target="_blank">View Property on Map</a>
</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px; background-color: #ffffff;">
                  <h3>What to Expect Next:</h3>
                  <ul style="padding-left: 20px;">
                      <li><strong>Verification:</strong> Our team will verify the property's information and supporting documents.</li>
                      <li><strong>Approval:</strong> Once verified, your property will be approved for listing.</li>
                      <li><strong>Go Live:</strong> You will receive a confirmation once your property is live on our platform.</li>
                  </ul>
                  <p>We appreciate your partnership and look forward to helping you grow your bookings through RROOMS.</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px; background-color: #fff4e5;">
                  <h3>Need Assistance?</h3>
                  <p>If you have any questions, feel free to contact us at <a href="mailto:info@rrooms.in">info@rrooms.in</a>.</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                  <p>Warm regards,</p>
                  <p><strong>The RROOMS Team</strong></p>
                  <p><a href="https://www.rrooms.in" target="_blank">www.rrooms.in</a></p>
                  <p>info@rrooms.in</p>
              </td>
          </tr>
      </table>
  </body>
  </html>
    `;
};