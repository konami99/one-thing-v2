import { View, Text } from "react-native"
import BackButton from "@/components/BackButton"
import { useRouter } from "expo-router";

const GoalEdit = () => {
  const router = useRouter();

  return (
    <View>
      <BackButton router={router} />
      <Text>Edit Goal</Text>
    </View>
  )
}

export default GoalEdit