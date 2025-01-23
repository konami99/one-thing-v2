import { Dimensions } from "react-native";

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export const capitalize = str=>{
  return str.replace(/\b\w/g, l => l.toUpperCase())
}

export const wp = (percentage) => {
  return (percentage * deviceWidth) / 100;
};
export const hp = (percentage) => {
  return (percentage * deviceHeight) / 100;
};

export const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>?/gm, '');
};

export const getDaysOfCurrentWeek = () => {
  const currentDate = new Date(); // Get the current date
  const startOfWeek = new Date(currentDate); // Clone the current date
  const days = [];

  // Calculate the start of the week (Sunday)
  const dayOfWeek = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

  // Loop through the week
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek); // Clone the start date
    date.setDate(startOfWeek.getDate() + i); // Add `i` days to get each day of the week
    days.push(date.getDate()); // Format as YYYY-MM-DD and push to array
  }

  return days;
}

export const getCurrentMonth = () => {
  const currentDate = new Date();

  return months[currentDate.getMonth()];
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];