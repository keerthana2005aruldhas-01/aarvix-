import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { THEME } from './theme';
import { CustomerHomeScreen } from './screens/CustomerHomeScreen';
import { DriverHomeScreen } from './screens/DriverHomeScreen';
import { TransporterHomeScreen } from './screens/TransporterHomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';

type Tab = 'customer' | 'driver' | 'transporter' | 'profile';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('customer');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.forestDark} />

      {/* Mobile Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoLetter}>A</Text>
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandName}>AARVIX</Text>
              <View style={styles.subBadge}>
                <Text style={styles.subBadgeText}>TRANSPORT</Text>
              </View>
            </View>
            <Text style={styles.brandTagline}>Pan-India Lorry & Freight Network</Text>
          </View>
        </View>

        <View style={styles.hubIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.hubText}>LIVE NETWORK</Text>
        </View>
      </View>

      {/* Screen Body */}
      <View style={styles.mainContent}>
        {activeTab === 'customer' && <CustomerHomeScreen />}
        {activeTab === 'driver' && <DriverHomeScreen />}
        {activeTab === 'transporter' && <TransporterHomeScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Bottom Tab Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('customer')}
          style={[styles.tabButton, activeTab === 'customer' && styles.tabButtonActive]}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'customer' && styles.tabButtonTextActive,
            ]}
          >
            Book Lorry
          </Text>
          {activeTab === 'customer' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('driver')}
          style={[styles.tabButton, activeTab === 'driver' && styles.tabButtonActive]}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'driver' && styles.tabButtonTextActive,
            ]}
          >
            Driver Cockpit
          </Text>
          {activeTab === 'driver' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('transporter')}
          style={[styles.tabButton, activeTab === 'transporter' && styles.tabButtonActive]}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'transporter' && styles.tabButtonTextActive,
            ]}
          >
            Fleet Portal
          </Text>
          {activeTab === 'transporter' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('profile')}
          style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'profile' && styles.tabButtonTextActive,
            ]}
          >
            Account / KYC
          </Text>
          {activeTab === 'profile' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.forestDark,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.forestDark,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: THEME.colors.forest,
    borderWidth: 1,
    borderColor: THEME.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: THEME.colors.gold,
    fontWeight: '900',
    fontSize: 16,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subBadge: {
    backgroundColor: THEME.colors.goldLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  subBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: THEME.colors.forestDark,
  },
  brandTagline: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 1,
  },
  hubIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 59, 36, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.3)',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  hubText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
    backgroundColor: THEME.colors.bgWarm,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingBottom: 6,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  tabButtonActive: {
    opacity: 1,
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  tabButtonTextActive: {
    color: THEME.colors.forest,
    fontWeight: '800',
  },
  activeIndicator: {
    width: 20,
    height: 3,
    backgroundColor: THEME.colors.gold,
    borderRadius: 2,
    marginTop: 4,
  },
});

export default App;
