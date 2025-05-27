import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  weatherBox: {
    backgroundColor: '#6347EB',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    color: '#fff',
  },
  weatherHeading: {
    fontWeight: 600,
    marginBottom: 12,
    fontSize: 18,
  },
  infoText: {
    fontSize: 14,
    marginVertical: 4,
    color: '#fff',
  },
  forecastHeading: {
    fontWeight: 600,
    fontSize: 18,
    marginBottom: 12,
  },
  forecastCard: {
    elevation: 2,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 6,
    padding: 12,
  },
  forecastDatas: {
    paddingVertical: 4,
  },
  newsheadline: {
    fontWeight: 600,
    marginTop: 20,
    marginBottom: 12,
    fontSize: 18,
  },
  newsBox: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  newsBoxContentContainer: {
    paddingTop: 0,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  image: {
    width: 'auto',
    height: 160,
  },
  newsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    lineHeight: 22,
  },
  newsDesc: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 22,
  },
  link: {
    color: 'blue',
    marginVertical: 9,
    textDecorationLine: 'underline',
  },
  forecast_nodatatext: {
    textAlign: 'center',
    marginTop: 12,
    fontWeight: 500,
  },
  nodatatext: {
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 500,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  //   settings styles
  settingsContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryHeading: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  switchlabel: {
    fontSize: 16,
  },
  categoryItem: {
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginVertical: 6,
  },
  categorySelected: {
    backgroundColor: '#6347EB',
  },
});

export default styles;
