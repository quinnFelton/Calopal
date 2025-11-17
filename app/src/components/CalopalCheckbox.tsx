import { View, Stylesheet, Text } from 'react-native';
import { styles } from "../style/styles";

export default function CalopalCheckbox({enabled = false, style}:
  {enabled: boolean; style: Stylesheet;}) {
  return (
    <View style={[
        enabled
        ? styles.CalopalCheckboxEnabled
        : styles.CalopalCheckboxDisabled,
        style
    ]}>
      <Text style={styles.CalopalCheckboxText}>{enabled ? "X" : ""}</Text>
    </View>
  )
}