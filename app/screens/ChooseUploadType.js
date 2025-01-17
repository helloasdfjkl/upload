import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";

import Option from "../components/Option";
import Header from "../components/Header";
import ItemScreen from "../components/ItemScreen";
import Text from "../components/Text";
import Modal from "../components/Modal";
import ModalButton from "../components/ModalButton";
import NavigationButton from "../components/NavigationButton";

import colors from "../config/colors";

import AuthContext from "../../api/auth/context";
import ItemContext from "../../api/auth/itemContext";
import * as SecureStore from "expo-secure-store";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  getMedia,
  fetchOne,
  fetchResourceTemplates,
  fetchProperties,
  getPropertiesInResourceTemplate,
  getPropertyIds,
} from "../../api/utils/Omeka";

const { width, height } = Dimensions.get("window");

function ChooseUploadType({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const { item, setItem } = useContext(ItemContext);

  var boolArr = [true, false];
  if (route.params && route.params.item) boolArr = [true, false];

  const [selected, setSelected] = useState(boolArr);
  const [singlePage, onChangeSinglePage] = useState(1);
  const [assignPage, onChangeAssignPage] = useState(1);
  const [warning, setWarning] = useState(false);

  const [id, setId] = useState(item);

  useEffect(() => {
    if (route.params && route.params.item) {
      setItem(route.params.item);
    }
  });

  const next = () => {
    if (selected[0]) {
      SecureStore.getItemAsync("host").then((host) => {
        SecureStore.getItemAsync("keys").then((keys) => {
          getMedia(host, item, {
            key_identity: keys.split(",")[0],
            key_credential: keys.split(",")[1],
          }).then((res) => {
            if (res.length > 0) {
              fetchOne(host, "media", res[res.length - 1]["o:id"], {
                key_identity: keys.split(",")[0],
                key_credential: keys.split(",")[1],
              }).then((last) => {
                if (last["bibo:number"]) {
                  navigation.navigate("Upload Media", {
                    editing: id,
                    type: 1,
                    page: last["bibo:number"][0]["@value"],
                  });
                } else {
                  navigation.navigate("Upload Media", {
                    editing: id,
                    type: 1,
                    page: 1,
                  });
                }
              });
            } else {
              navigation.navigate("Upload Media", {
                editing: id,
                type: 1,
                page: 1,
              });
            }
          });
        });
      });
    } else if (selected[1]) {
      navigation.navigate("Upload Media", {
        editing: id,
        type: 2,
        page: assignPage,
      });
    }
    setWarning(false);
  };

  const back = () => {
    if (route.params && route.params.item) {
      navigation.navigate("View All Items");
    } else navigation.navigate("Create New Item", { mode: "view" });
  };
  return (
    <ItemScreen style={{ flex: 1 }} exit={() => navigation.navigate("Home")}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Header title="Choose Upload Type" />
      </View>
      <View style={styles.body}>
        <KeyboardAwareScrollView style={{ flex: 1, marginBottom: 80 }}>
          {/* <Option
            onPress={() => setSelected([true, false, false, false])}
            selected={selected[0]}
            text="I'm only uploading one image"
            description="For quick, single image uploads. Take a picture or select from camera roll and upload directly to Omeka."
          >
            {selected[0] && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  weight="medium"
                  style={{ color: colors.grey, fontSize: 14 }}
                >
                  Set page number (optional)
                </Text>
                <TextInput
                  autocorrect={false}
                  onChangeText={onChangeSinglePage}
                  style={{
                    borderRadius: 7.5,
                    borderWidth: 1,
                    padding: 5,
                    height: 30,
                    width: 50,
                    paddingHorizontal: 10,
                    borderColor: colors.primary,
                    fontFamily: "Barlow_400Regular",
                  }}
                />
              </View>
            )}
          </Option> */}

          {/* <View style={styles.divider} /> */}
          <Option
            onPress={() => setSelected([true, false])}
            selected={selected[0]}
            text="Auto-increment page uploads"
            description="Counts the number of pages for you, starting at the last page number. Can’t edit page number while uploading."
          />
          <Option
            onPress={() => setSelected([false, true])}
            selected={selected[1]}
            text="Manually assign page numbers"
            description="Give each image an assigned page number."
          >
            {/* {selected[2] && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View style={{ width: "80%" }}>
                  <Text
                    weight="medium"
                    style={{
                      color: colors.grey,
                      fontSize: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    Set page number (optional)
                  </Text>
                </View>
                <TextInput
                  autocorrect={false}
                  onChangeText={onChangeAssignPage}
                  style={{
                    borderRadius: 7.5,
                    borderWidth: 1,
                    padding: 5,
                    height: 30,
                    width: "20%",
                    paddingHorizontal: 10,
                    borderColor: colors.primary,
                    fontFamily: "Barlow_400Regular",
                  }}
                />
              </View>
            )} */}
          </Option>
        </KeyboardAwareScrollView>
      </View>
      {warning && (
        <Modal title="Once an image upload has started, do not close the app. Otherwise, the upload will be interrupted!">
          <View style={styles.children}>
            <ModalButton onPress={() => next()} line={1} title="OK" />
          </View>
        </Modal>
      )}
      <NavigationButton
        style={styles.next}
        onPress={() =>
          selected[3] ? navigation.navigate("Confirm") : setWarning(true)
        }
        label="Next"
        direction="right"
      />
      <NavigationButton
        style={styles.back}
        onPress={() => back()}
        label="Back"
        direction="left"
      />
    </ItemScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.blue,
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  children: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  divider: {
    height: 2,
    backgroundColor: colors.primary,
    width: "100%",
    marginVertical: 5,
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
  next: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  info: {
    position: "absolute",
    bottom: 30,
    width: width - 125,
    height: 50,
    left: 30,
  },
  children: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  back: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
});

export default ChooseUploadType;
