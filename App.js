import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  /* State para monitorar dados da atualização atual do usuário.
     Inicialmente, nulo. */
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);

  useEffect(() => {
    async function obterLocalizacao() {
      /* Acessando o status da requisição de permissão de uso dos recursos de geolocalização. */
      const { status } = await Location.requestForegroundPermissionsAsync();

      /* Se o status NÃO FOR liberado/permitido, então será dado um alerta notificando o usuário. */
      if (status !== "granted") {
        Alert.alert("Ops! Você não autorizou o uso de geolocalização.");
        return;
      }

      /* Se o status estiver OK, obtemos os dados da localização atual. E atualizamos o state de 'minhaLocalizacao'. */
      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setMinhaLocalizacao(localizacaoAtual);
    }
    obterLocalizacao();
  }, []);

  console.log(minhaLocalizacao);

  /*  Este state tem a finaliade de determinar a posição/localização no MapView junto com o Marker. Inicialmente, é nulo, pois o usuáriio ainda não acionou o botão da sua localização. */
  const [localizacao, setLocalizacao] = useState(null);

  /* Coordenadas para o MapView */
  const regiaoInicialMapa = {
    latitude: -23.533773,
    longitude: -46.65529,
    latitudeDelta: 40,
    longitudeDelta: 40,
  };

  const marcarLocal = () => {
    setLocalizacao({
      /* Obtendo novos valores a partir da geolocalização da posição do usuário
        Aqui é necessário acessar a propriedade 'coords' do state 'minhaLocalizacao'. Os valores desta propriedade correspondem ao que o Location conseguiu obter à partir do GPS do aparelho */
      latitude: minhaLocalizacao.coords.latitude,
      longitude: minhaLocalizacao.coords.longitude,

      /* Aqui usamos deltas bem baixos para poder aproximar bastante a visualização do mapa e do marker. */
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    });
  };

  return (
    <>
      <StatusBar />
      <View style={estilos.container}>
        <View style={estilos.viewBotao}>
          <Button title="Onde estou?" onPress={marcarLocal} />
        </View>
        <View style={estilos.viewMapa}>
          <MapView
            mapType="standard"
            style={estilos.mapa}
            region={localizacao ?? regiaoInicialMapa}
          >
            {localizacao && <Marker coordinate={localizacao} />}
          </MapView>
        </View>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapa: { width: "100%", height: "100%" },
});
