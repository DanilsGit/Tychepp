import { StyleSheet, View } from "react-native";
import { Message } from "../../../types/rowTypes";
import { Text } from "@rn-vui/base";

interface Props {
  message: Message;
}

export default function ChatMessageItem({ message }: Props) {
  if (!message || !message.content) return null;
  if (message.role === "system" || message.role === "tool") return null;

  const isWorker = message.content.startsWith("[TRABAJADOR]");
  const isClient = !message.content.startsWith("[TRABAJADOR]");
  const isAssistant = message.role === "assistant";

  return (
    <View
      style={[
        styles.messageContainer,
        isClient && styles.clientMessageContainer,
        isWorker && styles.workerMessageContainer,
        isAssistant && styles.workerMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isClient && styles.clientMessageBubble,
          isWorker && styles.workerMessageBubble,
          isAssistant && styles.assistantMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isClient && styles.clientMessageText,
            isWorker && styles.workerMessageText,
            isAssistant && styles.workerMessageText,
          ]}
        >
          {message.content.replace("[TRABAJADOR] ", "")}
        </Text>
        {/* <Text
            style={[
              styles.timestampText,
              isUser ? styles.userTimestampText : styles.recipientTimestampText,
            ]}
          >
            {formatTime(message.timestamp)}
          </Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 6,
  },
  workerMessageContainer: {
    alignItems: "flex-end",
  },
  clientMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  workerMessageBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  assistantMessageBubble: {
    backgroundColor: "#2c2c2cff",
    borderBottomRightRadius: 4,
  },
  clientMessageBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    elevation: 1,
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  workerMessageText: {
    color: "#fff",
  },
  clientMessageText: {
    color: "#000",
  },
  timestampText: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  workerTimestampText: {
    color: "#fff",
    textAlign: "right",
  },
  clientTimestampText: {
    color: "#666",
  },
});
