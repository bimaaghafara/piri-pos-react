import {themeService, fontService} from '../../Services';

themeService.set('piriPayPage', {
  space: {
    marginBottom: 15,
  },
  label: {
    fontSize: fontService.sm,
    marginBottom: 10,
  },
  labelTermsAndConditions: {
    fontSize: fontService.sm
  },
  rowForm: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flexGrow: 1,
    marginRight: 10,
    height: 35,
  },
  searchButton: {
    height: 34,
  },
  input: {
    height: 35,
  }
});