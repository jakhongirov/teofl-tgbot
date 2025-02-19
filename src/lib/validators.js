const validateDate = (date) => {
   const regex = /^\d{2}\.\d{2}\.\d{4}$/;
   if (!regex.test(date)) return false;
   const [day, month, year] = date.split('.').map(Number);
   const dateObj = new Date(year, month - 1, day);
   return dateObj.getDate() === day && dateObj.getMonth() === month - 1 && dateObj.getFullYear() === year;
};

const validateEmail = (email) => {
   const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   if (!regex.test(email)) return false;

   // Further validation to ensure domain and TLD are valid
   const [localPart, domain] = email.split('@');
   if (!localPart || !domain) return false;

   const domainParts = domain.split('.');
   if (domainParts.length < 2) return false; // Ensure domain has at least one dot

   const tld = domainParts[domainParts.length - 1];
   if (tld.length < 2) return false; // TLD must be at least 2 characters

   return true;
};

const validateCustomID = (id) => {
   const regex = /^[A-Za-z]{2}\d{7}$/;
   return regex.test(id);
};


module.exports = {
   validateDate,
   validateEmail,
   validateCustomID
}