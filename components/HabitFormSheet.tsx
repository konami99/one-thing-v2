import { setStatusBarHidden } from "expo-status-bar"
import { Alert, StyleSheet, Text, View } from "react-native"
import { ScrollView, Pressable } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRef, useState } from "react"
import { Modal, Button, FlatList, TextInput } from 'react-native'
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { Picker } from '@react-native-picker/picker';
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext"

type ItemData = {
  id: number,
  type: string,
  title: string,
}

type HabitFormSheetProps = {
  sheet: React.RefObject<TrueSheet>;
  dismiss: Function,
};

const HabitFormSheet = ({ sheet, dismiss }: HabitFormSheetProps) => {
  const { user } = useAuth();

  const [habit, setHabit] = useState('');
  const [activityInput, setActivityInput] = useState('');
  // "2" times
  const [frequency, setFrequency] = useState(1);
  // in "11" days
  const [frequencyRange, setFrequencyRange] = useState(1);
  // "10"
  const [minCount, setMinCount] = useState<number | null>(null)
  // "pages"
  const [minUnit, setMinUnit] = useState<string | null>(null)
  
  const [buttonText, setButtonText] = useState('CREATE')

  const data: ItemData[] = [
    {
      id: 0,
      type: 'TextInput',
      title: 'Activity',
    },
    {
      id: 1,
      type: 'Text',
      title: 'Drink water',
    },
    {
      id: 2,
      type: 'Text',
      title: 'Brush teeth',
    },
    {
      id: 3,
      type: 'Text',
      title: 'Study',
    },
    {
      id: 4,
      type: 'Text',
      title: 'Make bed',
    },
    {
      id: 5,
      type: 'Text',
      title: 'Walk',
    },
  ];

  const resetForm = () => {

  }

  const timePluralConverter = () => {
    return frequency > 1 ? 'times' : 'time';
  }

  const createHabit = async () => {
    const { error } = await supabase
      .from('Goal')
      .insert({
        name: habit,
        frequency: frequency,
        frequencyRange: 1,
        minCount: minCount,
        minUnit: minUnit,
        streak: 0,
        count: 0,
        color: 'white',
        enabled: true,
        userId: user.id,
      })

    return error;
  }

  const onCreate = async() => {
    console.log('SUBMIT')
    console.log('habit', habit)
    console.log('frequency', frequency);
    console.log('frequencyRange', frequencyRange)
    console.log('minCount', minCount);
    console.log('minUnit', minUnit)

    if (habit.trim() === '') {
      console.log('habit is empty')
    } else {
      console.log('push to supa')
      const error = await createHabit(); 
      console.log('error', error)
      if (error) {

      } else {
        resetForm();
        await dismiss();
      }
    }
  }

  const renderItem = ({item}: {item: ItemData}) => {
    console.log(habit)
    const result = item.type === 'TextInput' ? <TextInput
      onChangeText={ (input) => {
        setHabit(input);
        setActivityInput(input);
      }}
      maxLength={30}
      value={activityInput}
      className="bg-slate-100 mr-4 rounded-lg w-36 h-14 pl-2 text-xl"
      placeholder={item.title}
    />
    : <Pressable
        onPress={ () => {
          setHabit(item.title);
          setActivityInput('');
        }}
        className={`border-4 border-green-500 mr-4 rounded-full w-36 h-14 flex justify-center items-center ${ habit === item.title ? 'bg-green-500' : 'white' }`}>
      <Text className="text-xl">{item.title}</Text>
    </Pressable>

    return result;
  }
  
  return (
    <TrueSheet
      ref={sheet}
      sizes={['large']}
      cornerRadius={24}
      style={{"padding": 24}}
    >
      <Text className="mb-[15px] text-4xl">I want to *</Text>
      <FlatList
        data={data}
        horizontal
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
      <View className="flex flex-row items-center mt-4">
        <View className="w-24 bg-green-500 rounded-xl mr-2">
          <Picker
            selectedValue={frequency}
            onValueChange={(itemValue, itemIndex) =>
              setFrequency(itemValue)
            }>
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
          </Picker>
        </View>
        <Text className="text-2xl">{ timePluralConverter() } a day *</Text>
      </View>

      <View className="mt-8">
        <Text className="mb-[15px] text-4xl">Define a</Text>
        <Text className="mb-[15px] text-4xl leading-none">smallest unit</Text>
        <View>
          <TextInput
            value={minCount?.toString()}
            maxLength={3}
            keyboardType="numeric"
            onChangeText={ (input) => setMinCount(parseInt(input)) }
            className="bg-slate-100 mr-4 rounded-lg w-full h-14 pl-2 text-xl"
            placeholder={ 'i.e. 2' }
          />
        </View>
        <View className="mt-3">
          <TextInput
            value={minUnit?.toString()}
            maxLength={20}
            onChangeText={ (input) => setMinUnit(input) }
            className="bg-slate-100 mr-4 rounded-lg w-full h-14 pl-2 text-xl"
            placeholder={ 'i.e. Minutes' }
          />
        </View>
      </View>

      <View className="flex flex-row items-center justify-center mt-8">
        <Pressable className="flex flex-row items-center justify-center h-14 w-1/3 rounded-full bg-green-500" onPress={onCreate}>
          <Text className='text-white text-lg font-bold'>{ buttonText }</Text>
        </Pressable>
      </View>

      {/*
      <Button 
        textStyle={"bold"}
        title="Getting Started" 
        buttonStyle={{marginHorizontal: wp(3)}} 
        onPress={onSubmit}
      />
      
      <Button textStyle={"bold"} buttonStyle={{marginHorizontal: wp(3)}} onPress={dismiss} title="Dismiss" />
      */}
    </TrueSheet>
  )
}

export default HabitFormSheet;