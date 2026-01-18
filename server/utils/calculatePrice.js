// Calculate total price based on weekend/weekday rates
const calculateBookingPrice = (farm, fromDate, toDate) => {
  let totalPrice = 0;
  const cursor = new Date(fromDate);
  const endDate = new Date(toDate);
  
  // Ensure we have valid dates
  if (isNaN(cursor.getTime()) || isNaN(endDate.getTime())) {
    return 0;
  }

  // Weekend days: Friday (5), Saturday (6), Sunday (0)
  while (cursor < endDate) {
    const day = cursor.getDay();
    if (day === 5 || day === 6 || day === 0) { // Friday, Saturday, Sunday
      totalPrice += Number(farm.weekendPrice || farm.price || 0);
    } else {
      totalPrice += Number(farm.midweekPrice || farm.price || 0);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  
  // Ensure minimum price is returned if dates are the same (single day)
  if (totalPrice === 0 && fromDate && toDate) {
    const day = new Date(fromDate).getDay();
    if (day === 5 || day === 6 || day === 0) {
      totalPrice = Number(farm.weekendPrice || farm.price || 0);
    } else {
      totalPrice = Number(farm.midweekPrice || farm.price || 0);
    }
  }
  
  return totalPrice;
};

// Calculate number of nights
const calculateNights = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = {
  calculateBookingPrice,
  calculateNights
};

