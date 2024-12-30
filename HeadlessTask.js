import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGeolocation from 'react-native-background-geolocation';

const headlessTask = async (event) => {
    const { event: eventType, params } = event || {};
    console.log("Headless Taske girdi");
    if (!eventType || !params) {
      console.warn('Beklenmeyen event yapısı:', event);
      return; // Event yapısı beklenmeyen ise işlemi durdur
  }
    if (eventType === 'location') {
        const location = params;
        console.log('[HEADLESS TASK] - Location: ', location);

        // SoforId'yi yerel depolamadan al
        const SoforId = await AsyncStorage.getItem('SoforId');
        if (SoforId) {
            try {
                const data = await fetchData(SoforId);
                console.log('Headless Task Güncellenmiş data:', data);
        
                if (data.length > 0) {
                  const ids = data.map(post => post.id);
                  console.log(" Headless Task Güncellenmiş Post ids", ids);
                  await sendLocationToAPI(location, ids);
                  console.log('Headless Task Konum:', location);
                } else {
                  console.warn('Data boş, gönderim yapılmadı.');
                }
              } catch (error) {
                console.error('API çağrısı sırasında hata:', error);
              }
        } else {
            console.warn('SoforId bulunamadı.');
        }
    }
    else{
      console.warn('Beklenmeyen event tipi:', eventType);
    }
};

BackgroundGeolocation.registerHeadlessTask(headlessTask);

/*if (!BackgroundGeolocation.isHeadlessTaskRegistered) {
    
    BackgroundGeolocation.isHeadlessTaskRegistered = true; // Kayıtlı flag'ı ayarlayın
}*/