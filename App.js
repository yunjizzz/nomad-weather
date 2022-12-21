import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
import { Fontisto } from '@expo/vector-icons'; 

const { width: SCREEN_WIDTH} = Dimensions.get("window");
const icons ={
  Cloud : 'cloudy',
};

export default function App() {
  const [region, setRegion] = useState("Loading...");
  const [street, setStreet] = useState("");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);




  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted ){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5})
    const location = await Location.reverseGeocodeAsync({latitude, longitude},{useGoogleMaps:false})

    setRegion(location[0].region);
    setStreet(location[0].street);
    const serviceKey = '%2BtU3NTBMO1xMqKtue%2FGBgseEvMLRt7ZbPULRcUJ3Cb19%2FJ3VN7cSkWgVNb0ps8VBGHxHz6F6FIdZiDVvC%2BVkWg%3D%3D';
    const baseDate = '20221221'
    const baseTime = '0500';
    const nx = 55//Math.floor(latitude);
    const ny = 127//Math.floor(longitude);  
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'; /*URL*/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+serviceKey; /*Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /**/
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /**/
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent('20221221'); /**/
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('0500'); /**/
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('55'); /**/
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('127'); /**/

    const json = await fetch(url + queryParams).then((response) => response.json()).catch((e) => e);

    setDays(json.response.body.items.item);

  }
 
  useEffect(()=>{
    getWeather();
  },[])

  return (
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{region}</Text>
          <Text style={styles.streetName}>{street}</Text>
        </View>
        <ScrollView 
          pagingEnabled 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weather}>
            {days.length === 0? 
              (<View style={styles.day}>
                <ActivityIndicator color='white' style={{marginTop: 10}}/> 
              </View>)
              :
              (
              days.map((day, index) => {
                if(day.category === 'TMP'){
                 return(
                  <View key={index} style={styles.day}>
                    <View style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between"
                    }}>
                      <Text style={styles.temp}>{day.fcstValue}</Text>
                      <Fontisto name={icons.Cloud} size={68} color="white" />
                    </View>
                    <Text style={styles.description}>{day.fcstTime}</Text>
                    <Text style={styles.description}>{day.fcstDate}</Text>
                  </View>
                  )
                }
              })
              )
            }
        </ScrollView>
      </View>
  );
}
const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor:"tomato"
  }
  ,
  city: {
    marginTop: 50,
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white",
  },
  streetName: {
    fontSize: 50,
    fontWeight: "500",
    color: "white",
  },
  weather: {
  },
  day:{
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  temp:{
    fontSize:168,
    marginTop: 50,
    color: "white",
  },
  description: {
    fontSize:30,
    color: "white",
  }
  
})