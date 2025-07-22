export default (propertyOwner, propertyName, propertyCode, rejectedByName, rejectedByEmail, rejectionReason) => {
    return `
 <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Property Onboarding Rejected</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; width: 700px; margin:auto">
          <tr>
              <td style="background-color: #222; padding: 20px; text-align: left;">
                  <img alt="RRooms Logo" src="https://rrooms.in/rrooms/uploads/rrooms-logo.png" style="width:200px">
              </td>
          </tr>
          <tr>
              <td style="padding: 20px; text-align: left; background-color: #d9534f; color: #ffffff;">
                  <h3 style="margin: 0;">Dear ${propertyOwner},</h3>
                  <p style="margin: 10px 0 0;">We would like to inform you that the onboarding process for the following property has been <strong>rejected</strong> after a detailed review.</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px; background-color: #fff4e5;">
                  <h3>Property Details:</h3>
                  <p><strong>Property Name:</strong> ${propertyName}</p>
                  <p><strong>RROOMS Property ID:</strong> ${propertyCode}</p>
                  <p><strong>Rejected By:</strong> ${rejectedByName} (<a href="mailto:${rejectedByEmail}">${rejectedByEmail}</a>)</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 15px; background-color: #ffffff;">
                  <h3>Reason for Rejection:</h3>
                  <p style="color: #d9534f; font-weight: normal;">${rejectionReason}</p>
                  <p>To proceed further, please review the reason mentioned above and take corrective actions if applicable. You may update the property details and reinitiate the onboarding process for reconsideration.</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 15px;text-align: center; background-color: #fff4e5;">
                  <h3>Need Assistance?</h3>
                  <p>If you need any help or clarification, please contact our support team at <a href="mailto:info@rrooms.in">info@rrooms.in</a>.</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 15px; text-align: center; background-color: #f4f4f4;">
                  <p><strong>Warm regards,</strong></p>
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