import React, { useState, useContext } from "react";
import {
  View,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import Text from "../components/Text";
import ItemScreen from "../components/ItemScreen";
import Header from "../components/Header";
import colors from "../config/colors";

import AuthContext from "../../api/auth/context";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

function Home({ navigation }) {
  const { user, setUser } = useContext(AuthContext);

  function logOut() {
    SecureStore.deleteItemAsync("keys")
      .then(setUser(null))
      .catch((error) => console.log("error", error));
  }

  return (
    <ItemScreen style={{ flex: 1, alignItems: "center" }}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../config/Icons/SClogo.png")}
          style={{ width: 150, resizeMode: "contain" }}
        />
        <Text style = {{textAlign: 'center'}}>welcome! what would you like to do today?</Text>
      </View>
      <Card onPress = {() => navigation.navigate("Create Item", { screen: "Create New Item" })} title="Create a new blank item">
        <Text style = {{fontSize: 14, color: colors.grey}}>Choose from the list of resource templates to create a new item and upload image attachments</Text>
      </Card>
      <Card onPress = {() => navigation.navigate("Create Item", { screen: "Create New Item" })} title="Copy an existing item">
        <Text style = {{fontSize: 14, color: colors.grey}}>Create a new item based on the fields of an existing item, and edit however you'd like.</Text>
      </Card>
      <Card
        title="Find item/media"
        onPress={() => navigation.navigate("Find and Edit")}
      >        
        <Text style = {{fontSize: 14, color: colors.grey}}>Search for an item in Omeka S using provided search filters</Text>
      </Card>
      <Card
        title="View all items"
        onPress={() => navigation.navigate("View All Items")}
      >
        <Text style = {{fontSize: 14, color: colors.grey}}>All currently uploaded items in the Omeka S database. Includes links to media.</Text>
      </Card>
      <Button onPress={() => logOut()} title = "LOGOUT" style = {{width: '60%'}}/>
    </ItemScreen>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 25,
    width: 150
  },
});

export default Home;