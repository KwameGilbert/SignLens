import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/signup');
  };

  const handleContinueAsGuest = () => {
    router.push('/(tabs)/home');
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

      {/* Modern Gradient Overlay */}
      <LinearGradient
        colors={['rgba(251, 84, 7, 0.91)', 'rgba(251, 84, 7, 0.91)', 'rgba(251, 84, 7, 0.91)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject} 
      />

      {/* Content */}
      <View className="flex-1 justify-end pb-16">
        {/* Hero Section */}
        <View className="items-center mb-12 px-6">
          {/* App Icon/Logo Area */}
          <View 
            style={styles.logoContainer}
            className="mb-8"
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>👋</Text>
            </View>
          </View>

          {/* Title Section */}
          <View className="items-center mb-6">
            <Text style={styles.mainTitle} className="text-white text-center mb-2">
              Translate Signs
            </Text>
            <Text style={styles.mainTitle} className="text-white text-center mb-5">
              Break Barriers
            </Text>
            <View style={styles.divider} />
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle} className="text-white/95 text-center max-w-sm">
            Connect with the deaf community through real-time sign language translation and learning
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="px-8">
          {/* Login Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            className="mb-4 active:opacity-90"
            onPress={handleLogin}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Login to Your Account</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            className="mb-6 active:opacity-90"
            onPress={handleCreateAccount}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>

          {/* Continue as Guest */}
          <TouchableOpacity
            className="items-center py-3"
            onPress={handleContinueAsGuest}
            activeOpacity={0.7}
          >
            <Text style={styles.guestText}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  iconText: {
    fontSize: 48,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  primaryButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  primaryButtonText: {
    color: '#FB5607',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backdropFilter: 'blur(10px)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  guestText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(255, 255, 255, 0.8)',
    opacity: 0.95,
  },
});
