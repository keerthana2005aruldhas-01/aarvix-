import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '../theme';
import { BRAND } from '@aarvix/shared';

export const ProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AR</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>Aarvix Logistics Partner</Text>
          <Text style={styles.userPhone}>+91 98765 43210</Text>
          <View style={styles.kycBadge}>
            <Text style={styles.kycText}>KYC VERIFIED</Text>
          </View>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.menuCard}>
        <Text style={styles.menuHeader}>LOGISTICS SETTINGS</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemTitle}>Saved Pickup & Drop Warehouses</Text>
          <Text style={styles.menuItemSub}>Bengaluru ORR, Chennai Ambattur, Pune Chakan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemTitle}>GST Invoices & Statements</Text>
          <Text style={styles.menuItemSub}>Monthly RCM summary & tax credit notes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemTitle}>Notification & SMS Preferences</Text>
          <Text style={styles.menuItemSub}>Trip dispatch, loading status, delivery OTP</Text>
        </TouchableOpacity>
      </View>

      {/* 24x7 Help Center Box */}
      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>24x7 Operations Control Tower</Text>
        <Text style={styles.helpSub}>
          National Highway Helpline: {BRAND.supportPhone}
        </Text>
        <Text style={styles.helpSub}>Email: {BRAND.supportEmail}</Text>
      </View>

      {/* Version and Compliance */}
      <View style={styles.footerInfo}>
        <Text style={styles.versionText}>AARVIX Transport Mobile • v1.0.0 (Phase 4 Build)</Text>
        <Text style={styles.versionSub}>
          Goods Transport Agency (GTA) Compliance Certified
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bgWarm,
  },
  content: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  avatarText: {
    color: THEME.colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: THEME.colors.forestDark,
  },
  userPhone: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  kycBadge: {
    backgroundColor: THEME.colors.forestLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  kycText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.forest,
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  menuHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 1,
    paddingHorizontal: THEME.spacing.sm,
    paddingTop: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
  },
  menuItem: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textMain,
  },
  menuItemSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  helpCard: {
    backgroundColor: THEME.colors.forestDark,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  helpTitle: {
    color: THEME.colors.gold,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  helpSub: {
    color: '#E2EDE6',
    fontSize: 11,
    marginTop: 2,
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
  },
  versionText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  versionSub: {
    fontSize: 10,
    color: THEME.colors.textLight,
    marginTop: 2,
  },
});
