import {themeService, scaleService, fontService} from '../../Services';

themeService.set('signinPage', {
  headerText: {
    fontSize: fontService.xl,
  },
  labelText: {
    color: '#7d7d7d',
    fontSize: fontService.sm
  },
  emailContainer: {
    marginTop: scaleService.horizontal(20),
    paddingLeft: scaleService.horizontal(35),
  },
  passwordContainer: {
    marginTop: scaleService.horizontal(25),
    paddingLeft: scaleService.horizontal(35),
  },
  chekboxContainer: {
    marginTop: scaleService.horizontal(10),
    marginBottom: scaleService.horizontal(8),
  },
  loginText: {
    fontSize: fontService.lg,
  },
  input: {
    height: scaleService.vertical(50),
    fontSize: fontService.md
  }
});