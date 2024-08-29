import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FullImageScreen } from "./full-image";

const imagesDirectory = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imagesDirectory);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imagesDirectory, {
      intermediates: true,
    });
  }
};

type FullImageProps = {
  show: boolean;
  index: number;
};

export default function HomeScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fullImage, setFullImage] = useState<FullImageProps>({
    show: false,
    index: 0,
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imagesDirectory);
    setImages(files.map((file) => imagesDirectory + file));
  };

  const onPressSelectImage = async (useLibrary: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    };

    Alert.alert(
      "Escolha uma opção:",
      "",
      [
        {
          text: "Selecionar da galeria",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync(options);
            if (!result.canceled) {
              saveImage(result.assets[0].uri);
            }
          },
        },
        {
          text: "Tirar foto",
          onPress: async () => {
            await ImagePicker.requestCameraPermissionsAsync();
            const result = await ImagePicker.launchCameraAsync(options);
            if (!result.canceled) {
              saveImage(result.assets[0].uri);
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const saveImage = async (uri: string) => {
    await ensureDirExists();
    const fileName = `${new Date().getTime()}-${uri.split("/").pop()}`;
    const destinationUri = imagesDirectory + fileName;
    await FileSystem.copyAsync({ from: uri, to: destinationUri });
    setImages([...images, destinationUri]);
  };

  const deleteImage = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((image) => image !== uri));
  };

  const uploadImage = async (uri: string) => {
    setLoading(true);

    try {
      const uploadResult = await FileSystem.uploadAsync(
        "http://localhost:8080/api/v1/upload/image",
        uri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "file",
          mimeType: "image/jpeg",
        }
      );

      if (uploadResult.status !== 201) {
        throw new Error(
          "Erro ao fazer upload da imagem, tente novamente mais tarde."
        );
      }

      Alert.alert("Imagem enviada com sucesso.");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Não foi possível enviar a imagem.",
        (error as Error).message
      );
    } finally {
      setLoading(false);
    }
  };

  const onPressFullImage = (uri: string) => {
    Alert.alert(
      "Escolha uma opção:",
      "",
      [
        {
          text: "Deletar",
          onPress: () => deleteImage(uri),
        },
        {
          text: "Upload",
          onPress: () => uploadImage(uri),
        },
        {
          text: "Visualizar",
          onPress: () => {
            setFullImage({
              show: true,
              index: images.indexOf(uri),
            });
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <SafeAreaView style={styles.titleContainer}>
      <ThemedText type="title">Galeria de Imagens</ThemedText>

      <ScrollView>
        <View
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            rowGap: 16,
            columnGap: 20,
          }}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onPressFullImage(image)}
              style={styles.imageView}
            >
              <Image
                source={{ uri: image }}
                style={[
                  StyleSheet.absoluteFill,
                  {
                    borderRadius: 12,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => onPressSelectImage(false)}
            style={[
              styles.imageView,
              {
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "black",
              },
            ]}
          >
            <MaterialCommunityIcons
              name="camera-plus"
              size={38}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {loading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color={"white"} size="large" animating />
        </View>
      )}

      <FullImageScreen
        visible={fullImage.show}
        onRequestClose={() => setFullImage({ show: false, index: 0 })}
        images={images}
        imageIndex={fullImage.index}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageView: {
    width: 115,
    height: 115,
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    rowGap: 40,
    paddingHorizontal: 15,
    paddingTop: 80,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
