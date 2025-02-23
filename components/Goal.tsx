import { View, Text, Pressable } from "react-native";
import RadioButton from "./RadioButton";
import { Link, useRouter } from "expo-router";
import { getHabitFromId } from "@/helpers/common";

interface GoalProps {
  goal: any;
  currentWeekDates: string[];
}

const Goal = ({ goal, currentWeekDates }: GoalProps) => {
  const router = useRouter();

  const completed_dates = goal.completed_dates;

  return (
    <Link href={{pathname: '/(tabs)/home/[id]', params: {id: goal.id, dateTime: Date.now()}}} asChild>
      <Pressable style={{ backgroundColor: goal.color }} className="rounded-xl min-h-[6rem] flex flex-col justify-between mt-4">
        <View className="flex flex-row justify-between">
          <Text></Text>
          <View className="flex flex-row w-[65%] justify-evenly">
            {currentWeekDates.map((date, index) => {
              const completed = completed_dates === null ? false : completed_dates.includes(date);
              return <RadioButton key={ index } isOnInit={ completed } goalId={ goal?.id } date={ date } style="mt-6" />
            })}
          </View>
        </View>
        <View className="ml-4 mb-4 mt-8">
          <View>
            <Text className="text-lg font-bold">{ getHabitFromId(goal.name) }</Text>
            {
              goal?.mincount && goal?.minunit &&
              <Text><Text className="font-bold">{ goal.mincount }</Text> { goal.minunit }</Text>
            }
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

export default Goal;