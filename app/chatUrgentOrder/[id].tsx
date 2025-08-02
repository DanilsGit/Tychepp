import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatUrgentOrder } from "../../src/features/orders/hooks/useChatUrgentOrder";
import ChatMessageList from "../../src/features/orders/components/ChatMessageList";
import { useOrderFromChat } from "../../src/features/orders/hooks/useOrderFromChat";
import CreateOrderFromChatModal from "../../src/features/orders/components/CreateOrderFromChatModal";
import { colors } from "../../src/styles/global";

export default function ChatUrgentOrder() {
  const { id, recipientName } = useLocalSearchParams();
  const {
    messages,
    inputText,
    setInputText,
    flatListRef,
    onBack,
    sendMessage,
    isSending,
    conversation,
    status,
  } = useChatUrgentOrder(Number(id));

  const {
    createOrderFromChat,
    isGeneratingItems,
    orderItems,
    onCancel,
    onAddItem,
    productsAvailable,
    handleEditFieldAtIndex,
    handleEditField,
    visible,
    handleDeleteItem,
    information,
    handleEditInformation,
    onOk,
    isCreatingOrder,
  } = useOrderFromChat(conversation, messages);

  const insets = useSafeAreaInsets();
  const styles = generateStyles(insets.top, insets.bottom);

  const handleCreateOrderFromChat = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "¿Conoces los productos, la dirección, el nombre del cliente y todo lo necesario?"
      );
      if (confirmed) createOrderFromChat();
    } else {
      Alert.alert(
        "¿Todo listo?",
        "¿Conoces los productos, la dirección, el nombre del cliente y todo lo necesario?",
        [
          {
            text: "No aún no",
            style: "destructive",
          },
          {
            text: "Claro que sí",
            style: "default",
            onPress: () => {
              createOrderFromChat();
            },
          },
        ]
      );
    }
  };

  if (isGeneratingItems) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Generando productos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isCreatingOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Creando orden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status !== "") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{status}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CreateOrderFromChatModal
        items={orderItems}
        onCancel={onCancel}
        onOk={onOk}
        onAddItem={onAddItem}
        handleEditFieldAtIndex={handleEditFieldAtIndex}
        handleEditField={handleEditField}
        productsAvailable={productsAvailable}
        visible={visible}
        handleDeleteItem={handleDeleteItem}
        information={information}
        handleEditInformation={handleEditInformation}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerTexts}>
          <Text style={styles.headerTitle}>{recipientName}</Text>
          <Text style={{ fontSize: 12, color: colors.success }}>
            Última actividad{" "}
            {new Date(conversation?.updated_at || 0).toLocaleTimeString()}
          </Text>
        </View>
        <TouchableOpacity onPress={handleCreateOrderFromChat}>
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 50}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            {status !== "" ? (
              <Text style={styles.emptyStateText}>
                Start a conversation with {recipientName}
              </Text>
            ) : (
              <Text style={styles.emptyStateText}>{status}</Text>
            )}
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
              disabled={!inputText.trim() || isSending}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() && !isSending ? "#007AFF" : "#999"}
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
      justifyContent: "space-between",
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
    headerTexts: {
      alignItems: "center",
      justifyContent: "center",
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
