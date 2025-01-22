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
import { Modal, FlatList, TextInput } from 'react-native';
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import HabitFormSheet from "@/components/HabitFormSheet"

const Home = () => {
  const sheet = useRef<TrueSheet>(null)

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

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Habits</Text>
          
          <HabitFormSheet sheet={sheet} dismiss={dismiss} />

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