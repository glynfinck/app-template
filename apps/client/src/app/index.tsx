import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useSession } from '@/hooks/use-session';

export default function Home() {
  const { session, loading } = useSession();
  const dark = useColorScheme() === 'dark';
  const color = dark ? '#FFFFFF' : '#000000';

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#000000' : '#FFFFFF' }]}>
      <Stack.Screen options={{ title: 'Home' }} />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={[styles.text, { color }]}>
          {session ? `Signed in as ${session.user.email ?? session.user.id}` : 'Not signed in'}
        </Text>
      )}
      <Text style={[styles.hint, { color }]}>Edit src/app/index.tsx to start building.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 },
  text: { fontSize: 17 },
  hint: { fontSize: 13, opacity: 0.6 },
});
