const axios = require('axios');

const examPrice = async () => {
   try {
      const res = await axios.get('https://cbu.uz/uz/arkhiv-kursov-valyut/json/');
      const rate = Number(res.data.find(item => item.Ccy === "USD").Rate);
      const price = Math.floor((rate + 100) * 165);
      return price.toLocaleString('ru-RU'); // Raqamlarni probel bilan ajratish uchun
   } catch (error) {
      console.error('Error fetching currency data:', error);
      return null;
   }
}

module.exports = { examPrice };