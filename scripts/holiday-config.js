// Holiday Configuration for JobConnect AI n8n Workflow
// This file contains all national holidays for India and Pakistan

const HOLIDAYS = {
  // Fixed Date Holidays (India)
  INDIA_FIXED: [
    { name: "Republic Day", month: 0, day: 26 },
    { name: "Independence Day", month: 7, day: 15 },
    { name: "Gandhi Jayanti", month: 9, day: 2 },
    { name: "Christmas", month: 11, day: 25 },
    { name: "New Year", month: 0, day: 1 },
    { name: "Good Friday", month: 3, day: 7 }, // Approximate - varies each year
    { name: "Easter Monday", month: 3, day: 10 }, // Approximate - varies each year
  ],

  // Fixed Date Holidays (Pakistan)
  PAKISTAN_FIXED: [
    { name: "Independence Day (Pakistan)", month: 7, day: 14 },
    { name: "Republic Day (Pakistan)", month: 2, day: 23 },
    { name: "Youm-e-Takbir (Pakistan)", month: 4, day: 28 },
    { name: "Youm-e-Azadi (Pakistan)", month: 7, day: 14 },
    { name: "Youm-e-Iqbal (Pakistan)", month: 10, day: 9 },
    { name: "Youm-e-Quaid (Pakistan)", month: 11, day: 25 },
  ],

  // Variable Date Holidays (approximate dates - need yearly updates)
  VARIABLE_2025: [
    // Hindu Festivals
    { name: "Makar Sankranti", month: 0, day: 15 },
    { name: "Pongal", month: 0, day: 15 },
    { name: "Maha Shivratri", month: 1, day: 18 },
    { name: "Holi", month: 2, day: 25 },
    { name: "Ram Navami", month: 3, day: 17 },
    { name: "Hanuman Jayanti", month: 3, day: 23 },
    { name: "Akshaya Tritiya", month: 4, day: 22 },
    { name: "Buddha Purnima", month: 4, day: 23 },
    { name: "Raksha Bandhan", month: 7, day: 30 },
    { name: "Krishna Janmashtami", month: 8, day: 7 },
    { name: "Ganesh Chaturthi", month: 8, day: 19 },
    { name: "Onam", month: 8, day: 20 },
    { name: "Navratri", month: 9, day: 3 },
    { name: "Dussehra", month: 9, day: 12 },
    { name: "Karva Chauth", month: 9, day: 31 },
    { name: "Diwali", month: 10, day: 1 },
    { name: "Chhath Puja", month: 10, day: 8 },
    { name: "Guru Nanak Jayanti", month: 10, day: 27 },

    // Islamic Festivals
    { name: "Eid al-Fitr", month: 3, day: 10 }, // Approximate
    { name: "Eid al-Adha", month: 6, day: 17 }, // Approximate
    { name: "Muharram", month: 6, day: 28 }, // Approximate
    { name: "Milad un-Nabi", month: 8, day: 15 }, // Approximate

    // Sikh Festivals
    { name: "Baisakhi", month: 3, day: 14 },
    { name: "Guru Gobind Singh Jayanti", month: 0, day: 5 },

    // Jain Festivals
    { name: "Mahavir Jayanti", month: 3, day: 10 },

    // Other Regional Festivals
    { name: "Lohri", month: 0, day: 14 },
    { name: "Bihu", month: 0, day: 15 },
    { name: "Pongal", month: 0, day: 15 },
    { name: "Makar Sankranti", month: 0, day: 15 },
  ]
};

// Function to check if a date is a holiday
function isHoliday(date) {
  const month = date.getMonth();
  const day = date.getDate();
  
  // Check fixed date holidays
  const allFixedHolidays = [...HOLIDAYS.INDIA_FIXED, ...HOLIDAYS.PAKISTAN_FIXED];
  const isFixedHoliday = allFixedHolidays.some(holiday => 
    holiday.month === month && holiday.day === day
  );
  
  // Check variable date holidays (2025)
  const isVariableHoliday = HOLIDAYS.VARIABLE_2025.some(holiday => 
    holiday.month === month && holiday.day === day
  );
  
  return isFixedHoliday || isVariableHoliday;
}

// Function to check if a date is a weekend
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

// Function to get holiday name if it's a holiday
function getHolidayName(date) {
  const month = date.getMonth();
  const day = date.getDate();
  
  const allHolidays = [
    ...HOLIDAYS.INDIA_FIXED, 
    ...HOLIDAYS.PAKISTAN_FIXED, 
    ...HOLIDAYS.VARIABLE_2025
  ];
  
  const holiday = allHolidays.find(h => h.month === month && h.day === day);
  return holiday ? holiday.name : null;
}

// Function to get next business day
function getNextBusinessDay(date) {
  let nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (isWeekend(nextDay) || isHoliday(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}

// Function to get previous business day
function getPreviousBusinessDay(date) {
  let prevDay = new Date(date);
  prevDay.setDate(prevDay.getDate() - 1);
  
  while (isWeekend(prevDay) || isHoliday(prevDay)) {
    prevDay.setDate(prevDay.getDate() - 1);
  }
  
  return prevDay;
}

// Function to check if workflow should run today
function shouldRunWorkflow() {
  const today = new Date();
  
  if (isWeekend(today)) {
    return {
      shouldRun: false,
      reason: 'Weekend',
      nextRun: getNextBusinessDay(today)
    };
  }
  
  if (isHoliday(today)) {
    const holidayName = getHolidayName(today);
    return {
      shouldRun: false,
      reason: `Holiday: ${holidayName}`,
      nextRun: getNextBusinessDay(today)
    };
  }
  
  return {
    shouldRun: true,
    reason: 'Business day',
    nextRun: today
  };
}

// Export functions for use in n8n
module.exports = {
  isHoliday,
  isWeekend,
  getHolidayName,
  getNextBusinessDay,
  getPreviousBusinessDay,
  shouldRunWorkflow,
  HOLIDAYS
};

// Example usage for n8n workflow
/*
// In n8n Code Node:
const { shouldRunWorkflow } = require('./holiday-config.js');

const result = shouldRunWorkflow();
if (!result.shouldRun) {
  console.log(`Skipping workflow: ${result.reason}`);
  console.log(`Next run: ${result.nextRun.toDateString()}`);
  return []; // Stop workflow
}

console.log('Proceeding with workflow execution');
return [{ json: { timestamp: new Date().toISOString(), proceed: true } }];
*/ 