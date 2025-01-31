import { View, Text, Pressable } from "react-native";
import RadioButton from "./RadioButton";
import { Link, useRouter } from "expo-router";

interface GoalProps {
  goal: any;
  currentWeekDates: string[];
}

const Goal = ({ goal, currentWeekDates }: GoalProps) => {
  const router = useRouter();

  const completed_dates = goal.completed_dates;

  const press = () => {
    console.log('clicked');
    router.push(`./goal/${goal.id}`);
  }

  return (
    <Pressable onPress={ press } className="bg-green-500 rounded-xl h-32 flex flex-row justify-between mr-4 mt-4">
      <View className="ml-4">
        {/*
        <View className="mt-6">
          <Text>15 x</Text>
        </View>
        */}
        <View className="mt-14">
          <Text className="text-lg font-bold">{ goal.name }</Text>
          {
            goal?.mincount && goal?.minunit &&
            <Text><Text className="font-bold">{ goal.mincount }</Text> { goal.minunit }</Text>
          }
        </View>
      </View>
      <View className="flex flex-row justify-between w-[65%] mr-4">
        {currentWeekDates.map((date, index) => {
          const completed = completed_dates === null ? false : completed_dates.includes(date);
          return <RadioButton key={ index } isOnInit={ completed } goalId={ goal?.id } date={ date } style="mt-6" />
        })}
      </View>
    </Pressable>
  )
}

export default Goal;