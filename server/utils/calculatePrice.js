// Calculate total price based on weekend/weekday rates
const calculateBookingPrice = (farm, fromDate, toDate) => {
  let totalPrice = 0;
  const cursor = new Date(fromDate);
  
  // Weekend days: Friday (5), Saturday (6), Sunday (0)
  while (cursor < toDate) {
    const day = cursor.getDay();
    if (day === 5 || day === 6 || day === 0) { // Friday, Saturday, Sunday
      totalPrice += Number(farm.weekendPrice || farm.price || 0);
    } else {
      totalPrice += Number(farm.midweekPrice || farm.price || 0);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  
  return totalPrice;
};

module.exports = {
  calculateBookingPrice
};

