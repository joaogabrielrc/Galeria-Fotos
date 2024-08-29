import { SafeAreaView } from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  images: string[];
  imageIndex: number;
};

export function FullImageScreen({
  visible,
  onRequestClose,
  images,
  imageIndex,
}: Props) {
  const mappedImages = images.map((image) => ({ uri: image }));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageView
        images={mappedImages}
        imageIndex={imageIndex}
        visible={visible}
        onRequestClose={onRequestClose}
      />
    </SafeAreaView>
  );
}
