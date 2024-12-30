import { useNavigation } from '@react-navigation/native';
import FormData from 'form-data';
import React, { useState } from 'react';
import { Alert, Animated, Dimensions, Image, PanResponder, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const PreviewScreen = ({ route }) => {
  const navigation = useNavigation(); // navigation objesini al
  const { filePath , item , userData} = route.params;
  const [scale] = useState(new Animated.Value(1));
  const [position] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [visible, setVisible] = useState(false);
  const image = `file://${filePath}`;
  const screenWidth = Dimensions.get('window').width; // Ekran genişliği
  const [textColor, setTextColor] = useState('white');
  const [textColor1, setTextColor1] = useState('white');
  
  const logFormData = (formData) => {
    const data = {}; // Create an object to store form data
    for (let pair of formData._parts) {
      data[pair[0]] = pair[1]; // Store key-value pairs
    }
    console.log('FormData contents:', data);
  };
  
  
  const uploadImage = async (imagePat, postsId) => {
    
    console.log("Preview ekranında kullanılan dosya yolu:",image);
    console.log("Upload için kullanılan dosya yolu:", imagePat);
    
    
    const formData = new FormData();
    
    // Append posts_id
    formData.append('posts_id', postsId); // Example: [1, 2]

    
    const fileName = imagePat.split('/').pop();
    // Append the document (image)
    formData.append('document', {
      uri: Platform.OS === 'android' ? imagePat : imagePat.replace('file://', ''), // Path to the image file
      name: fileName, // File name (can be any name)
      type: 'image/jpeg', // File type (adjust as necessary)
    });
    console.log("Form content:",formData);
    
  
    try {
      
      const response = await fetch('https://nevsoft.net/admin/api/pratik/deliveredDocument', {
        method: 'POST',
        body: formData,
        headers: {
          //'Accept': 'application/json',
          //'User-Agent': 'ulastirmapratik/1.0',
          //'Accept-Encoding': 'gzip, deflate, br', // Sıkıştırma yöntemlerini belirtin
        },
      });

      const responseData = await response.json();
      console.log("Sunucu yanıtı:", responseData);
      if(responseData.sonuc==1){
        Alert.alert('BAŞARILI','Teslim Belgesi başarıyla yüklendi. ')
      }
     
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleNavigate = () => {
    // Veriyi gönder
    navigation.navigate('Last', {item, userData});

    // Ek işlem yap (örneğin, bir fonksiyonu çağır)
    uploadImage(image, item.id);
  };
 
  const handlePressIn = () => {
    setTextColor('blue');
    
  };

  const handlePressOut = () => {
    setTextColor('white');
    
  };

  const handlePressIn1 = () => {
    setTextColor1('blue');
    
  };

  const handlePressOut1 = () => {
    setTextColor1('white');
    
  };

 

  const panResponder1 = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return true;
    },
    onPanResponderMove: (evt, gestureState) => {

      
      
      if (scale._value > 1) {
        position.setValue({
          
          x: gestureState.dx,
          y: gestureState.dy,
        });
      }
      

      const newScale = Math.max(1, scale._value + gestureState.dy / 300); // Aşağı sürükleme ile küçült
      scale.setValue(newScale);
    },
    onPanResponderRelease: () => {

      //resetImage();
      /*Animated.spring(scale, {
        toValue: 1, // Kapatıldığında ölçeği sıfırlama
        useNativeDriver: true,
      }).start();*/
    },
  });

  const handlePress = () => {
    setVisible(true);
    Animated.spring(scale, {
      toValue: visible ? 1 : 4, // 2 kat büyütme
      friction: 5,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  //()=> navigation.navigate('Camera',{item})

  return (
    <SafeAreaView style={styles.container}>
      { image && (<Animated.View style={{ width: screenWidth, // Ekran genişliğine göre ayarla
            height: screenWidth, // Yüksekliği de genişlik kadar yap
            overflow: 'hidden', // Taşmaları gizle
            transform: [{ translateX: position.x },
            { translateY: position.y },
            { scale: scale },] }} {...panResponder1.panHandlers}>
        <Image
          source={{ uri: image }} // Taradığınız resmin URI'si
          style={[styles.image2,
            {width: screenWidth, // Resmi ekran genişliği kadar ayarlama
            height: undefined, // Yüksekliği otomatik ayarla
            aspectRatio: 1, // Resmin oranını koru
            }]}
        />
      </Animated.View>)}
      
     <View style={{flexDirection:'row', alignItems:'center'}}>
     <TouchableHighlight style={[Form.button, { marginRight: 10 }]}
         onPressIn={handlePressIn}
         onPressOut={handlePressOut}
         underlayColor="white"
         onPress={()=>navigation.navigate('Details',{item,userData})}
         >
      <Text style={[Form.buttonText, {color:textColor}]} allowFontScaling={false}>TEKRAR ÇEK</Text>
      </TouchableHighlight>
      <TouchableHighlight style={[Form.button, { marginLeft: 10 }]}
         onPressIn={handlePressIn1}
         onPressOut={handlePressOut1}
         underlayColor="white"
         onPress={handleNavigate}
         >
      <Text style={[Form.buttonText, {color:textColor1}]} allowFontScaling={false}>YÜKLE</Text>
      </TouchableHighlight>
      </View> 
     
    </SafeAreaView>
  );
};



/* {imagePath && (
        <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Image
            source={{ uri: `file://${imagePath}` }} // Taradığınız resmin URI'si
            style={styles.image1}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      )}*/

/* {imagePath && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.imageContainer,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { scale: scale },
              ],
            },
          ]}
        >
          <Image
            source={{ uri: `file://${imagePath}` }}
            style={styles.image}
          />
        </Animated.View>
      )}
 */

const Form = StyleSheet.create({

        button: {
          width: '40%',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'white',
  },
  imageContainer: {
    
    position: 'absolute',
    height:'100%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white',
    flex:1,
    
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // Oranı ayarla
    resizeMode: 'contain',
  },
  image1: {
    width: 480,
    height: 480,
    resizeMode: 'contain',
  },
  image2: {
    width: 480,
    height: 480,
    resizeMode: 'contain',
  },
});

export default PreviewScreen;