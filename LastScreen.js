// DetailsScreen.js
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';



const LastScreen = ({ route, navigation }) => {
  const [textColor, setTextColor] = useState('white');
  const { item, userData } = route.params;

  const handlePressIn = () => {
    setTextColor('blue');
    
  };

  const handlePressOut = () => {
    setTextColor('white');
    
  };

  const apiResponse = {
    timestamp: item.irsaliye_tarihi
  };
  
  // Tarih ve saat bilgisini alın
  const dateTimeString = apiResponse.timestamp;
  
  // Date nesnesi oluşturun
  const dateObject = new Date(dateTimeString);
  // Türkiye tarih formatı
   const options = { year: 'numeric', month: '2-digit', day: '2-digit', locale: 'tr-TR' };
  // Tarih ve saati ayırın
  const datePart = dateObject.toLocaleDateString('tr-TR', options); // "2024-10-01"
  const timePart = dateObject.toLocaleTimeString(); // "14:30:00" (yerel saat dilimine göre)

  return (
    <SafeAreaView style={siparisDetail.container}>
     <View style={head.container}>
     <Image resizeMode='center'
       source={require('./images/water-icon64.png')}
       style={{bottom:15}}
      
       />
     <Text style={{color:'black', fontWeight:'bold', textAlign:'center',top:5}} allowFontScaling={false}>Sipariş Detayı</Text>
     </View>

     
     
      <Text style={{color:'black', fontWeight:'bold', textAlign:'center', fontSize:20, bottom:10, top:80}} allowFontScaling={false}>Sipariş Detay</Text>
      <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between', top:150}}>
        <Text style={{color:'gray', flex:1}} allowFontScaling={false}>İrsaliye No</Text>
        <Text style={{color:'black', flex:1}} allowFontScaling={false}>{item.irsaliye_no}</Text>
      </View>
      <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between', top:160}}>
        <Text style={{color:'gray', flex:1}} allowFontScaling={false}>İrsaliye Tarihi</Text>
        <Text style={{color:'black', flex:1}} allowFontScaling={false}>{datePart}</Text>
      </View>
      <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between', top:170}}>
        <Text style={{color:'gray', flex:1}} allowFontScaling={false}>Gönderici Firma</Text>
        <Text style={{color:'black', fontSize:12, flex:1}} allowFontScaling={false}>{item.gonderici_firma_unvan}</Text>
      </View>
      <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between' , top:180}}>
        <Text style={{color:'gray', flex:1}} allowFontScaling={false}>Alıcı Firma</Text>
        <Text style={{color:'black', fontSize:12, flex:1}} allowFontScaling={false}>{item.alici_firma_unvan}</Text>
      </View>

      <TouchableHighlight style={Form.button}
         onPressIn={handlePressIn}
         onPressOut={handlePressOut}
         underlayColor="white"
         onPress={() => navigation.navigate('Home',{userData})}
         >
      <Text style={[Form.buttonText, {color:textColor}]} allowFontScaling={false}>SİPARİŞİ SONLANDIR</Text>
      </TouchableHighlight>
     
    </SafeAreaView>
  );
};



const Form = StyleSheet.create({

  
    button: {
      width: '80%',
      height: 40,
      backgroundColor:'#e30d4f',
      borderWidth:3,
      borderColor:'#e30d4f',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginBottom: 20,
      marginTop:300,
    },
    buttonText: {
      underlayColor:'blue',
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    
    
  });

const siparisDetail=StyleSheet.create({

   container:{
    flex:1,
    backgroundColor:'white',
    alignItems:'center',
    flexDirection:'column',
   },
});

const head = StyleSheet.create({
   container:{
    flexDirection:'row',
    width:'80%',
    height:'5%',
    borderWidth:0.5,
    borderColor:'gray',
    top:20,
    borderRadius:5,
    alignItems:'flex-start',
   },
});

const Camera = StyleSheet.create({
  container:{
   flexDirection:'column',
   width:'80%',
   height:'50%',
   top:20,
   alignItems:'center',
   justifyContent:'center',
  },
});
export default LastScreen;