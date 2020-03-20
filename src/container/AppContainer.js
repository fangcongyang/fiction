/*
 * 文件名: AppContainer.js
 * 作者: liushun
 * 描述: APP 整体框架
 * 修改人:
 * 修改时间:
 * 修改内容:
 * */

import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './Home';
import Mail from './Mail';
import Find from './Find';
import Me from './Me';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ChatView from '../pages/ChatView';
import LoginView from '../pages/LoginView';
import AddFriend from '../pages/AddFriend';
import UserView from '../pages/UserView';
import RegisterView from '../pages/RegisterView';
import UserMoreView from '../pages/UserMoreView';
import SettingView from '../pages/SettingView';
import UserDetail from '../pages/UserDetail';
import SortList from '../pages/fiction/SortList';
import FictionList from '../pages/fiction/FictionList';
import Fiction from '../pages/fiction/Fiction';
import ChapterList from '../pages/fiction/ChapterList';
import ReaderPage from '../pages/fiction/ReaderPage';
import {View} from 'react-native';
import MailBottom from '../components/MailBottom';
import HomeBottom from '../components/HomeBottom';
import FriendList from '../pages/FriendList';
import PublishView from '../pages/PublishView';
import ChangeName from '../pages/ChangeName';

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: '微信',
      tabBarOptions: {
        activeTintColor: 'rgb(66, 122, 184)',
        inactiveTintColor: 'black',
      },
      tabBarIcon: ({focused}) => {
        return (
          <View>
            <HomeBottom focused={focused} />
          </View>
        );
      },
    },
  },
  Mail: {
    screen: Mail,
    navigationOptions: {
      tabBarLabel: '通讯录',
      tabBarOptions: {
        activeTintColor: 'rgb(66, 122, 184)',
        inactiveTintColor: 'black',
      },
      tabBarIcon: ({focused}) => {
        return (
          <View>
            <MailBottom focused={focused} />
          </View>
        );
      },
    },
  },
  Find: {
    screen: Find,
    navigationOptions: {
      tabBarLabel: '发现',
      tabBarOptions: {
        activeTintColor: 'rgb(66, 122, 184)',
        inactiveTintColor: 'black',
      },
      tabBarIcon: ({focused}) => {
        return (
          <AntDesign
            name={'find'}
            color={focused ? 'rgb(66, 122, 184)' : 'black'}
            size={20}
          />
        );
      },
    },
  },
  Me: {
    screen: Me,
    navigationOptions: {
      tabBarLabel: '我',
      tabBarOptions: {
        activeTintColor: 'rgb(66, 122, 184)',
        inactiveTintColor: 'black',
      },
      tabBarIcon: ({focused}) => {
        return (
          <FontAwesome
            name={'user'}
            color={focused ? 'rgb(66, 122, 184)' : 'black'}
            size={20}
          />
        );
      },
    },
  },
});

// App 主页面
const MainNavigator = createStackNavigator(
  {
    TabNavigator: {
      screen: TabNavigator,
      navigationOptions: {
        headerShown: false,
      },
    },
    ChatView: {
      screen: ChatView,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddFriend: {
      screen: AddFriend,
      navigationOptions: {
        headerShown: false,
      },
    },
    UserView: {
      screen: UserView,
      navigationOptions: {
        headerShown: false,
      },
    },
    UserMoreView: {
      screen: UserMoreView,
      navigationOptions: {
        headerShown: false,
      },
    },
    SettingView: {
      screen: SettingView,
      navigationOptions: {
        headerShown: false,
      },
    },
    UserDetail: {
      screen: UserDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    FriendList: {
      screen: FriendList,
      navigationOptions: {
        headerShown: false,
      },
    },
    PublishView: {
      screen: PublishView,
      navigationOptions: {
        headerShown: false,
      },
    },
    ChangeName: {
      screen: ChangeName,
      navigationOptions: {
        headerShown: false,
      },
    },
    FictionList: {
      screen: FictionList,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'TabNavigator',
  },
);

// 小说主页面
const FictionNavigator = createStackNavigator(
  {
    SortList: {
      screen: SortList,
      navigationOptions: {
        headerShown: false,
      },
    },
    FictionList: {
      screen: FictionList,
      navigationOptions: {
        headerShown: false,
      },
    },
    Fiction: {
      screen: Fiction,
      navigationOptions: {
        headerShown: false,
      },
    },
    ChapterList: {
      screen: ChapterList,
      navigationOptions: {
        headerShown: false,
      },
    },
    ReaderPage: {
      screen: ReaderPage,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'SortList',
  },
);

//使用 createSwitchNavigator 创建分组导航
const RootNavigator = createSwitchNavigator(
  {
    Main: MainNavigator,
    Fiction: FictionNavigator,
    LoginView: LoginView,
    RegisterView: RegisterView,
  },
  {
    navigationOptions: {
      headerShown: false,
    },
    initialRouteName: 'Main',
  },
);

export default createAppContainer(RootNavigator);
