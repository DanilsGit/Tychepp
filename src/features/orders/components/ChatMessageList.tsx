import { FlatList, StyleSheet } from "react-native";
import { Message } from "../../../types/rowTypes";
import ChatMessageItem from "./ChatMessageItem";

interface Props {
  messages: Message[];
  flatListRef: React.RefObject<FlatList | null>;
}
export default function ChatMessageList({ messages, flatListRef }: Props) {
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <ChatMessageItem message={item} />}
      keyExtractor={(item, index) => item.id || index.toString()}
      contentContainerStyle={styles.messagesContent}
      style={styles.messagesContainer}
      ref={flatListRef}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});
