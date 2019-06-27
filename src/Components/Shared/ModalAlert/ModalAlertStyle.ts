import {themeService} from '../../../Services';

themeService.set('modalAlertComponent', {
  container: {alignItems: 'center'},
  middleText: {textAlign: 'center', fontWeight: 'bold', fontSize: 28, marginTop: 10},
  bottomText: {textAlign: 'center', fontSize: 20, marginTop: 5},
  buttonContainer: {flexDirection: 'row', justifyContent: 'center', flexGrow: 1, marginTop: 10},
  button: {margin: 10, width: 100, justifyContent: 'center'},
});
