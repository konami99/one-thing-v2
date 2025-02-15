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
  const dayOfWeek = 1; // Sunday = 0, Monday = 1, ..., Saturday = 6
  startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

  // Loop through the week
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek); // Clone the start date
    date.setDate(startOfWeek.getDate() + i); // Add `i` days to get each day of the week
    days.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD and push to array
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

interface daysProps {
  [key: number]: string
}

export const days: daysProps = {
  0: "Su",
  1: "Mo",
  2: "Tu",
  3: "We",
  4: "Th",
  5: "Fr",
  6: "Sa",
}

export type ItemData = {
  id: string,
  type: string,
  title: string,
}

export const habits: ItemData[] = [
  {
    id: '0',
    type: 'TextInput',
    title: 'Activity',
  },
  {
    id: '1',
    type: 'Text',
    title: 'Play 🎸',
  },
  {
    id: '2',
    type: 'Text',
    title: 'Draw a 🖼️',
  },
  {
    id: '3',
    type: 'Text',
    title: 'Play ⚽',
  },
  {
    id: '4',
    type: 'Text',
    title: 'Drink water',
  },
  {
    id: '5',
    type: 'Text',
    title: 'Brush teeth',
  },
  {
    id: '6',
    type: 'Text',
    title: 'Study',
  },
  {
    id: '7',
    type: 'Text',
    title: 'Make bed',
  },
  {
    id: '8',
    type: 'Text',
    title: 'Walk',
  },
  {
    id: '9',
    type: 'Text',
    title: 'Write journal',
  },
  {
    id: '10',
    type: 'Text',
    title: 'Learn a new word',
  },
];

export const getHabitFromId = (id: string): string => {
  return habits.find((habit: ItemData) => habit.id === id)?.title || id
}