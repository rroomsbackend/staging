export default {

    from: process.env.MAIL_FROM || "ABC <abc@example.com>",

    host : process.env.MAIL_HOST || "smtp.google.net",

    port  : process.env.MAIL_PORT || 587,

    username: process.env.MAIL_USERNAME || "admin@gmail.com",

    password: process.env.MAIL_PASSWORD || "",

    batching: process.env.MAIL_BATCHING || 200,
}