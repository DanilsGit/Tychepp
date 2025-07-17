import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatUrgentOrder } from "../../src/features/orders/hooks/useChatUrgentOrder";
import ChatMessageList from "../../src/features/orders/components/ChatMessageList";

export default function ChatUrgentOrder() {
  const { id, recipientName } = useLocalSearchParams();
  const {
    messages,
    inputText,
    setInputText,
    flatListRef,
    onBack,
    sendMessage,
    isLoading,
  } = useChatUrgentOrder(Number(id));
  const insets = useSafeAreaInsets();
  const styles = generateStyles(insets.top, insets.bottom);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{recipientName}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              Start a conversation with {recipientName}
            </Text>
          </View>
        ) : (
          <ChatMessageList messages={messages} flatListRef={flatListRef} />
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={[
                styles.sendButton,
                inputText.trim()
                  ? styles.sendButtonActive
                  : styles.sendButtonInactive,
              ]}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? "#007AFF" : "#999"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const generateStyles = (insetsTop: number, insetsBottom: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
    },
    header: {
      paddingTop: insetsTop,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: "#000",
      textAlign: "center",
    },
    headerSpacer: {
      width: 40,
    },
    chatContainer: {
      flex: 1,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: "#999",
      textAlign: "center",
    },
    inputContainer: {
      backgroundColor: "#fff",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: "#e0e0e0",
      paddingBottom: insetsBottom,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: "#f8f8f8",
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 8,
      minHeight: 50,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: "#000",
      maxHeight: 100,
      paddingVertical: 8,
      paddingRight: 12,
    },
    sendButton: {
      padding: 8,
      borderRadius: 20,
      marginLeft: 8,
    },
    sendButtonActive: {
      backgroundColor: "rgba(0, 122, 255, 0.1)",
    },
    sendButtonInactive: {
      backgroundColor: "transparent",
    },
  });
