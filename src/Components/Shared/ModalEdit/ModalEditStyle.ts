import {themeService, fontService} from '../../../Services';

themeService.set('modalEditComponent', {
  modalHeader: {
    borderBottomColor: '#ddd', borderBottomWidth: 1, padding: 15,
  },
  modalFooter: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 15,
  },
  left: {
    flex: 0, paddingRight: 0,
  },
  right: {
    flex: 0, flexDirection: 'row',
  },
  borderBottom: {
    borderBottomColor: '#ddd', borderBottomWidth: 1
  },
  textButton: {
    paddingLeft: 10, paddingRight: 10,
  },
  buttonFooter: {
    minWidth: 60, marginLeft: 10, justifyContent: 'center',
  },
  description2: {
    color: 'red', fontSize: fontService.xs, lineHeight: fontService.md,
  },
});
