import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },

  sectionHeaderInterno: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  subSectionTitleHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D4ED8',
    flex: 1,
    paddingRight: 8,
  },

  toggleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  mainSectionBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fafafa',
  },

  subSectionContainer: {
    marginTop: 14,
  },

  subSectionBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },

  subSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 8,
  },

  selectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  selectionSubtitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },

  selectionRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },

  optionButtonLast: {
    marginRight: 0,
  },

  optionButtonSelected: {
    backgroundColor: '#1D4ED8',
  },

  optionButtonText: {
    color: '#1D4ED8',
    fontWeight: '700',
  },

  optionButtonTextSelected: {
    color: '#fff',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  halfInput: {
    flex: 1,
    marginRight: 5,
  },

  halfInputNoMargin: {
    flex: 1,
  },

  thirdInput: {
    flex: 1,
    marginRight: 5,
  },

  thirdInputNoMargin: {
    flex: 1,
  },

  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },

  inputMatrix: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    margin: 2,
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: '#fff',
  },

  statusPreenchimento: {
    marginTop: 8,
    fontSize: 13,
    color: '#555',
  },

  resultadoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },

  resultadoOk: {
    fontSize: 14,
    fontWeight: '600',
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
    color: '#444',
  },

  resultadoOkInline: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
  },

  resultadoAlertaInline: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
  },

  inputComentario: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    minHeight: 90,
  },

  tableRow: {
    flexDirection: 'row',
    marginBottom: 8,
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
    textAlign: 'center',
    marginBottom: 4,
  },

  infoAuxiliar: {
    marginTop: 8,
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },

  filtroBox: {
    marginTop: 6,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
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
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default styles;