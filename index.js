/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import './HeadlessTask'; // Import the headless task

AppRegistry.registerComponent(appName, () => App);
