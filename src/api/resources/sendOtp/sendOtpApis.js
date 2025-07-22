const axios = require('axios')

export const sendVerificationCode = (mobile, otp, hasKey = null) => {
  //const url = `https://pgapi.smartping.ai/fe/api/v1/multiSend?username=rrndmtrpg.trans&password=UBwwC&unicode=false&from=RROOMS&to=${mobile}&dltPrincipalEntityId=1401560000000064644&dltContentId=1407169573456595808&text=${otp} is your one time password (OTP) for login in to RROOMS. Please enter OTP to proceed. Team RROOMS`;
  // const url = `https://bulksmsapi.smartping.ai?username=rroomot&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1707170358813722266&EntityID=1401560000000064644&message=<#> Dear User, ${otp} is your one time password (OTP) for login in to RROOMS. Please enter OTP to proceed. Team RROOMS HYloAq5XspE`;
  // const url = `https://bulksmsapi.smartping.ai?username=rroomot&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1707170358813722266&EntityID=1401560000000064644&message=<#> Dear User, ${otp} is your one time password (OTP) for login in to RROOMS. Please enter OTP to proceed . Team RROOMS HYloAq5XspE`; 
  //const url =` https://bulksmsapi.smartping.ai?username=rroomot&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1407169573456595808&EntityID=1401560000000064644&message=${otp} is your one time password (OTP) for login in to RROOMS. Please enter OTP to proceed. Team RROOMS`;
  //const url = `https://bulksmsapi.smartping.ai?username=rroomot&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1707170958567671331&EntityID=1401560000000064644&message=%3C%23%3E Dear User, ${otp} is your one-time password (OTP) for logging into RROOMS. Please enter OTP to proceed. Team RROOMS /HYloAq5XspE`;
  //const url = `https://bulksmsapi.smartping.ai?username=rroomot&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1707171031117371926&EntityID=1401560000000064644&message=%3C%23%3E Dear User, ${otp} is your one-time password (OTP) for logging into RROOMS. Please enter OTP to proceed. Team RROOMS S+UIIVvgmKT`
  // const url = `https://bulksmsapi.smartping.ai?username=rroomtr&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1707171031117371926&EntityID=1401560000000064644&message=<%23> Dear User, ${otp} is your one-time password (OTP) for logging into RROOMS. Please enter OTP to proceed. Team RROOMS S+UIIVvgmKT`

  const rawMessage = `<#> Dear User, ${otp} is your one-time password (OTP) for logging into RROOMS. Please enter OTP to proceed. Team RROOMS S+UIIVvgmKT`;
  const encodedMessage = encodeURIComponent(rawMessage);
  const url = `https://bulksmsapi.smartping.ai?username=rroomtr&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1707171031117371926&EntityID=1401560000000064644&message=${encodedMessage}`;

  // const url = `https://bulksmsapi.smartping.ai?username=rroomot&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1707171782705798202&EntityID=1401560000000064644&message=%3C%23%3E Dear User, ${otp} is your one-time password (OTP) for login in to RROOMS. Please enter OTP to proceed. Team RROOMS ${hasKey ? hasKey : 'HYIoAq5XspE'}`
  console.log("url - send Verification Code -- ", url);
  axios.get(url).then(res => console.log("data send-----------", res.data)).catch(err => console.log(err.message))
}

export const passwordChangeOpt = (mobile, text) => {
  //const url =  `http://198.15.103.106/API/pushsms.aspx?loginID=bkc150289&password=654321&mobile=${mobile}&text=${text}%20is%20the%20OTP%20for%20password%20change,%20please%20do%20not%20share%20the%20OTP%20with%20anyone.%20Team%20RROOMS&senderid=RROOMS&route_id=1&Unicode=0&Template_id=1407169570875594932`;
  const url = `https://bulksmsapi.smartping.ai?username=rroomot&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1407169570875594932&EntityID=1401560000000064644&message=${text} is the OTP for password change, please do not share the OTP with anyone. Team RROOMS`;
  console.log("url - passwordChangeOpt - ", url);
  axios.get(url).then(res => console.log("data send-----------", res.data)).catch(err => console.log(err.message))
}

export const bookingConfirmed = (userMobile, propertyMobile, bookingId, propertyName) => {
  //const urlOld = `https://pgapi.smartping.ai/fe/api/v1/multiSend?username=rrndmtrpg.trans&password=UBwwC&unicode=false&from=RROOMS&to=${userMobile}&dltPrincipalEntityId=1401560000000064644&dltContentId=1407169570881499609&text=Dear Customer, your stay with booking ID ${bookingId} at ${propertyName} is confirmed. Team RROOMS`;
  const url = `https://bulksmsapi.smartping.ai.?username=rroomtr&password=room@1234&messageType=text&mobile=${userMobile}&senderId=RROOMS&ContentID=1407169570881499609&EntityID=1401560000000064644&message=Dear Customer, your stay with booking ID ${bookingId} at ${propertyName} is confirmed. Team RROOMS`;
  console.log("url - bookingConfirmed -", url);
  axios.get(url).then(res => { console.log("-----------------AAA", res) }).catch(err => console.log(err.message))
}

export const bookingConfirmedOld = (userMobile, propertyMobile, bookingId, propertyName) => {
  const url = `http://198.15.103.106/API/pushsms.aspx?loginID=bkc150289&password=654321&mobile=${userMobile},${propertyMobile}&text=Dear Customer, your stay with booking ID ${bookingId} at ${propertyName} is confirmed. Team RROOMS&senderid=RROOMS&route_id=1&Unicode=0&Template_id=1407169570881499609`;
  axios.get(url).then(res => { console.log("-----------------AAA", res) }).catch(err => console.log(err.message))
}

export const cancelBooking = (userMobilemobile, propertyMobile, bookingId, propertyName) => {
  //const urlOld = `http://198.15.103.106/API/pushsms.aspx?loginID=bkc150289&password=654321&mobile=${mobile}&text=Dear Customer, your stay with booking ID ${bookingId} at ${propertyName} is cancelled. You will get the refund soon. Team RROOMS&senderid=RROOMS&route_id=1&Unicode=0&Template_id=1407169573465428236`;
  const url = `https://bulksmsapi.smartping.ai.?username=rroomtr&password=room@1234&messageType=text&mobile=${userMobilemobile}&senderId=RROOMS&ContentID=1407169573465428236&EntityID=1401560000000064644&message=Dear Customer, your stay with booking ID ${bookingId} at ${propertyName} is cancelled. You will get the refund soon. Team RROOMS`
  console.log("url - cancelBooking -", url);
  axios.get(url).then(res => console.log("booking canceled send-----------", res.data)).catch(err => console.log(err.message))
}

export const sendAppUrl = (mobileNumber) => {
  // const url = `https://bulksmsapi.smartping.ai/?username=rroomot&password=room@1234&messageType=unicode&mobile=${mobileNumber}&senderId=RROOMS&ContentID=1707170480893477966&EntityID=1401560000000064644&message=d83cdf1f0020005300690067006e00200075007000200066006f0072002000520052004f004f004d00530020006e006f0077002000260020006700650074002020b900320035003000200069006e00200079006f00750072002000770061006c006c0065007400210020d83cdfe800200045006e006a006f007900200075007000200074006f00200033003000250020006f006600660020006f006e002000610070007000200062006f006f006b0069006e00670073002e00200059006f0075007200200070006500720066006500630074002000730074006100790020006900730020006a0075007300740020006100200063006c00690063006b00200061007700610079002e00200044006f0077006e006c006f0061006400200074006800650020006100700070003a002000680074007400700073003a002f002f0070006c00610079002e0067006f006f0067006c0065002e0063006f006d002f00730074006f00720065002f0061007000700073002f00640065007400610069006c0073003f00690064003d0063006f006d002e00720072006f006f006d00730020d83ddcf20020002300520052004f004f004d00530020002300540072006100760065006c004400650061006c0073`
  const url = `https://bulksmsapi.smartping.ai./?username=rroomtr&password=room@1234&messageType=unicode&mobile=${mobileNumber}&senderId=RROOMS&ContentID=1707174298239333193&EntityID=1401560000000064644&message=005300690067006E00200075007000200066006F0072002000520052004F004F004D00530020006E006F0077002000260020006700650074002020B900320035003000200069006E00200079006F00750072002000770061006C006C006500740021002000200045006E006A006F007900200075007000200074006F002000330030002500200020006F006600660020006F006E002000610070007000200062006F006F006B0069006E00670073002E00200059006F0075007200200070006500720066006500630074002000730074006100790020006900730020006A0075007300740020006100200063006C00690063006B00200061007700610079002E00200044006F0077006E006C006F006100640020007400680065002000680074007400700073003A002F002F00730068006F0072007400750072006C002E00610074002F0035006B00460065006E00200020002300520052004F004F004D00530020002300540072006100760065006C004400650061006C0073`
  //const url = `https://bulksmsapi.smartping.ai.?username=rroomtr&password=room@1234&messageType=text&mobile=${mobileNumber}&senderId=RROOMS&ContentID=1707170480893477966&EntityID=1401560000000064644&message=Sign up for RROOMS now & get₹250 in your wallet! Enjoy up to 30% off on bookings. Download app: https://play.google.com/store/apps/details?id=com.rrooms #RROOMS`;
  axios.get(url).then(res => console.log("get app url send -----------", res.data)).catch(err => console.log(err.message))
}

export const paymentDeclinedSms = (mobileNumber, bookingCode) => {
  const url = `https://bulksmsapi.smartping.ai.?username=rroomtr&password=room@1234&messageType=text&mobile=${mobileNumber}&senderId=RROOMS&ContentID=1707170508634324310&EntityID=1401560000000064644&message=We regret to inform you that your recent payment for RROOMS room booking ${bookingCode} was unsuccessful. However, your booking has been confirmed. You can retry to pay online from your booking history or pay at the hotel at check-in time. Team RROOMS`;
  console.log("url - paymentDeclinedSms -", url);
  axios.get(url).then(res => console.log("payment desclined send -----------", res.data)).catch(err => console.log(err.message))
}

export const sendOTPToUpdatePassword = (mobile, otp) => {
  // const url = `https://bulksmsapi.smartping.ai?username=rroomot&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1707171507330121565&EntityID=1401560000000064644&message= ${otp} is the OTP to change your login password, do not share the OTP with anyone. Team RROOMS`
  const url = `https://bulksmsapi.smartping.ai./?username=rroomtr&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1407169570875594932&EntityID=1401560000000064644&message=${otp}%20is%20the%20OTP%20for%20password%20change,%20please%20do%20not%20share%20the%20OTP%20with%20anyone.%20Team%20RROOMS`
  console.log("url - sendOTPToUpdatePassword - ", url);
  axios.get(url).then(res => console.log("data send-----------", res.data)).catch(err => console.log(err.message))
}

// upload krna hai
export const sendMobileVerifyOtp = (mobile, otp) => {
  const url = `https://bulksmsapi.smartping.ai?username=rroomtr&password=room@1234&messageType=text&mobile=${mobile}&senderId=RROOMS&ContentID=1707174737644128157&EntityID=1401560000000064644&message=Please verify your mobile number for property registration. Use OTP: ${otp} to complete the verification. - Team RROOMS`
  axios.get(url).then(res => console.log("Send mobile number verification OTP to " + mobile)).catch(err => console.log(err.message))
}