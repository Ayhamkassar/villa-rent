// app/_layout.js
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

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
        name="addVilla"
        options={{
          title: 'إضافة مزرعة',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="plus" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="VillasList"
        options={{
          title: 'قائمة المزارع',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="editVilla"
        options={{
          href: null,
          title: 'تعديل مزرعة',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="edit" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="UserDetails"
        options={{
          href: null,
          title: 'تفاصيل مستخدم',
        }}
      />
      <Tabs.Screen
        name="VillaDetails"
        options={{
          href: null,
          title: 'تفاصيل مزرعة',
        }}
      />
      <Tabs.Screen
        name="displayUsers"
        options={{
          title: 'المستخدمون',
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" color={color} size={size} />
          ),
        }}
      />
            <Tabs.Screen
        name="profile"
        options={{
          title: 'البروفايل',
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
