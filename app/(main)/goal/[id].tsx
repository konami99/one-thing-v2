import { View, Text, Pressable } from "react-native"
import BackButton from "@/components/BackButton"
import { useRouter } from "expo-router";
import { Calendar, CalendarUtils } from 'react-native-calendars';
import ScreenWrapper from "@/components/ScreenWrapper";
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { getDaysOfCurrentWeek } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from 'expo-router';
import RadioButton from "@/components/RadioButton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const INITIAL_DATE = new Date().toISOString().split('T')[0];

const GoalEdit = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);
  const [goalsAndCompletes, setGoalsAndCompletes] = useState([])
  const { id } = useLocalSearchParams<{ id: string }>();

  const onDayPress = useCallback((day: { dateString: SetStateAction<string>; }) => {
    console.log('onDayPress: ', day);
    setSelected(day.dateString);
  }, []);

  const getDate = (count: number) => {
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const marked = useMemo(() => {
    return {
      [getDate(-1)]: {
        dotColor: 'red',
        marked: true
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: 'orange',
        selectedTextColor: 'red'
      }
    };
  }, [selected]);

  const dates = getDaysOfCurrentWeek();

  const fetchGoals = async (userId: string) => {
    setGoalsAndCompletes([]);
    let { data, error } = await supabase.rpc('getgoalsandcompletesfromgoalid', { goalid: id, user_id: userId })
    if (error) console.error(error)
    else console.log(data);

    setGoalsAndCompletes(data);
  }

  useEffect(() => {
    if (user?.id) {
      fetchGoals(user.id);
    }
  }, []);

  const toggleHandler = () => {
    console.log('toggle')
  }

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
    }

    return <View>
      <Text>{ date.day }</Text>
    </View>
  };

  const back = () => {
    router.push(`/(main)/home`);
  }

  return (
    <ScreenWrapper bg={"white"}>
      <View className="m-4 mt-2">
        <View className="flex flex-row justify-end">
          <Pressable onPress={ back }>
            <FontAwesome5 name="arrow-left" size={24} color="black" />
          </Pressable>
        </View>
        <View className="mt-4">
          <Calendar
            onDayPress={ onDayPress }
            onMonthChange={ (month: any) => console.log('month changed', month) }
            dayComponent={({ date, index }: { date: string, index:  number }) => renderDay(date, index)}
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default GoalEdit