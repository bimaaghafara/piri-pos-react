import {themeService, scaleService, fontService} from '../../Services';

themeService.set('easyLoginPage', {
  input: {
    height: scaleService.vertical(50),
    fontSize: fontService.md
  },
  modalButtonContainer: {
    flexDirection: 'row', justifyContent: 'center', flexGrow: 1
  },
  modalButton: {
    margin: 10, width: 100, justifyContent: 'center'
  },
  headerText: {
    fontSize: fontService.xl,
    textAlign: 'center'
  },
  username: {
    color: 'blue',
    fontSize: fontService.xl,
  },
  label: {
    fontSize: fontService.md,
  },
  passwordContainer: {
    paddingHorizontal: 20,
    marginVertical: 10
  }
});