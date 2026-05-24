

import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, Platform, Text, TouchableOpacity, View} from "react-native";
import {useGetProfileQuery} from "@/services/AccountService";
import {IProfile} from "@/types/account/IProfile";

export default function ProfileScreen() {

    const [user, setUser] = useState<IProfile | null>(null);
    const {data, isLoading, isError, error} = useGetProfileQuery();

    const logoutHandler = async () => {
        await AsyncStorage.removeItem('accessToken');
        router.replace("/login")
    }

    useEffect(() => {
        if (isError) {
            console.log(error);
            logoutHandler();
        }

        if (!isLoading && data) {
            setUser(data);
        }
    }, [data, isLoading, isError]);

    if (isLoading && !data && !user) {
        return (
            <>
                <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
                    <View className="flex-1 justify-center px-6 gap-6">
                        <ActivityIndicator size="large" color="#4F46E5" />
                    </View>
                </SafeAreaView>
            </>
        )
    }

    return (
        <>
            <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
                <View className="flex-1 py-10 px-6 gap-6 justify-between">
                    <View className="items-center gap-6 mb-4">
                        <View className="w-20 h-20 bg-slate-900 dark:bg-white rounded-full items-center justify-center shadow-lg">
                            <Text className="text-3xl font-bold text-white dark:text-slate-900">
                                {user?.firstName[0]}
                            </Text>
                        </View>
                        <View className={"items-center"}>
                            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
                                {user?.firstName} {user?.lastName}
                            </Text>
                            <Text className="text-base text-slate-600 dark:text-slate-400">
                                {user?.email}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={logoutHandler}
                        activeOpacity={0.85}
                        className={`py-3 px-4 rounded-xl items-center justify-center mt-2 ${
                            isLoading
                                ? 'bg-slate-400 dark:bg-slate-600'
                                : 'bg-slate-900 dark:bg-white'
                        }`}
                    >
                        {isLoading ? (
                            <ActivityIndicator
                                color={Platform.OS === 'ios' ? '#0f172a' : '#ffffff'}
                                size="small"
                            />
                        ) : (
                            <Text className="text-white dark:text-slate-900 font-semibold text-base">
                                Вийти
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity disabled={isLoading} onPress={() => router.replace("/chat")}>
                        <Text className="text-slate-900 dark:text-white font-semibold text-sm">
                            Чат
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    )
}