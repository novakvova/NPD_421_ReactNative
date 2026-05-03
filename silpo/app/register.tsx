import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';

import {EmailInput} from "@/components/form/register/EmailInput";
import {PasswordInput} from "@/components/form/register/PasswordInput";
import {useRegisterMutation} from "@/services/AuthService";
import {IRegister} from "@/types/auth/IRegister";
import {router} from "expo-router";
import {FirstNameInput} from "@/components/form/register/FirstNameInput";
import {LastNameInput} from "@/components/form/register/LastNameInput";
import ScrollView = Animated.ScrollView;
import {getErrorMessage} from "@/utils/getErrorMessage";

export default function RegisterScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<IRegister>({
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: ''
        },
        mode: 'onBlur',
    });

    const [register, {isLoading, error}] = useRegisterMutation();


    const onSubmit = async (data: IRegister) => {
        try {
            console.log('Form data:', data);
            const result = await register(data).unwrap();
            console.log(result);
            router.replace("/login")
        }
        catch(ex) {
            console.log('Error occured', ex);
        }
        finally {
            // setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
            <ScrollView>

                <KeyboardAvoidingView
                    className="flex-1 py-20"
                >
                    <View className="flex-1 justify-center px-6 gap-6">
                        {/* Header */}
                        <View className="items-center gap-3 mb-4">
                            {/* Logo */}
                            <View className="w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl items-center justify-center shadow-lg">
                                <Text className="text-2xl font-bold text-white dark:text-slate-900">
                                    S
                                </Text>
                            </View>
                            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
                                Реєстрація до Silpo
                            </Text>
                            <Text className="text-base text-slate-600 dark:text-slate-400">
                                Введіть свої дані для реєстрації
                            </Text>
                        </View>

                        {error && (
                            <View className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-4 pb-0">
                                <Text className="text-red-700 dark:text-red-200 text-sm font-medium ">
                                    {getErrorMessage(error)}
                                </Text>
                            </View>
                        )}

                        {/* Form Card */}
                        <View className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 gap-4 shadow-sm">
                            {/* Email Field */}

                            <FirstNameInput
                                label={"Ім'я"}
                                control={control}
                                isLoading={isLoading}
                                error={errors.firstName}
                            />

                            <LastNameInput
                                label={"Прізвище"}
                                control={control}
                                isLoading={isLoading}
                                error={errors.lastName}
                            />

                            <EmailInput
                                label={"Електронна пошта"}
                                control={control}
                                isLoading={isLoading}
                                error={errors.email} />

                            {/* Password Field */}
                            <PasswordInput
                                label={"Пароль"}
                                control={control}
                                isLoading={isLoading}
                                error={errors.password} />

                            {/* Forgot Password */}
                            <TouchableOpacity
                                disabled={isLoading}
                                className="self-end mt-1"
                            >
                                <Text className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    Забули пароль?
                                </Text>
                            </TouchableOpacity>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
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
                                        Зареєструватись
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Register Link */}
                        <View className="flex-row justify-center items-center gap-1">
                            <Text className="text-slate-600 dark:text-slate-400 text-sm">
                                Вже маєте аккаунт?
                            </Text>
                            <TouchableOpacity disabled={isLoading}  onPress={() => router.replace("/login")}>
                                <Text className="text-slate-900 dark:text-white font-semibold text-sm">
                                    Увійти
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}