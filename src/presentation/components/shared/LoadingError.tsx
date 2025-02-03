import {Text} from 'react-native-paper';
import {styles} from '../../theme/theme';
import {View, ActivityIndicator} from 'react-native';

export const LoadingError = ({
  loading,
  error,
}: {
  loading: boolean;
  error: string;
}) => (
  <View style={styles.row}>
    <Text>{loading && <ActivityIndicator size="large" color="#0000ff" />}</Text>
    <Text>{error && <Text style={{color: 'red'}}>{error}</Text>}</Text>
  </View>
);
