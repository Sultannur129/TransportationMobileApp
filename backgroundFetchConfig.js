import BackgroundFetch from 'react-native-background-fetch';

BackgroundFetch.configure({
  minimumFetchInterval: 15, // minutes
  stopOnTerminate: false,
  startOnBoot: true,
  enableHeadless: true,
  requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
}, async (taskId) => {
  console.log('[BackgroundFetch] taskId:', taskId);
  // Perform your task here, e.g., sync data with server
  BackgroundFetch.finish(taskId);
}, (error) => {
  console.error('[BackgroundFetch] failed to start:', error);
});