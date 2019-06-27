import {themeService} from '../../Services';
import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width

themeService.set('productsPage', {
  label: {
    marginBottom: 8,
  },
  value: {
    maxWidth: deviceWidth - 160,
  },
  input: {
    height: 35, marginBottom: 12,
  },
});