const validateDate = (date) => {
   const regex = /^\d{2}\.\d{2}\.\d{4}$/;
   if (!regex.test(date)) return false;
   const [day, month, year] = date.split('.').map(Number);
   const dateObj = new Date(year, month - 1, day);
   return dateObj.getDate() === day && dateObj.getMonth() === month - 1 && dateObj.getFullYear() === year;
};

module.exports = {
   validateDate
}