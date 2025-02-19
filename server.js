require('dotenv').config()
const express = require("express");
const http = require('http');
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const {
   PORT
} = require("./src/config");
const { bot } = require('./src/lib/bot')
const model = require('./model')
const botText = require('./text.json')
const { regionsBtn, examDateBtn } = require('./data')
const { examPrice } = require('./src/lib/currency')
const { downloadAndSaveFile } = require('./src/lib/download/download')
const { validateDate, validateEmail, validateCustomID } = require('./src/lib/validators')

const publicFolderPath = path.join(__dirname, 'public');
const imagesFolderPath = path.join(publicFolderPath, 'images');

if (!fs.existsSync(publicFolderPath)) {
   fs.mkdirSync(publicFolderPath);
   console.log('Public folder created successfully.');
} else {
   console.log('Public folder already exists.');
}

if (!fs.existsSync(imagesFolderPath)) {
   fs.mkdirSync(imagesFolderPath);
   console.log('Images folder created successfully.');
} else {
   console.log('Images folder already exists within the public folder.');
}

bot.onText(/\/start/, async (msg) => {
   const chatId = msg.chat.id;
   const username = msg.from.first_name;
   const foundUser = await model.foundUser(chatId)

   if (foundUser) {
      bot.sendMessage(chatId, botText.startText?.replace(/%user%/g, username), {
         reply_markup: {
            keyboard: [
               [
                  {
                     text: botText.sendContactBtn,
                     request_contact: true
                  }
               ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'register')
      })
   } else {
      bot.sendMessage(chatId, botText.startText?.replace(/%user%/g, username), {
         reply_markup: {
            keyboard: [
               [
                  {
                     text: botText.sendContactBtn,
                     request_contact: true
                  }
               ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
         }
      }).then(async () => {
         await model.createUser(chatId, 'register')
      })
   }
})

bot.on('contact', async (msg) => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)
   let phoneNumber = msg.contact.phone_number;

   if (msg.contact && foundUser?.step == 'register') {
      if (!phoneNumber.startsWith('+')) {
         phoneNumber = `+${phoneNumber}`;
      }

      const addPhoneNumber = await model.addPhoneNumber(
         chatId,
         phoneNumber
      )

      if (addPhoneNumber) {
         bot.sendMessage(chatId, botText.askGender, {
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: "Erkak",
                     },
                     {
                        text: "Ayol",
                     },
                  ]
               ],
               resize_keyboard: true,
            }
         }).then(async () => {
            await model.editStep(chatId, 'ask_gender')
         })
      }
   }
})

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;
   const foundUser = await model.foundUser(chatId)

   // if (foundUser?.step == 'register' && !foundUser?.phone) {
   //    const addPhoneNumber = await model.addPhoneNumber(
   //       chatId,
   //       text
   //    )

   //    if (addPhoneNumber) {
   //       bot.sendMessage(chatId, botText.askGender, {
   //          reply_markup: {
   //             keyboard: [
   //                [
   //                   {
   //                      text: "Erkak",
   //                   },
   //                   {
   //                      text: "Ayol",
   //                   },
   //                ]
   //             ],
   //             resize_keyboard: true,
   //          }
   //       }).then(async () => {
   //          await model.editStep(chatId, 'ask_gender')
   //       })
   //    }

   // } else

   if (foundUser?.step == 'ask_gender') {
      const addGender = await model.addGender(chatId, text)

      if (addGender) {
         bot.sendMessage(chatId, botText.askName, {
            reply_markup: {
               remove_keyboard: true
            }
         })
            .then(async () => {
               await model.editStep(chatId, 'ask_name')
            })
      }
   } else if (foundUser?.step == 'ask_name') {
      const addName = await model.addName(chatId, text)

      if (addName) {
         bot.sendMessage(chatId, botText.askBirthdate)
            .then(async () => {
               await model.editStep(chatId, 'ask_birthdate')
            })
      }
   } else if (foundUser?.step == 'ask_birthdate') {

      if (validateDate(text)) {
         const addBirthDate = await model.addBirthDate(chatId, text)

         if (addBirthDate) {
            bot.sendMessage(chatId, botText.askPassport)
               .then(async () => {
                  await model.editStep(chatId, 'ask_passport')
               })
         }
      } else {
         bot.sendMessage(chatId, botText.askBirthdateError)
            .then(async () => {
               await model.editStep(chatId, 'ask_birthdate')
            })
      }


   } else if (foundUser?.step == 'ask_passport') {

      if (validateCustomID(text)) {
         const addPassport = await model.addPassport(chatId, text)

         if (addPassport) {
            bot.sendMessage(chatId, botText.askEmail)
               .then(async () => {
                  await model.editStep(chatId, 'ask_email')
               })
         }
      } else {
         bot.sendMessage(chatId, botText.askPassportError)
            .then(async () => {
               await model.editStep(chatId, 'ask_passport')
            })
      }

   } else if (foundUser?.step == 'ask_email') {

      if (validateEmail(text)) {
         const addEmail = await model.addEmail(chatId, text)

         if (addEmail) {
            bot.sendMessage(chatId, botText.askRegion, {
               reply_markup: {
                  keyboard: regionsBtn,
                  resize_keyboard: true,
               }
            })
               .then(async () => {
                  await model.editStep(chatId, 'ask_region')
               })
         }
      } else {
         bot.sendMessage(chatId, botText.askEmailError)
            .then(async () => {
               await model.editStep(chatId, 'ask_email')
            })
      }

   } else if (foundUser?.step == 'ask_region') {
      const addRegion = await model.addRegion(chatId, text)

      if (addRegion) {
         bot.sendMessage(chatId, botText.askAddress, {
            reply_markup: {
               remove_keyboard: true
            }
         })
            .then(async () => {
               await model.editStep(chatId, 'ask_address')
            })
      }
   } else if (foundUser?.step == 'ask_address') {
      const addAddress = await model.addAddress(chatId, text)

      if (addAddress) {
         bot.sendMessage(chatId, botText.askExamDate, {
            reply_markup: {
               keyboard: examDateBtn,
               resize_keyboard: true,
            }
         })
            .then(async () => {
               await model.editStep(chatId, 'ask_examDate')
            })
      }
   } else if (foundUser?.step == 'ask_examDate') {
      const addExamDate = await model.addExamDate(chatId, text)

      if (addExamDate) {
         const price = await examPrice();
         bot.sendMessage(chatId, botText.askPayment?.replace(/%price%/g, price), {
            reply_markup: {
               remove_keyboard: true
            }
         })
            .then(async () => {
               await model.editStep(chatId, 'ask_payment')
            })
      }
   }
})

bot.on('photo', async (msg) => {
   const fileId = msg.photo[msg.photo.length - 1].file_id; // Get highest resolution
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (foundUser?.step == "ask_payment") {
      const fileUrl = await downloadAndSaveFile(fileId, chatId);
      if (fileUrl) {
         bot.sendMessage(chatId, botText.endText);
      } else {
         bot.sendMessage(chatId, 'Failed to download photo.');
      }
   }
});

bot.on('document', async (msg) => {
   const fileId = msg.document.file_id;
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (foundUser?.step == "ask_payment") {
      const fileUrl = await downloadAndSaveFile(fileId, chatId);
      if (fileUrl) {
         bot.sendMessage(chatId, botText.endText);
      } else {
         bot.sendMessage(chatId, 'Failed to download file.');
      }
   }
});


app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.use('/public', express.static(path.resolve(__dirname, 'public')))
// app.use("/api/v1", router);

server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});