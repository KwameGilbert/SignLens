import { View, Text, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // Navigate to login
    console.log('Navigate to login');
  };

  const handleCreateAccount = () => {
    // Navigate to create account
    console.log('Navigate to create account');
  };

  const handleContinueAsGuest = () => {
    // Navigate to main app
    console.log('Navigate to main app as guest');
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* Background Image */}
      <Image 
        source={require('../assets/images/welcome_bg.png')}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        contentFit="cover"
      />

      {/* Orange Overlay */}
      <View 
        style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#FF8C42',
          opacity: 0.6 
        }} 
      />

      {/* Content */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Title Section */}
        <View className="items-center mb-16">
          <Text className="text-white text-4xl font-bold text-center mb-3">
            Translate Signs
          </Text>
          <Text className="text-white text-4xl font-bold text-center mb-6">
            Break Barriers
          </Text>
          <Text className="text-white/90 text-base text-center leading-6 px-4">
            Connect with the deaf community{'\n'}
            through real-time sign language{'\n'}
            translation and learning
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full max-w-sm">
          {/* Login Button */}
          <TouchableOpacity
            className="bg-white py-4 rounded-full items-center mb-4 active:opacity-90"
            onPress={handleLogin}
          >
            <Text className="text-orange-500 font-bold text-lg">Login</Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            className="border-2 border-white py-4 rounded-full items-center mb-6 active:opacity-90"
            onPress={handleCreateAccount}
          >
            <Text className="text-white font-bold text-lg">Create Account</Text>
          </TouchableOpacity>

          {/* Continue as Guest */}
          <TouchableOpacity
            className="items-center py-2"
            onPress={handleContinueAsGuest}
          >
            <Text className="text-white font-semibold text-base underline">
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
