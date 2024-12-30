// ProfileScreen.js
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';




const ProfileScreen = ({route,navigation}) => {
    const {userData} = route.params;
    const [textColor, setTextColor] = useState('white');
    const handlePressIn = () => {
        setTextColor('blue');
        
      };
    
      const handlePressOut = () => {
        setTextColor('white');
        
      };
  
    return (
    <SafeAreaView style={general.contanier}>
    <Text style={{color:'black', fontSize:25, fontWeight:700, marginTop:50}} allowFontScaling={false}>{userData.name}{' '}{userData.lastname}</Text>
    <View style={isimSoyisim.contanier}>
      <Image resizeMode='center'
         source={require('./images/user-icon.png')}
         style={{width:30, height:30, top:50}}/>
      <Text style={{color:'black', fontSize:15, fontWeight:'bold', textAlign:'center', top:55, left:10}} allowFontScaling={false}>{userData.name}{' '}{userData.lastname}</Text>   
    </View>
    <View style={plaka.contanier}>
      <Image resizeMode='center'
         source={require('./images/credit-card-icon.png')}
         style={{width:30, height:30, top:50}}/>
      <Text style={{color:'black', fontSize:15, fontWeight:'bold', textAlign:'center', top:55, left:10}} allowFontScaling={false}>{userData.plaka_no}</Text>   
    </View>
    <View style={phone.contanier}>
      <Image resizeMode='center'
         source={require('./images/phone-icon.png')}
         style={{width:30, height:30, top:50}}/>
      <Text style={{color:'black', fontSize:15, fontWeight:'bold', textAlign:'center', top:55, left:10}} allowFontScaling={false}>{userData.phone}</Text>   
    </View>
    <TouchableHighlight style={Form.button}
         onPressIn={handlePressIn}
         onPressOut={handlePressOut}
         underlayColor="white"
         onPress={()=> navigation.navigate('GİRİŞ')}
         >
        <Text style={[Form.buttonText, {color:textColor}]} allowFontScaling={false}>ÇIKIŞ YAP</Text>
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
      marginTop:20,
    },
    buttonText: {
      underlayColor:'blue',
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    
  });

const general = StyleSheet.create({
    contanier:{
      flex:1,
      alignItems:'center',
      flexDirection:'column',
      backgroundColor:'white',
      
    },
});


const isimSoyisim = StyleSheet.create({
    contanier:{
      width:'80%',
      borderBottomWidth:1,
      borderColor:'#ccc',
      height:'13%',
      alignItems:'flex-start',
      flexDirection:'row',
     },
});


const plaka = StyleSheet.create({
    contanier:{
      width:'80%',
      borderBottomWidth:1,
      borderColor:'#ccc',
      height:'13%',
      alignItems:'flex-start',
      flexDirection:'row',
     },
});


const phone = StyleSheet.create({
    contanier:{
      width:'80%',
      borderBottomWidth:1,
      borderColor:'#ccc',
      height:'13%',
      alignItems:'flex-start',
      flexDirection:'row',
     },
});

export default ProfileScreen;