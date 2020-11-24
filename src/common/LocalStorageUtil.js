import AsyncStorage from '@react-native-community/async-storage';
export default class LocalStorageUtil {
  static readStorage(key){
    return AsyncStorage.getItem(key).then((value) => {
      if (value && value != '') {
          return value;
      } else {
          return null
      }
    }).catch(() => {
        return null
    });
  }
  static getItem = async key => {
    try {
      if (!key) {
        return {};
      }
      key = key.toString();
      const value = await AsyncStorage.getItem(key);
      if (value != null) {
        let obj = JSON.parse(value);
        return obj.data;
      }
      return {};
    } catch (e) {
      return {};
    }
  };
  static setItem = async (key, value) => {
    try {
      if (!key) {
        return;
      }
      key = key.toString();
      const result = await AsyncStorage.setItem(
        key,
        JSON.stringify({
          data: value,
        }),
      );
      console.log('save result', result);
    } catch (error) {
      console.log(error);
    }
  };

}
