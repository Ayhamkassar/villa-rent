// app/_layout.js
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0077b6',
        tabBarInactiveTintColor: '#888',
        headerStyle: { backgroundColor: '#0077b6' },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="FarmListScreen"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="EditMyVilla"
        options={{
          href: null,
          title: 'تعديل مزرعتي',
        }}
      />
      <Tabs.Screen
        name="MyVillas"
        options={{
          title: 'مزارعي',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'البروفايل',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
