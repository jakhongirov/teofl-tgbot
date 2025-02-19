const fs = require('fs');
const path = require('path');
const axios = require('axios');
const model = require('./model')
const { bot } = require('../bot')
const { addUserToSheet } = require('../sheet')

const downloadAndSaveFile = async (fileId, chatId) => {
   try {
      const UPLOAD_FOLDER = path.resolve(__dirname, '../../../public/images');
      const file = await bot.getFile(fileId);
      const filePath = file.file_path;
      const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;

      // Extract the filename
      const fileName = `${Date.now()}_${path.basename(filePath)}`;
      const localFilePath = path.join(UPLOAD_FOLDER, fileName);
      const fileUrl = `${process.env.BACKEND_URL}/${fileName}`;

      // Download the file
      const response = await axios({
         url,
         method: 'GET',
         responseType: 'stream'
      });

      const fileStream = fs.createWriteStream(localFilePath);
      response.data.pipe(fileStream);

      return new Promise((resolve, reject) => {
         fileStream.on('finish', async () => {
            // Save URL to the database
            const userData = await model.addPaymentLink(chatId, fileUrl);
            await addUserToSheet(
               userData?.name,
               userData?.phone,
               userData?.gender,
               userData?.email,
               userData?.birth_date,
               userData?.city,
               userData?.address,
               userData?.passport,
               userData?.exam_date,
               userData?.payment_link
            )

            resolve(fileUrl);
         });
         fileStream.on('error', reject);
      });

   } catch (error) {
      console.error('Error downloading file:', error);
      return null;
   }
};

module.exports = { downloadAndSaveFile }