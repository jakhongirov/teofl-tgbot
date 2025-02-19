const { fetch } = require('../postgres')

const addPaymentLink = (chatId, fileUrl) => {
   const QUERY = `
      UPDATE
         users
      SET
         payment_link = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, fileUrl)
}

module.exports = {
   addPaymentLink
}