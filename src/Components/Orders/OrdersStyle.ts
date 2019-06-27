import {themeService, fontService} from '../../Services';

themeService.set('ordersPage', {
  topContainer: {
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 15
  },
  topMenuContainer: {
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 0, paddingBottom: 10
  },
  merchantContainer: {
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'
  },
  switchOnline:  {
    width: 100, height: 31, borderColor: '#ccc', borderWidth: 2, borderRadius: 99, marginRight: 10,
  },
  buttonRefresh: {
    width: 90, flexDirection: 'row', justifyContent: 'space-evenly',
  },
  status: {
    paddingLeft: 12, marginTop: 20, color: 'red', fontSize: fontService.md,
  },
  blue: { color: 'blue'},
  red: { color: 'red'},
  green: { color: 'green'},
});