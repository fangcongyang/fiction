import {AsyncStorage} from '@react-native-community/async-storage';
export default {
  constructor() {},
  get(key) {
    try {
      if (!key) {
        return {};
      }
      key = key.toString();
      const value = AsyncStorage.getItem(key);
      if (value != null) {
        let obj = JSON.parse(value);
        return obj.data;
      }
      return {};
    } catch (e) {
      return {};
    }
  },
  set(key, value) {
    try {
      if (!key) {
        return;
      }
      key = key.toString();
      AsyncStorage.setItem(
        key,
        JSON.stringify({
          data: value,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  },
};
