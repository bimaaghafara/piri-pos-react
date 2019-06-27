import {themeService, fontService} from '../../../Services';

themeService.set('orderCardPage', {
  borderBottom: {
    borderBottomColor: '#ddd', borderBottomWidth: 1
  },
  borderTop: {
    borderTopColor: '#ddd', borderTopWidth: 1,
  },
  left: {
    flex: 0, paddingRight: 8
  },
  right: {
    flex: 0, flexDirection: 'row',
  },
  name: {
    fontSize: fontService.sm, padding: 2
  },
  number: {
    fontSize: fontService.xs, color: '#666', padding: 2,
  },
  totalQuantity: {
    borderColor: 'blue', borderWidth: 1, borderRadius: 99, width: 25, height: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, fontSize: fontService.sm,
  },
  totalPrice: {
    fontWeight: '700', fontSize: fontService.sm,
  },
  modalHeader: {
    borderBottomColor: '#ddd', borderBottomWidth: 1, padding: 15,
  },
  modalFooter: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 15,
  },
  description2: {
    color: 'red', fontSize: fontService.xs, lineHeight: fontService.md,
  },
});