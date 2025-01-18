import { setStatusBarHidden } from "expo-status-bar"
import ScreenWrapper from "../../components/ScreenWrapper"
import { useAuth } from "../../contexts/AuthContext"
import { supabase } from "../../lib/supabase"
import { Alert, StyleSheet, Text, View } from "react-native"
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Button from '../../components/Button'
import { ScrollView, Pressable } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRef, useState } from "react"
import { Modal, FlatList, TextInput } from 'react-native'
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { Picker } from '@react-native-picker/picker';

type ItemData = {
  id: number,
  type: string,
  title: string,
}

const Home = () => {
  const { user } = useAuth();
  const sheet = useRef<TrueSheet>(null)
  const [frequency, setFrequency] = useState();
  const [habit, setHabit] = useState('');

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

  const setHabitName = (name: string) => {
    console.log(name)
    setHabit(name);
  }

  const renderItem = ({item}: {item: ItemData}) => (
    ? <TextInput
      className="bg-slate-100 mr-4 rounded-lg w-36 h-14 pl-2 text-xl"
      placeholder={item.title}
    />
    : <Pressable
        onPress={ () => setHabitName(item.title) }
        className={`border-4 border-green-500 mr-4 rounded-full w-36 h-14 flex justify-center items-center ${ habit === item.title ? 'bg-green-500' : 'white' }`}>
      <Text className="text-xl">{item.title}</Text>
    </Pressable>
  )

  const present = async () => {
    await sheet.current?.present();
  }

  const dismiss = async () => {
    await sheet.current?.dismiss();
  }
  
  const onLogout = async() => {
    const { error } = await supabase.auth.signOut();
    if ( error) {
      Alert.alert('Sign out', 'Error signing out')
    }
  }

  const onSubmit = async() => {
    //console.log(user.id)
    /*
    const { data, error } = await supabase
      .from('Goal')
      .select()
      .eq('userId', user.id)
    */
    console.log('insert')
    const { data, error } = await supabase
      .from('Goal')
      .insert({
        name: 'Jump',
        createdAt: new Date(),
        updatedAt: new Date(),
        frequency: 3,
        minCount: 3,
        minUnit: 'pages',
        frequencyRange: 1,
        streak: 0,
        count: 0,
        color: 'white',
        enabled: true,
        userId: user.id,
      })
      .select()
    console.log(error)
    console.log(data)
  }

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Habits</Text>
          <TrueSheet
            ref={sheet}
            sizes={['large']}
            cornerRadius={24}
            style={{"padding": 24}}
          >
            <Text className="mb-[15px] text-4xl">I want to</Text>
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
              <Text className="text-2xl">time a day.</Text>
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
          <Pressable onPress={present}>
            <FontAwesome5 name="plus" size={24} color="black" />
          </Pressable>
        </View>
        <View className="flex flex-row justify-between">
          <Text>November</Text>
          <View className="flex flex-row justify-between w-[60%] mr-4">
            <View>
              <Text>19</Text>
              <Text>Tu</Text>
            </View>
            <View>
              <Text>19</Text>
              <Text>Tu</Text>
            </View>
            <View>
              <Text>19</Text>
              <Text>Tu</Text>
            </View>
            <View>
              <Text>19</Text>
              <Text>Tu</Text>
            </View>
            <View>
              <Text>19</Text>
              <Text>Tu</Text>
            </View>
            <View>
              <Text>19</Text>
              <Text>Tu</Text>
            </View>
            <View>
              <Text>19</Text>
              <Text>Tu</Text>
            </View>
          </View>
        </View>
        <ScrollView>
          <View style={styles.habitItem}>
            <Text>habit 1</Text>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  inputItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  scrollViewItem: {
    borderWidth: 1,
    marginRight: 15,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    height: hp(80),
    width: wp(90),
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: hp(4),
    textAlign: 'left'
  },

  habitItem: {
    backgroundColor: theme.colors.primaryDark,
    height: hp(17),
    borderRadius: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(5)
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(8),
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    height: hp(4),
    //alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    //marginHorizontal: wp(4)
  },
  title: {
    //height: hp(8),
    color: theme.colors.text,
    fontSize: hp(5),
    //marginBottom: 20,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4)
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight
  },
  pillText: {
    color: 'white',
    fontSize: hp(1.2),
  }
})

export default Home;