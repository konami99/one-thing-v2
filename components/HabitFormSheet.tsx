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
import { habits, ItemData, getRandomColor, colorCodes } from "@/helpers/common";
import { Link } from "expo-router";

type HabitFormSheetProps = {
  sheet: React.RefObject<TrueSheet>;
  dismiss: Function,
  goal?: any,
};

const HabitFormSheet = ({ sheet, dismiss, goal }: HabitFormSheetProps) => {
  const flatListRef = useRef(null);
  const { user } = useAuth();

  const [color, setColor] = useState('');
  const [page, setPage] = useState(1);
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

  const nextPage = () => {
    setPage(prevCount => prevCount + 1);
  }

  const previousPage = () => {
    if (page > 1) setPage(prevCount => prevCount - 1);
  }

  const handlePresent = () => {
    goal ? setColor(goal.color) : setColor(getRandomColor());
  }

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
      setColor(goal.color)
    } else {
      setActivityInput('')
      scrollToItem(0)
      setHabit('')
      setHabitId(0)
      setButtonText('CREATE')
      setFrequency('1')
      setFrequencyRange('1')
      setMinCount(null)
      setMinUnit(null)
    }
    setPage(1);
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
        color,
        enabled: true,
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
        color,
        enabled: true,
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
        console.log('error', error)
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
        style={{ borderColor: color, backgroundColor: habitId === Number(item.id) ? color : 'white' }}
        className={`border-4 mr-4 rounded-full px-4 min-w-36 h-14 flex justify-center items-center`}>
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

  const showColorPanel = () => {
    setPage(2);
  }

  const changeColor = (colorCode: string) => {
    setColor(colorCode);
    setPage(1);
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
      onPresent={ handlePresent }
    >
      { 
        page === 1 &&
        <>
          <View className="flex flex-row justify-between">
            <Text className="my-4 text-4xl">I want to *</Text>
            <Pressable onPress={ showColorPanel } style={{ backgroundColor: color, borderColor: color }} className={`my-auto rounded-full w-8 h-8`}>
            </Pressable>
          </View>
          <FlatList
            ref={flatListRef}
            initialScrollIndex={0}
            data={habits}
            horizontal
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={ item => item.id }
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />
          <View>
            <View className="flex flex-row items-center mt-4">
              <View className="w-24 rounded-xl mr-2" style={{ backgroundColor: color }}>
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
              <View className="w-24 rounded-xl mr-2" style={{ backgroundColor: color }}>
                <Picker
                  className="w-24 rounded-xl mr-2"
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
            <Pressable style={{ backgroundColor: color }} className="flex flex-row items-center justify-center h-14 w-1/3 rounded-full" onPress={ goal ? onUpdate : onCreate }>
              <Text className='text-white text-lg font-bold'>{ buttonText }</Text>
            </Pressable>
          </View>
        </>
      }
      {
        page === 2 &&
        <>
          <View>
            <View className="my-4 flex flex-row flex-row-reverse justify-between">
              <Pressable onPress={ previousPage }>
                <FontAwesome5 name="arrow-left" size={24} color="black" />
              </Pressable>
            </View>
            <View className="flex-1 flex-row flex-wrap pt-6">
              {
                colorCodes.map((colorCode, index) => {
                  return (
                    <View key={index} className="w-1/2 items-center my-4">
                      <Pressable onPress={ () => changeColor(colorCode) } style={{ backgroundColor: colorCode }} className={ `w-20 h-20 rounded-full ${ colorCode == color ? 'border-black border-4 border-solid' : '' }` }>
                
                      </Pressable>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </>
      }
    </TrueSheet>
  )
}

export default HabitFormSheet;