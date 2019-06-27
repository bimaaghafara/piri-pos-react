import {themeService, fontService} from '../../../Services';

themeService.set('orderHistoryPage', {
  label: {
    margin: 0,
    fontSize: fontService.sm,
    color: '#7a7371'
  },
  value: {
    fontWeight: 'bold'
  },
  input: {
    height: 35, marginBottom: 12,
  },
  separator: {
    marginBottom: 7,
  }
});