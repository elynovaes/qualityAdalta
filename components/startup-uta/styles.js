import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0E5A8A',
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  sectionHeaderInterno: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0E5A8A',
  },

  subSectionTitleHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D4ED8',
    flex: 1,
    paddingRight: 8,
    lineHeight: 21,
  },

  toggleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  mainSectionBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  subSectionContainer: {
    marginTop: 14,
  },

  subSectionBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#F9FAFB',
  },

  subSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
    marginBottom: 8,
  },

  fieldBlock: {
    marginBottom: 12,
  },

  selectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  selectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
    lineHeight: 19,
  },

  selectionRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#EFF6FF',
  },

  optionButtonLast: {
    marginRight: 0,
  },

  optionButtonSelected: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },

  optionButtonText: {
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 13,
  },

  optionButtonTextSelected: {
    color: '#FFFFFF',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  halfInput: {
    flex: 1,
    marginRight: 6,
  },

  halfInputNoMargin: {
    flex: 1,
  },

  thirdInput: {
    flex: 1,
    marginRight: 6,
  },

  thirdInputNoMargin: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 14,
    color: '#111827',
  },

  inputMatrix: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    margin: 2,
    textAlign: 'center',
    fontSize: 12,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },

  statusPreenchimento: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },

  resultadoBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },

  resultadoOk: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
  },

  resultadoAlerta: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 4,
  },

  resultadoInfo: {
    fontSize: 13,
    marginBottom: 8,
    color: '#4B5563',
    lineHeight: 19,
  },

  resultadoOkInline: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },

  resultadoAlertaInline: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
  },

  inputComentario: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    minHeight: 110,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#111827',
  },

  tableRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },

  firstColumn: {
    flex: 1.3,
    paddingRight: 6,
  },

  otherColumn: {
    flex: 1,
    paddingHorizontal: 2,
  },

  tableHeader: {
    fontWeight: '700',
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },

  infoAuxiliar: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },

  filtroBox: {
    marginTop: 8,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  filterColumnTipo: {
    flex: 1.1,
    paddingHorizontal: 2,
  },

  filterColumnCriterio: {
    flex: 1,
    paddingHorizontal: 2,
  },

  filterColumnDeltaP: {
    flex: 1.1,
    paddingHorizontal: 2,
  },

  saveButton: {
    marginTop: 24,
    backgroundColor: '#0E5A8A',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#0E5A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default styles;