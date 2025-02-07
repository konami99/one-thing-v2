import { View, Text, Pressable, ScrollView } from "react-native"
import BackButton from "@/components/BackButton"
import { Link, useRouter } from "expo-router";
import { Calendar, CalendarUtils, DateData } from 'react-native-calendars';
import ScreenWrapper from "@/components/ScreenWrapper";
import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDaysOfCurrentWeek } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from 'expo-router';
import RadioButton from "@/components/RadioButton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import HabitFormSheet from "@/components/HabitFormSheet";
import { getHabitFromId } from "@/helpers/common";

const INITIAL_DATE = new Date().toISOString().split('T')[0];

const GoalEdit = () => {
  const sheet = useRef<TrueSheet>(null)
  const { user } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);
  const [goalsAndCompletes, setGoalsAndCompletes] = useState([])
  const { id, dateTime } = useLocalSearchParams<{ id: string, dateTime: string }>();
  const [updateKey, setUpdateKey] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getDate = (count: number) => {
    console.log('getdate')
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const dates = getDaysOfCurrentWeek();

  const fetchGoals = async (userId: string, some_date: string) => {
    setGoalsAndCompletes([]);
    let { data, error } = await supabase.rpc('getgoalsandcompletesfromgoalid', { goalid: Number(id), user_id: userId, some_date })
    if (error) console.error(error)
    else console.log(data);

    setGoalsAndCompletes(data);
  }

  useEffect(() => {
    if (user?.id) {
      fetchGoals(user.id, INITIAL_DATE);
    }
  }, [updateKey, dateTime]);

  const renderDay = (date: any, index: number) => {
    const goal = goalsAndCompletes?.length > 0 ? goalsAndCompletes[0] : undefined;
    const completed_dates = goal?.completed_dates;

    if (goal !== undefined) {
      if (dates.includes(date.dateString) && completed_dates && completed_dates.includes(date.dateString)) {
        return <RadioButton key={ index } isOnInit={ true } goalId={ goal?.id } date={ date.dateString } style="mt-0.5" />
      }
      else if (dates.includes(date.dateString)) {
        return <RadioButton key={ index } isOnInit={ false } goalId={ goal?.id } date={ date.dateString } style="mt-0.5" />
      }
      else if (!dates.includes(date.dateString) && completed_dates && completed_dates.includes(date.dateString)) {
        return <View className={ `mt-0.5 h-4 w-4 rounded-lg border-2 border-gray-500 bg-gray-500`} />
      }
    }

    return <View>
      <Text className="text-gray-500">{ date.day }</Text>
    </View>
  };

  const back = () => {
    console.log(`back`)
    router.push("/(tabs)/home");
  }

  const present = async () => {
    await sheet.current?.present();
  }

  const dismiss = async () => {
    await sheet.current?.dismiss();
    setUpdateKey((prevKey) => prevKey + 1);
  }

  const goal = () => {
    return goalsAndCompletes && goalsAndCompletes.length > 0 ? goalsAndCompletes[0] : undefined;
  }

  const deleteHabit = async () => {
    console.log('goalsAndCompletes', goalsAndCompletes.length)
    if (goalsAndCompletes.length > 0) {
      const goal = goalsAndCompletes[0];

      const { error } = await supabase
        .from('Goal')
        .update({ enabled: false })
        .eq('id', goal.id)

      if (error) console.log(`delete error: `, error)
      else {
        console.log('dismiss')
        router.push("/(tabs)/home");
      }
    }
  }

  const smallestUnit = (): string => {
    if (goal() && goal()!.mincount && goal()!.minunit) {
      return `${goal()!.mincount} ${goal()!.minunit}`
    }
    
    return 'Define a smallest unit'
  }

  return (
    <ScreenWrapper bg={"white"}>
      <ScrollView
        showsHorizontalScrollIndicator={ false }
        showsVerticalScrollIndicator={ false }
      >
        <View className="m-4 mt-2">
          <View className="m-3 flex flex-row justify-between">
            {
              goal() &&
              <Text className="text-4xl font-bold">{ getHabitFromId(goal()!.name) }</Text>
            }
            <Link href={{pathname: "/(tabs)", params: {dateTime: Date.now()}}} asChild>
              <Pressable onPress={ back }>
                <FontAwesome5 name="arrow-left" size={24} color="black" />
              </Pressable>
            </Link>
          </View>
          <View className="mt-4">
            <Text className="mx-4 text-3xl">Activity</Text>
            <Calendar
              onMonthChange={ (date: DateData) => { fetchGoals(user.id, date.dateString); }}
              dayComponent={({ date, index }: { date: string, index:  number }) => renderDay(date, index)}
              theme={{
                arrowColor: 'black',
                'stylesheet.calendar.header': {
                  header: {
                    flexDirection: 'row',
                    justifyContent: 'start',
                    paddingLeft: 0,
                    paddingRight: 10,
                    marginTop: 6,
                    alignItems: 'center',
                  },
                }
              }}
              /*
              renderHeader={ (date: DateData)  => {
                console.log(date)
                return <Text>ere</Text>
              }}
              */
            />
          </View>
          <View className="mt-4">
            <Text className="mx-4 text-3xl">Goal</Text>
            <Pressable onPress={present} className="mx-4 mt-2 py-1 px-4 bg-green-500 rounded-xl flex flex-row items-center justify-between">
              <Text className="font-bold text-xl">
                { goal() &&
                    `${getHabitFromId(goal()!.name)} ${goal()!.frequency} times in ${goal()!.frequencyrange} days`  } 
              </Text>
              <FontAwesome5 name="pencil-alt" size={12} color="black" />
            </Pressable>
            <Pressable onPress={present} className="mx-4 mt-2 py-1 px-4 bg-green-500 rounded-xl flex flex-row items-center justify-between">
              <Text className="font-bold text-xl">
                { smallestUnit() }
              </Text>
              <FontAwesome5 name="pencil-alt" size={12} color="black" />
            </Pressable>
            <HabitFormSheet sheet={sheet} dismiss={dismiss} goal={goal()} />
          </View>

          <View className="bg-[#ccc] h-1 my-10 mx-4" />
          
          {
            confirmDelete ?
            <View>
              <Text className="mx-4 mb-4 text-3xl">Delete Habit?</Text>
              <View className="flex flex-row justify-start items-center">
                <Pressable onPress={ deleteHabit } className="mx-4 py-1 h-16 w-28 px-4 bg-green-500 rounded-full flex flex-row items-center justify-center">
                  <Text className="font-bold text-xl">
                    YES
                  </Text>
                </Pressable>
                <Pressable onPress={ () => setConfirmDelete(false) } className="mx-4 py-1 h-16 w-28 px-4 bg-green-500 rounded-full flex flex-row items-center justify-center">
                  <Text className="font-bold text-xl">
                    NO
                  </Text>
                </Pressable>
              </View>
            </View>
            : <View className="flex flex-row items-center justify-center">
              <Pressable onPress={ () => setConfirmDelete(true) } className="mx-4 py-1 h-16 w-52 px-4 bg-green-500 rounded-full flex flex-row items-center justify-center">
                <Text className="font-bold text-xl">
                  DELETE HABIT
                </Text>
              </Pressable>
            </View>
          }
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

export default GoalEdit