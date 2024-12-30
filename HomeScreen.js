
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, PermissionsAndroid, Platform, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import BackgroundGeolocation from 'react-native-background-geolocation';
import Geolocation from 'react-native-geolocation-service';

const HomeScreen = ({route, navigation}) => {
  
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );
  
  const { userData } = route.params;
  const id = userData.id; // Değişkeni const ile tanımlayın
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postIds, setPostIds] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [highlightedId, setHighlightedId] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fetchData = async () => {
    //console.log('Fetch data çalıştı');
    try {
      const response = await axios.post('https://nevsoft.net/admin/api/pratik/posts', {
        sofor_id: id,
      });

      if (response.data.sonuc === 1) {
        //console.log('API Yanıtı:', response.data.posts); // Kontrol için
        setData(response.data.posts);
        
        
      }
      else {
        console.warn('Başarısız yanıt:', response.data); // Başarısız yanıt durumu
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const startBackgroundTracking = async () => {
    const permissionGranted = await requestLocationPermission();
    if (permissionGranted) {
      BackgroundGeolocation.ready({
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 0.1, // 5 metre
        stopOnTerminate: false,
        startOnBoot: true,
        debug: true,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      }, (state) => {
        if (!state.enabled) {
          BackgroundGeolocation.start(() => {
            console.log('[INFO] BackgroundGeolocation started successfully');
          });
        }
      });

      BackgroundGeolocation.onLocation(async (location) => {
        await fetchData();
        
        if (data.length > 0) {
          const ids = data.map(post => post.id);
          console.log("Güncellenmiş Post ids", ids);
          await sendLocationToAPI(location, ids);
          console.log('Konum:', location);
        } else {
          console.warn('Data boş, gönderim yapılmadı.');
        }
      }, (error) => {
        console.error('[ERROR] Location error:', error);
      });
    }
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

  

  const startTrackingLocation = async () => {
    
    if (isTracking) return; // Eğer zaten izleme devam ediyorsa, çık.

    const permissionGranted = await requestLocationPermission();
    if (permissionGranted) {
      setIsTracking(true); // İzlemeye başladığını belirt
      Geolocation.watchPosition(
        async(position) => {
          
         
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
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5,//5 metre
          interval: 60000, // 1 dakikada bir güncelle
          fastestInterval: 2000, // 2 saniyede bir en hızlı güncelle
        }
      );
    }
  };

  const ItemComponent = React.memo(({ item, highlightedId, onPressIn, onPressOut }) => (
    <TouchableOpacity 
        style={item1.container}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => navigation.navigate('Details', { item, userData})}
        activeOpacity={0.9}>  

        <View style={irsaliye.itemContainer}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}} allowFontScaling={false}>
                İrsaliye No
            </Text>
            <Text style={{color: highlightedId === item.id ? 'blue' : 'black'}} allowFontScaling={false}>
                {item.irsaliye_no}
            </Text> 
        </View>
        <View style={yükle.itemContainer}>
            <Image source={require('./images/camera1.png')} style={{color:'black'}} />
            <Text style={{color: highlightedId === item.id ? 'blue' : 'black', borderBottomWidth: 1, borderColor: 'black', fontSize: 13, textAlign: 'center'}} allowFontScaling={false}>
                İrsaliye Yükle
            </Text> 
        </View>
    </TouchableOpacity>
));

const renderItem = useCallback(({ item }) => (
    <ItemComponent 
        item={item} 
        highlightedId={highlightedId}
        onPressIn={() => setHighlightedId(item.id)} 
        onPressOut={() => setHighlightedId(null)} 
    />
), [highlightedId]);


  useEffect(() => {
   
    const initializeData = async () => {
      await fetchData(); // İlk Veriyi Yükle
      
  };

  initializeData();
    
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const ids = data.map(post => post.id);
      setPostIds(ids);
      console.log("Post ids", ids);
      //startTrackingLocation();
      //startBackgroundTracking(); // Arka plan takibini başlat
      
    }
}, [data]); // data değiştiğinde çalışır
 
const onRefresh = () => {
  setRefreshing(true);
  // Verileri güncelleme simülasyonu
  setTimeout(() => {
    fetchData();
    setRefreshing(false);
  }, 2000);
};


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

    return (
        
        <SafeAreaView style={styles.container}>
            
            <View style={imageStyle.container}>
                <Image
                    style={imageStyle.image}
                    resizeMode='center'
                    source={require('./images/footerlogoo.png')}
                />
            </View>
            <View style={txt.container}>
              <Text style={txt.text1} allowFontScaling={false}>{userData.name}{' '}{userData.lastname}</Text>
              <Text style={txt.text2} allowFontScaling={false}>{userData.plaka_no}</Text>
            </View>
            <Text style={{color:'black', fontSize:16, marginRight:200, backgroundColor:'white',padding:5}} allowFontScaling={false}>Tüm Siparişler</Text> 
            
            <View style={siparis.container}>
               
               <FlatList
                 data={data}
                 keyExtractor={(item) => item.id.toString()} // item.id'yi kendi veri yapınıza göre ayarlayın
                 //renderItem={renderItem}
                 renderItem={({ item }) => (
                <TouchableOpacity style={item1.container} onPress={() => navigation.navigate('Details', { item, userData})}
                   activeOpacity={0.9}
                   onPressIn={() => setHighlightedId(item.id)} // Dokunulduğunda vurgulanan öğeyi ayarla
                   onPressOut={() => setHighlightedId(null)}>  
                
                <View style={irsaliye.itemContainer}>
                   <Text style={{color:'black', fontWeight:'bold', fontSize:15}} allowFontScaling={false}>İrsaliye No</Text>
                   
                    <Text  style={{color: highlightedId === item.id ? 'blue' : 'black',}} allowFontScaling={false}>{item.irsaliye_no}</Text> 
                    
                </View>
                <View style={yükle.itemContainer}>
                   <Image source={require('./images/camera1.png') } styles={{color:'black'}}/>
                   
                   <Text  style={{color: highlightedId === item.id ? 'blue' : 'black', borderBottomWidth:1,borderColor:'black', fontSize:13,textAlign:'center'}} allowFontScaling={false}>İrsaliye Yükle</Text> 
                   
                </View>
              
              </TouchableOpacity>
              )}
              initialNumToRender={5}
              windowSize={2}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={<Text style={{color:'black'}} allowFontScaling={false}>No data available</Text>}
             />

            </View>
            <View style={footer.container}>
              <View style={homeIcon.container}
              onPress={() => {
                setActiveTab('home'); // Anasayfaya tıklandığında aktif sekmeyi güncelle
                 }}>
              
              <Image resizeMode='center'
                    source={require('./images/home-iconn.png')}
                    style={{borderRadius:17,bottom:5,top:1.5, width:50, height:50, backgroundColor: activeTab === 'home' ? 'white' : 'white' }}/>
              <Text style={{color:'black', fontSize:10, bottom:15, textAlign:'center', fontWeight:'bold',padding:2}} allowFontScaling={false}>Anasayfa</Text>
              
              </View>
              <TouchableOpacity
                 onPress={() => navigation.navigate('Profile',{userData:userData})}
                 style={profileIcon.container}>
              
              <Image resizeMode='center'
                    source={require('./images/profile-iconn.png')}
                    style={{bottom:5, top:1.5, width:50, height:50, backgroundColor: activeTab === 'profile' ? '#e0f7fa' : 'white'}}/>
              <Text style={{color:'black', fontSize:10, bottom:15, textAlign:'center', fontWeight:'bold',padding:2}} allowFontScaling={false}>Profil</Text>
              
              </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    );
};

//#e0f7fa

const profileIcon = StyleSheet.create({
  container:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Eşit alan kaplamak için flex kullanın
    height: '100%', // Footer yüksekliğine göre ayarlayın
    top:4,
    //flexDirection:'column',
    //left:100,
    //top:5,
    //justifyContent:'center',
    //alignItems:'center',
    //height:14,
  }
});

const homeIcon = StyleSheet.create({
    container:{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1, // Eşit alan kaplamak için flex kullanın
      height: '100%', // Footer yüksekliğine göre ayarlayın
      top:4,
      marginRight:100,
      /*flexDirection:'column',
      right:100,
      top:5,
      justifyContent:'center',
      alignItems:'center',
      height:12,*/
    }
});

const footer = StyleSheet.create({
     
  container:{
      flex:0.15,
      flexDirection:'row',
      borderWidth:1,
      borderColor:'gray',
      borderRadius:5,
      width:'95%',
      alignItems:'center',
      //justifyContent:'center',
      justifyContent: 'space-between', // İkonları eşit aralıklara yerleştirin
      
  },
});

const item1 = StyleSheet.create({

  container:{
    flexDirection:'row',
    padding:8
  },
});


const yükle = StyleSheet.create({

    itemContainer:{
         flexDirection:'column',
         right:100,
         alignItems:'center',
         top:13,
         
         
    },
});
const irsaliye= StyleSheet.create({
  itemContainer: {
    flexDirection:'column',
    padding: 5,
    marginVertical: 5,
    borderBottomWidth:1,
    borderColor:'gray',
    width:325,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

const siparis = StyleSheet.create({
    container:{
     flex:1,
     flexDirection:'column',
     alignItems:'flex-start',
     justifyContent:'flex-start',
     width:'95%',
    },
});

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems:'center',
      
    },
    text: {
      fontSize: 18,
  },
  
  });

 const txt = StyleSheet.create({
    container:{
        flex:0.1,
        flexDirection:'row',
        alignItems:'center',
        padding:5,
    },
    text1: {
        marginRight: 50, // İsteğe bağlı: metinler arasında boşluk
        color:'black',
        fontSize:15,
        fontWeight:'bold',
    },
    text2: {
        marginLeft: 50, // İsteğe bağlı: metinler arasında boşluk
        color:'black',
        fontSize:15,
        fontWeight:'bold',
    },
 });

  const imageStyle = StyleSheet.create({

  

    container: {
      backgroundColor:'#ed1c24',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 40,
      position: 'center',
      width:'80%',
      height:'20%',
      
     
    },
    image: {
      width: 250, // Set your desired width here
      height: 250, // Set your desired height here
    },
    
  
  });




export default HomeScreen;
