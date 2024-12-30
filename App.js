/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
//import CameraScreen from './CameraScreen';
import axios from 'axios';
import RNFS from 'react-native-fs';
//import Geolocation from 'react-native-geolocation-service';
//import BackgroundFetch from 'react-native-background-fetch';
import BackgroundGeolocation from 'react-native-background-geolocation';
//import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
//import BackgroundGeolocation from 'cordova-background-geolocation-plugin';
//import { ForegroundService } from 'react-native-foreground-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import DetailsScreen from './DetailsScreen'; //Sipariş Detay Sayfası
//import './HeadlessTask'; // Import the headless task
import HomeScreen from './HomeScreen'; // Ana ekran
import LastScreen from './LastScreen'; // Profil ekranı
import LoginScreen from './LoginScreen'; // Giriş ekranı
import PreviewScreen from './PreviewScreen'; // Doğru yolu kontrol edin
import ProfileScreen from './ProfileScreen'; // Profil ekranı
//import './backgroundFetchConfig';
//import './backgroundGeolocationConfig';
const Stack = createStackNavigator();

const App = () => {
  
  const [SoforId, setSoforId] = useState(null);
  //const [data, setData] = useState([]);
  const [postIds, setPostIds] = useState([]);
  //const { sharedData } = useMyContext();
  const filePath = `${RNFS.DocumentDirectoryPath}/data.json`;
  
  const fetchData = async (id) => {
    console.log(' App.js deki Fetch data çalıştı');
    try {
      const response = await axios.post('https://nevsoft.net/admin/api/pratik/posts', {
        sofor_id: id,
      });

      if (response.data.sonuc === 1) {
        //console.log('API Yanıtı app.js de:', response.data.posts); // Kontrol için
        setSoforId(id);
        //setData(response.data.posts);
        return response.data.posts; // Dönüş ekleniyor
        
        
      }
      else {
        console.warn('Başarısız yanıt:', response.data); // Başarısız yanıt durumu
        return []; // Boş bir dizi döndür
      }
    } catch (error) {
      console.error(error);
      return []; // Hata durumunda boş dizi döndür
    } 
  };


  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Konum İzni",
          message: "Bu uygulama konumunuza erişmek istiyor.",
          buttonNeutral: "Sonra Sor",
          buttonNegative: "İptal",
          buttonPositive: "Tamam",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS için
  };


  const sendLocationToAPI = async (position, ids) => {
    
    if(ids.length==0){
     console.log('PostIds boş');
     return;
    }
     console.log("sendLocationtoapi çalıştı");
     const data = {
       posts_id: ids,
       location: `${position.coords.latitude},${position.coords.longitude}`,
     };
 
     try {
       const response = await axios.post('https://nevsoft.net/admin/api/pratik/updateLocation', data, {
         headers: {
           'Content-Type': 'application/json',
         },
       });
       console.log('Başarıyla gönderildi:', response.data);
     } catch (error) {
       console.error('Gönderim hatası:', error);
     }
   

   
 };




 const distanceFiltere = async () => {
  try {
      const response = await axios.get('https://nevsoft.net/admin/api/pratik/getConfig');
      return response.data.distanceFilter;
  } catch (error) {
      console.error('Error fetching privacy policy:', error);
      return 5;
  }
};

const intervall = async () => {
  try {
      const response = await axios.get('https://nevsoft.net/admin/api/pratik/getConfig');
      return response.data.interval;
  } catch (error) {
      console.error('Error fetching privacy policy:', error);
      return 60000;
  }
};

const Fastestintervall = async () => {
  try {
      const response = await axios.get('https://nevsoft.net/admin/api/pratik/getConfig');
      return response.data.fastestInterval;
  } catch (error) {
      console.error('Error fetching privacy policy:', error);
      return 2000;
  }
};


 /*const startLocationUpdates = async (Sid) => {
  console.log("startLocationUpdates çalıştı");
  
  const distance = await distanceFiltere();
  const intervalle = await intervall();
  const fastestIntervalle = await Fastestintervall();
  // Konum güncellemelerini izleme
  const locationWatcher = Geolocation.watchPosition(
      async (position) => {
        console.log('[GeolocationWatcher] -', position);
        const data = await fetchData(Sid);
        console.log('Güncellenmiş data:', data);
        
        if (data.length > 0) {
          const ids = data.map(post => post.id);
          console.log("Güncellenmiş Post ids", ids);
          await sendLocationToAPI(position, ids);
        } else {
          console.warn('Data boş, gönderim yapılmadı.');
        }
      }, 
      (error) => {
        console.error('[Geolocation] ERROR -', error);
      }, 
      {
        enableHighAccuracy: true,
        distanceFilter: distance, // 10 metreden fazla değişikliklerde konum al
        interval: intervalle, // 10 saniyede bir konum al
        fastestInterval: fastestIntervalle, // 5 saniyede bir en hızlı konum
      }
    );
  

  // BackgroundFetch yapılandırması
  BackgroundFetch.configure({
    minimumInterval: 5, // 5 dakikada bir
    stopOnTerminate: false, // Uygulama kapatıldığında durmasın
    startOnBoot: true, // Cihaz yeniden başlatıldığında başlasın
  }, async (taskId) => {
    console.log("[BackgroundFetch] taskId:", taskId);
     
    //await locationWatcher();
    // Arka planda konum al
    // Arka planda konum al
    const fetchCurrentLocation = async () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          console.log('Arka planda konum:', position);
          const data = await fetchData(Sid);
          console.log('Güncellenmiş data:', data);
          if (data.length > 0) {
            const ids = data.map(post => post.id);
            console.log("Güncellenmiş Post ids", ids);
            await sendLocationToAPI(position, ids);
          }
        },
        (error) => {
          console.error('[Geolocation] ERROR -', error);
        },
        {
          enableHighAccuracy: true,
        }
      );
    };

    await fetchCurrentLocation();

    

    // Görev tamamlandığında
    BackgroundFetch.finish(taskId);
  }, (taskId) => {
    console.warn("[BackgroundFetch] timeout taskId:", taskId);
    BackgroundFetch.finish(taskId);
  });
};*/

const checkLocationServiceStatus = async () => {
  try {
    const isEnabled = await BackgroundGeolocation.getState();
    console.log('Konum servisi durumu:', isEnabled);

    if (!isEnabled) {
      console.warn('Konum servisi kapalı. Lütfen konum servislerini açın.');
      // Burada kullanıcıyı bilgilendirebilir veya ayarlara yönlendirebilirsiniz.
    } else {
      console.log('Konum servisi açık, güncellemeler alınabilir.');
    }
  } catch (error) {
    console.error('Konum servisi durumu kontrolü sırasında hata:', error);
  }
};

  const startLocationUpdates = (Sid) => {
    console.log("startLocationUpdates çalıştı");
     // Background Geolocation ayarlarını hazırla
  BackgroundGeolocation.ready({
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    //stationaryRadius: 10,
    enableHeadless: true,
    distanceFilter: 0,
    locationAuthorizationRequest: 'Always',
    stopOnTerminate: false,
    stopOnStationary:false,
    startOnBoot: true,
    debug: true,
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    foregroundService:true,
    notification:{
      title:"Konum takibi aktif",
      text:"Uygulama konumunuzu arka planda takip ediyor",
      color:"#FF0000",
      priority:BackgroundGeolocation.NOTIFICATION_PRIORITY_HIGH
    },
    locationUpdateInterval: 6000,
    interval: 10000, // 30 saniyede bir konum al
    fastestInterval: 5000, // 15 saniyede bir en hızlı konum al
    activitiesInterval: 10000, // 10 saniyede bir aktivite güncelle
    triggerActivities: "in_vehicle, on_bicycle, on_foot, running, walking", // Aktivite algılama
  }, async (state) => {
    if (!state.enabled) {
      // Eğer Background Geolocation devre dışıysa, başlat
      await BackgroundGeolocation.start();
    }

    await checkLocationServiceStatus();
    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ', status);
      if (status === BackgroundGeolocation.AUTHORIZED) {
          console.log("İzin verildi");
      } else {
          console.warn('Konum izni verilmedi.');
      }
  });
    // Konum dinleyicisini ayarla
    BackgroundGeolocation.on('location', async (location) => {
      console.log('[BackgroundGeolocation] -', location);
      console.log("Sofor Id konum:", Sid);
      if (!location.is_moving) {
        console.log('Cihaz sabit, konum güncellemeleri azalabilir.');
      }
      try {
        const data = await fetchData(Sid);
        console.log('Güncellenmiş data:', data);

        if (data.length > 0) {
          const ids = data.map(post => post.id);
          console.log("Güncellenmiş Post ids", ids);
          await sendLocationToAPI(location, ids);
          console.log('Konum:', location);
        } else {
          console.warn('Data boş, gönderim yapılmadı.');
        }
      } catch (error) {
        console.error('API çağrısı sırasında hata:', error);
      }
    }, (error) => {
      console.error('[BackgroundGeolocation] ERROR -', error);
    });
  });
  };
  
  const checkFileExists = async () => {
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        console.log('Dosya mevcut:', filePath);
        const jsonData = await RNFS.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(jsonData);
        // Dosya varsa, okuma işlemini yapabilirsiniz
          if(parsedData.id){
             setSoforId(parsedData.id);
             
          }
      } else {
        console.log('Dosya mevcut değil:', filePath);
        // Dosya yoksa, yazma işlemi yapabilirsiniz
        
      }
    } catch (error) {
      console.log('Dosya kontrol hatası:', error);
    }
  };

  const setSoforIds = async (id) => {
    try {
      await AsyncStorage.setItem('SoforId', id);
    } catch (error) {
      console.error('AsyncStorage hatası:', error);
    }
  };
  

  useEffect(() => {
    const initializeApp = async () => {
      const permissionGranted = await requestLocationPermission();
      console.log('Permission Granted:', permissionGranted);
      if (permissionGranted) {
        console.log("Sofor Id permission",SoforId);
        if(SoforId){
          setSoforIds(SoforId);
          startLocationUpdates(SoforId);
        }
        
      }
    };
    initializeApp();
  }, [SoforId]);




 /*useEffect(() => {
  const intervalId = setInterval(() => {
    checkFileExists(); // Her 5 saniyede bir dosya kontrolü yap
  }, 5000);

  // Cleanup function
  return () => clearInterval(intervalId);
}, []);*/ // Boş bağımlılık dizisi ile sadece bir kez çalışır

  /*useEffect(() => {
   
    const initializeData = async () => {
      if(id){
        await fetchData(); // İlk Veriyi Yükle
      }
     
      
  };

  initializeData();
    
  }, [id]);


  useEffect(() => {
    if (data.length > 0) {
      const ids = data.map(post => post.id);
      setPostIds(ids);
      console.log("Post ids", ids);
      //startTrackingLocation();
      //startBackgroundTracking(); // Arka plan takibini başlat
      
    }
}, [data]); // data değiştiğinde çalışır*/
  
  /*useEffect(() => {
    // BackgroundFetch yapılandırması
    console.log("Background fetch use effecte girdi.");
    BackgroundFetch.configure({
      minimumFetchInterval: 1, // dakika
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    }, async (taskId) => {
      console.log('[BackgroundFetch] taskId:', taskId);
      // Konum al
     
        console.log("Sofor Id location'a girdi");
        await startLocationUpdates();
      
      
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.error('[BackgroundFetch] failed to start:', error);
    });
  }, []);*/

  


  /*const startLocationUpdates = async () => {
    try {
    console.log("StartLocationUpdates'e girdi");
    const permissionGranted = await requestLocationPermission();
    if (permissionGranted) {
      const watchId = Geolocation.watchPosition(
        async (position) => {
          console.log('Güncellenmiş Konum:', position);
          await fetchData(SoforId); // Verileri güncelle
          if (data.length > 0) {
            const ids = data.map(post => post.id);
            await sendLocationToAPI(position, ids);
            console.log('Konum:', position);
          } else {
            console.warn('Data boş, gönderim yapılmadı.');
          }
        },
        (error) => {
          console.error('Konum hatası:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0.1, // 10 metre değişim olduğunda güncelle
          //interval: 30000, // Her 5 saniyede bir güncelle
          //fastestInterval: 2000, // En hızlı 2 saniyede bir güncelle
        }
      );
  
      // İzlemeyi durdurmak için, gerektiğinde:
      // Geolocation.clearWatch(watchId);
    }
      
    } catch (error) {
      console.error("StartLocationUpdates hatası:", error);
    }
  };*/

  const getLocation = async () => {
    const permissionGranted = await requestLocationPermission();
    if (permissionGranted) {
      Geolocation.getCurrentPosition(
        async(position) => {
          console.log('Konum:', position);
          // Burada konumu bir API'ye gönderebilir veya veritabanına kaydedebilirsiniz
          await fetchData(); // Verileri güncelle
                
          // Güncellenen data'dan post ID'leri al
          if (data.length > 0) {
            const ids = data.map(post => post.id);
            console.log("Güncellenmiş Post ids", ids);
            await sendLocationToAPI(position, ids); // Burada doğrudan IDs'i kullan
            console.log('Konum:', position);
        } else {
            console.warn('Data boş, gönderim yapılmadı.');
        }
        },
        (error) => {
          console.error('Konum hatası:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    }
  };

    return (
      
        <NavigationContainer>
            <Stack.Navigator initialRouteName="GİRİŞ">
                <Stack.Screen name='GİRİŞ' options={{
                        headerLeft: null, // Geri tuşunu kaldır
                        headerTitle: '',
                    }}  >
                      {props => (
                         <LoginScreen 
                           {...props} 
                           checkFileExists={checkFileExists} 
                           fetchData={fetchData}
                           startLocationUpdates={startLocationUpdates} 
                          />
                       )}
                    </Stack.Screen>
                <Stack.Screen name='Home' component={HomeScreen} options={{
                        headerLeft: null, // Geri tuşunu kaldır
                        headerTitle: '',
                    }}  />
                    <Stack.Screen name="Profile" component={ProfileScreen} options={{
                      headerTitle: '',
                    }} />
                    <Stack.Screen name="Details" component={DetailsScreen} options={{
                      headerTitle: 'Sipariş Detay Sayfası',
                      headerTitleAlign: 'center', // Başlık metnini ortalar
                    }} />
                   
                    <Stack.Screen name="Preview" component={PreviewScreen} options={{
                      headerTitle: 'Teslim Belgesi',
                      headerTitleAlign: 'center', // Başlık metnini ortalar
                    }} />
                    <Stack.Screen name="Last" component={LastScreen} options={{
                      headerTitle: 'Sipariş Detay Sayfası',
                      headerLeft: null, // Geri tuşunu kaldır
                      headerTitleAlign: 'center', // Başlık metnini ortalar
                    }} />
                    
            </Stack.Navigator>
        </NavigationContainer>
        
    );

    
};

/*const DataDisplay = () => {
  const { sharedData } = useMyContext();

  useEffect(() => {
    if (sharedData) {
      console.log("App.js'de alınan veri:", sharedData);
    }
  }, [sharedData]);

  return null; // Eğer bir şey göstermek istemiyorsanız null dönebilirsiniz
};*/

/* <Stack.Screen name="Camera" component={CameraScreen} options={{
                      headerTitle: 'İmzalı İrsaliye Yükle',
                      headerTitleAlign: 'center', // Başlık metnini ortalar
                    }} />*/
export default App;