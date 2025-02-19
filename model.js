const { fetchALL, fetch } = require('./src/lib/postgres')

const createUser = (chatId, step) => {
   const QUERY = `
      INSERT INTO
         users (
            chat_id,
            step
         ) VALUES (
            $1,
            $2
         ) RETURNING *;
   `;

   return fetch(QUERY, chatId, step)
}
const editStep = (chatId, step) => {
   const QUERY = `
      UPDATE
         users
      SET
         step = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, step)
}
const foundUser = (chatId) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1;
   `;

   return fetch(QUERY, chatId)
}
const addPhoneNumber = (
   chatId,
   phoneNumber
) => {
   const QUERY = `
      UPDATE
         users
      SET
         phone = $2
      WHERE
         chat_id =$1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, phoneNumber)
}
const addGender = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         gender = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}
const addName = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         name = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}
const addBirthDate = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         birth_date = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}
const addPassport = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         passport = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}

const addEmail = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         email = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}
const addRegion = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         city = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}
const addAddress = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         address = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}
const addExamDate = (chatId, text) => {
   const QUERY = `
      UPDATE
         users
      SET
         exam_date = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, chatId, text)
}

module.exports = {
   createUser,
   editStep,
   foundUser,
   addPhoneNumber,
   addGender,
   addName,
   addBirthDate,
   addPassport,
   addEmail,
   addRegion,
   addAddress,
   addExamDate
}