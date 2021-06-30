import React, { useState, useEffect, useContext } from "react";
import { View, Image, Platform, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import ItemScreen from "../components/ItemScreen";
import Text from "../components/Text";
import Modal from "../components/Modal";
import ModalButton from "../components/ModalButton";
import NavigationButton from "../components/NavigationButton";
import Button from "../components/Button";
import Camera from "../components/Camera";
import colors from "../config/colors";

import { fetchResourceTemplates } from "../../api/utils/Omeka";

import ItemContext from "../../api/auth/itemContext";
import AuthContext from "../../api/auth/context";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

function UploadMedia({ navigation, route }) {
  const [cameraOn, setCameraOn] = useState(false);
  const [resourceTemplates, setResourceTemplates] = useState([]);
  const [nextModal, setNextModal] = useState(false);
  const [modal, setModal] = useState(false);

  const { item, setItem } = useContext(ItemContext);
  const { user, setUser } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);

  let templates = [];

  useEffect(() => {
    SecureStore.getItemAsync("host")
      .then((host) => {
        fetchResourceTemplates(host)
          .then((response) =>
            response.map((item) =>
              templates.push({ label: item["o:label"], value: item["o:label"] })
            )
          )
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log("no host"));
  });

  const skip = () => {
    setNextModal(true);
  };

  const confirm = () => {
    navigation.navigate("Confirm");
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          backgroundColor: "rgba(255, 255, 255, .5)",
          zIndex: 10,
          width: "100%",
          padding: 15,
          paddingTop: 50,
        }}
      >
        <TouchableOpacity>
          <Image
            source={require("../config/Icons/information.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
        <Text weight="medium">{item}, </Text>
        {route.params.type == 0 && <Text>Page {route.params.singlePage}</Text>}
        {route.params.type == 1 && <Text>Page {currentPage}</Text>}
        {route.params.type == 2 && <Text>Set page number</Text>}
      </View>
      <Camera
        navigation={navigation}
        params={route.params}
        page={currentPage}
        setPage={setCurrentPage}
      />
      {/* <NavigationButton
        onPress={() => navigation.goBack()}
        label="Back"
        direction="left"
        style={styles.back}
      />
      <NavigationButton
        onPress={() => skip()}
        label="Done"
        direction="right"
        style={styles.next}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 0.5 * height,
    justifyContent: "center",
    alignItems: "center",
  },
  children: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  shadow: {
    position: "absolute",
    top: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: width,
    height: height,
    backgroundColor: colors.gray,
    zIndex: 5,
  },
  navigation: {
    position: "absolute",
    bottom: 30,
    justifyContent: "flex-end",
    alignItems: "center",
    width: width,
    height: 0.2 * height,
  },
  back: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
  next: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
export default UploadMedia;
