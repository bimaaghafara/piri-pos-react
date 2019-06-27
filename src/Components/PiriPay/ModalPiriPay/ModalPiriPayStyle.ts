import {themeService, fontService} from '../../../Services';

themeService.set('modalPiriPayComponent', {
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  modalContent: {
    flexGrow : 1, justifyContent : 'center'
  },
  modalWrapper: {
    margin: 20, paddingHorizontal: 10, backgroundColor: '#fff', borderRadius: 10, borderColor: '#ddd', borderWidth: 2
  },
  icon:{
    width: 125, height: 125, alignSelf: 'center', marginVertical: 15,
  },
  tittle: {
    alignSelf: 'center', fontSize: fontService.xl, marginBottom: 15,
  },
  bodyText: {
    fontSize: fontService.md,
  },
  buttonContainer: {
    flexDirection: 'row', justifyContent: 'center', flexGrow: 1, marginBottom: 15,
  },
  button: {
    marginHorizontal: 10, width: 100, justifyContent: 'center',
  },
  label: {
    fontSize: fontService.sm,
    marginBottom: 10,
  },
  input: {
    height: 35,
  },
  warning: {
    marginTop: 15, fontSize: fontService.xs,
  },
  error: {
    fontSize: fontService.md,
  }
});