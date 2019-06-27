import {themeService, fontService} from '../../Services';

themeService.set('settingsHistoryPage', {

  input: {
    height: 35, marginBottom: 12,
  },
  label: {
    margin: 0,
    fontSize: fontService.sm,
    color: '#7a7371'
  },
  value: {
    fontWeight: 'bold'
  },
});