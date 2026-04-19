import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            console.log('Form data:', data);
            // await loginAPI(data);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
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
                            Вхід до Silpo
                        </Text>
                        <Text className="text-base text-slate-600 dark:text-slate-400">
                            Введіть свої дані для входу
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 gap-4 shadow-sm">
                        {/* Email Field */}
                        <View className="gap-2">
                            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                                Email
                            </Text>
                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: 'Email є обов\'язковим',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Введіть коректний email',
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <TextInput
                                            className={`px-4 py-3 text-base rounded-xl border-2 ${
                                                errors.email
                                                    ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100'
                                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white'
                                            } placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                            placeholder="your@email.com"
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            editable={!isLoading}
                                        />
                                        {errors.email && (
                                            <Text className="text-sm text-red-500 dark:text-red-400 ml-1">
                                                {errors.email.message}
                                            </Text>
                                        )}
                                    </>
                                )}
                            />
                        </View>

                        {/* Password Field */}
                        <View className="gap-2">
                            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                                Пароль
                            </Text>
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: 'Пароль є обов\'язковим',
                                    minLength: {
                                        value: 6,
                                        message: 'Пароль має бути не менше 6 символів',
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <View className={`flex-row items-center border-2 rounded-xl px-4 ${
                                            errors.password
                                                ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700'
                                        }`}>
                                            <TextInput
                                                className="flex-1 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                                placeholder="••••••••"
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                secureTextEntry={!showPassword}
                                                autoCapitalize="none"
                                                editable={!isLoading}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                disabled={isLoading}
                                                className="pl-2"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={20} className="text-slate-500 dark:text-slate-400" />
                                                ) : (
                                                    <Eye size={20} className="text-slate-500 dark:text-slate-400" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        {errors.password && (
                                            <Text className="text-sm text-red-500 dark:text-red-400 ml-1">
                                                {errors.password.message}
                                            </Text>
                                        )}
                                    </>
                                )}
                            />
                        </View>

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
                                    Увійти
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Register Link */}
                    <View className="flex-row justify-center items-center gap-1">
                        <Text className="text-slate-600 dark:text-slate-400 text-sm">
                            Немає акаунту?
                        </Text>
                        <TouchableOpacity disabled={isLoading}>
                            <Text className="text-slate-900 dark:text-white font-semibold text-sm">
                                Зареєструватись
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}