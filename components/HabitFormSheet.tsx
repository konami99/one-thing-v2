import { setStatusBarHidden } from "expo-status-bar"
import { Alert, StyleSheet, Text, View } from "react-native"
import { ScrollView, Pressable } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEffect, useRef, useState } from "react"
import { Modal, Button, FlatList, TextInput } from 'react-native'
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { Picker } from '@react-native-picker/picker';
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext"
import { habits } from "@/helpers/common";
import { ItemData } from "@/helpers/common";

type HabitFormSheetProps = {
  sheet: React.RefObject<TrueSheet>;
  dismiss: Function,
  goal?: any,
};

const HabitFormSheet = ({ sheet, dismiss, goal }: HabitFormSheetProps) => {
  const flatListRef = useRef(null);
  const { user } = useAuth();

  const [habit, setHabit] = useState('');
  const [habitId, setHabitId] = useState(0);

  const [activityInput, setActivityInput] = useState('');
  // "2" times
  const [frequency, setFrequency] = useState('1');
  // in "11" days
  const [frequencyRange, setFrequencyRange] = useState('1');
  // "10"
  const [minCount, setMinCount] = useState<number | null>(null)
  // "pages"
  const [minUnit, setMinUnit] = useState<string | null>(null)

  const [buttonText, setButtonText] = useState('CREATE')

  useEffect(() => {
    var name = goal ? goal.name : '';

    if (name.length > 0) {
      if (goal.habitid === 0) {
        setActivityInput(name)
      } else {
        setActivityInput('')
        scrollToItem(goal.habitid)
      }
      setHabit(name)
      setHabitId(goal.habitid)
      setButtonText('SAVE')
      setFrequency(goal.frequency.toString())
      setFrequencyRange(goal.frequencyrange.toString())
      setMinCount(goal.mincount)
      setMinUnit(goal.minunit)
    }
  }, [goal]);

  const scrollToItem = (index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // Center the item in view
    });
  };

  /*
  const resetForm = () => {

  }
  */

  const handleDismiss = () => {
    var name = goal ? goal.name : '';
    
    if (name.length > 0) {
      if (goal.habitid === 0) {
        setActivityInput(name)
      } else {
        setActivityInput('')
        scrollToItem(goal.habitid)
      }
      setHabit(name)
      setHabitId(goal.habitid)
      setButtonText('SAVE')
      setFrequency(goal.frequency.toString())
      setFrequencyRange(goal.frequencyrange.toString())
      setMinCount(goal.mincount)
      setMinUnit(goal.minunit)
    } else {
      setActivityInput('')
      scrollToItem(0)
      setHabit('')
      setHabitId(0)
      setButtonText('CREATE')
      setFrequency('')
      setFrequencyRange('')
      setMinCount(null)
      setMinUnit(null)
    }
  }

  const timePluralConverter = () => {
    if (frequency === '1' && frequencyRange === '1') {
      return 'time a'
    } if (Number(frequency) > 1 && frequencyRange === '1') {
      return 'times a'
    } if (Number(frequency) > 1 && Number(frequencyRange) > 1) {
      return 'times in'
    } else { // frequency === 1 and frequencyRange > 1
      return 'time in'
    }
  }

  const updateHabit = async () => {
    const { error } = await supabase
      .from('Goal')
      .update({
        name: habit,
        habitId,
        frequency,
        frequencyRange,
        minCount: minCount,
        minUnit: minUnit,
        color: 'white',
        enabled: true,
        //userId: user.id,
      })
      .eq('id', goal.id)

    return error;
  }

  const createHabit = async () => {
    const { error } = await supabase
      .from('Goal')
      .insert({
        name: habit,
        habitId,
        frequency,
        frequencyRange,
        minCount,
        minUnit,
        streak: 0,
        count: 0,
        color: 'white',
        enabled: true,
        //userId: user.id,
      })

    return error;
  }

  const onUpdate = async() => {
    if (habit.trim() === '') {
    } else {
      const error = await updateHabit(); 
      if (error) {

      } else {
        await dismiss();
      }
    }
  }

  const onCreate = async() => {
    if (habit.trim() === '') {
    } else {
      const error = await createHabit(); 
      if (error) {

      } else {
        await dismiss();
      }
    }
  }

  const renderItem = ({item}: {item: ItemData}) => {
    const result = item.type === 'TextInput' ? <TextInput
      onChangeText={ (input) => {
        setHabit(input);
        setHabitId(Number(item.id));
        setActivityInput(input);
      }}
      maxLength={30}
      value={ activityInput }
      className="bg-slate-100 mr-4 rounded-lg w-36 h-14 pl-2 text-xl"
      placeholder={item.title}
    />
    : <Pressable
        onPress={ () => {
          setHabit(item.title);
          setHabitId(Number(item.id));
          setActivityInput('');
          scrollToItem(item.id)
        }}
        className={`border-4 border-green-500 mr-4 rounded-full w-36 h-14 flex justify-center items-center ${ habitId === Number(item.id) ? 'bg-green-500' : 'white' }`}>
      <Text className="text-xl">{item.title}</Text>
    </Pressable>

    return result;
  }

  const onChangeMinCount = (input: string) => {
    setMinCount(input === '' ? null : parseInt(input))
  }

  const onChangeMinUnit = (input: string) => {
    setMinUnit(input === '' ? null : input)
  }

  const frequencyItems = [];
  for (let i = 1; i <= 10; i++) {
    frequencyItems.push(
      <Picker.Item key={i} label={i.toString()} value={i.toString()} />
    );
  }

  const frequencyRangeItems = [];
  for (let i = 1; i <= 30; i++) {
    frequencyRangeItems.push(
      <Picker.Item key={i} label={i.toString()} value={i.toString()} />
    );
  }
  
  return (
    <TrueSheet
      ref={sheet}
      edgeToEdge={true}
      sizes={['large']}
      keyboardMode="pan"
      cornerRadius={24}
      style={{"padding": 24}}
      onDismiss={ handleDismiss }
    >
      <Text className="mb-[15px] text-4xl">I want to *</Text>
      <FlatList
        ref={flatListRef}
        initialScrollIndex={0}
        data={habits}
        horizontal
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={ item => item.id }
      />
      <View>
        <View className="flex flex-row items-center mt-4">
          <View className="w-24 bg-green-500 rounded-xl mr-2">
            <Picker
              selectedValue={frequency}
              onValueChange={(itemValue, itemIndex) =>
                setFrequency(itemValue)
              }>
              {frequencyItems}
            </Picker>
          </View>
          <Text className="text-2xl">{ timePluralConverter() }</Text>
        </View>
        <View className="flex flex-row items-center mt-4">
          <View className="w-24 bg-green-500 rounded-xl mr-2">
            <Picker
              className="w-24 bg-green-500 rounded-xl mr-2"
              selectedValue={frequencyRange}
              onValueChange={(itemValue, itemIndex) =>
                setFrequencyRange(itemValue)
              }>
              {frequencyRangeItems}
            </Picker>
          </View>
          <Text className="text-2xl">{ frequencyRange === '1' ? 'day' : 'days' }</Text>
        </View>
      </View>

      <View className="mt-8">
        <Text className="mb-[15px] text-4xl">Define a</Text>
        <Text className="mb-[15px] text-4xl leading-none">smallest unit</Text>
        <View>
          <TextInput
            value={minCount?.toString()}
            maxLength={3}
            keyboardType="numeric"
            onChangeText={ onChangeMinCount }
            className="bg-slate-100 mr-4 rounded-lg w-full h-14 pl-2 text-xl"
            placeholder={ 'i.e. 2' }
          />
        </View>
        <View className="mt-3">
          <TextInput
            value={minUnit?.toString()}
            maxLength={20}
            onChangeText={ onChangeMinUnit }
            className="bg-slate-100 mr-4 rounded-lg w-full h-14 pl-2 text-xl"
            placeholder={ 'i.e. Minutes' }
          />
        </View>
      </View>

      <View className="flex flex-row items-center justify-center mt-8">
        <Pressable className="flex flex-row items-center justify-center h-14 w-1/3 rounded-full bg-green-500" onPress={ goal ? onUpdate : onCreate }>
          <Text className='text-white text-lg font-bold'>{ buttonText }</Text>
        </Pressable>
      </View>
    </TrueSheet>
  )
}

export default HabitFormSheet;