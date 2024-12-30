import BackgroundGeolocation from 'react-native-background-geolocation';

BackgroundGeolocation.onLocation((location) => {
  console.log('[INFO] Location:', location);
}, (error) => {
  console.error('[ERROR] Location error:', error);
});

BackgroundGeolocation.onMotionChange((event) => {
  console.log('[INFO] Motion change:', event);
});

BackgroundGeolocation.ready({
  reset: true,
  debug: true,
  logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  distanceFilter: 10,
  stopOnTerminate: false,
  startOnBoot: true,
  // Additional configuration options here
}, (state) => {
  if (!state.enabled) {
    BackgroundGeolocation.start(function() {
      console.log('[INFO] BackgroundGeolocation started successfully');
    });
  }
});