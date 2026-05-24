import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import * as SignalR from '@microsoft/signalr';

interface Message {
    id: string;
    text: string;
    timestamp: Date;
}

const chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const hubConnectionRef = useRef<SignalR.HubConnection | null>(null);

    useEffect(() => {
        initializeSignalR();
        return () => {
            if (hubConnectionRef.current) {
                hubConnectionRef.current.stop();
            }
        };
    }, []);

    const initializeSignalR = async () => {
        try {
            const connection = new SignalR.HubConnectionBuilder()
                .withUrl('https://silpo.itstep.click/chat')
                .withAutomaticReconnect([0, 0, 5000, 10000, 15000, 30000])
                .withHubProtocol(new SignalR.JsonHubProtocol())
                .build();

            // Слухаємо вхідні повідомлення
            connection.on('Send', (data: string) => {
                const newMessage: Message = {
                    id: Date.now().toString(),
                    text: data,
                    timestamp: new Date(),
                };
                setMessages((prevMessages) => [newMessage, ...prevMessages]);
            });

            // Обробка подій підключення
            connection.onreconnecting(() => {
                console.log('Переконнектуюсь...');
                setIsConnected(false);
            });

            connection.onreconnected(() => {
                console.log('Переконнектовано!');
                setIsConnected(true);
            });

            connection.onclose(() => {
                console.log('Відключено від сервера');
                setIsConnected(false);
            });

            // Стартуємо з'єднання
            await connection.start();
            hubConnectionRef.current = connection;
            setIsConnected(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Помилка підключення до SignalR:', error);
            setIsLoading(false);
            setIsConnected(false);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || !hubConnectionRef.current || !isConnected) {
            return;
        }

        try {
            await hubConnectionRef.current.invoke('Send', inputMessage);
            setInputMessage('');
        } catch (error) {
            console.error('Помилка при відправці повідомлення:', error);
        }
    };

    const renderMessage = ({item}: { item: Message }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
                {item.timestamp.toLocaleTimeString('uk-UA')}
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Чат SignalR</Text>
                    <View style={styles.statusIndicator}>
                        <View
                            style={[
                                styles.statusDot,
                                {backgroundColor: isConnected ? '#4CAF50' : '#FF5252'},
                            ]}
                        />
                        <Text style={styles.statusText}>
                            {isConnected ? 'Підключено' : 'Відключено'}
                        </Text>
                    </View>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0066cc"/>
                        <Text style={styles.loadingText}>Підключення...</Text>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={messages}
                            renderItem={renderMessage}
                            keyExtractor={(item) => item.id}
                            inverted
                            contentContainerStyle={styles.messagesList}
                            scrollEnabled={true}
                        />

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Введіть повідомлення..."
                                placeholderTextColor="#999"
                                value={inputMessage}
                                onChangeText={setInputMessage}
                                editable={isConnected}
                                multiline
                                maxLength={500}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    {opacity: isConnected ? 1 : 0.5},
                                ]}
                                onPress={sendMessage}
                                disabled={!isConnected || !inputMessage.trim()}
                            >
                                <Text style={styles.sendButtonText}>Відправити</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        color: '#666',
    },
    messagesList: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    messageContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginVertical: 4,
        maxWidth: '85%',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        fontSize: 16,
        color: '#333',
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#0066cc',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
});

export default chat;