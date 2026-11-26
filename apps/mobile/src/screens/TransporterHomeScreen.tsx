import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '../theme';

interface FleetVehicle {
  id: string;
  regNumber: string;
  model: string;
  tonnage: number;
  driverName: string;
  status: 'on_highway' | 'available' | 'maintenance';
  permitStatus: 'valid' | 'renewal_due';
  insuranceDaysLeft: number;
}

export const TransporterHomeScreen: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'on_highway' | 'available'>('all');

  const fleet: FleetVehicle[] = [
    {
      id: 'v-1',
      regNumber: 'KA01AB8829',
      model: '14 Ft Eicher Pro (4 Tonne)',
      tonnage: 4.0,
      driverName: 'Ramesh Kumar',
      status: 'on_highway',
      permitStatus: 'valid',
      insuranceDaysLeft: 184,
    },
    {
      id: 'v-2',
      regNumber: 'KA04MJ1902',
      model: '32 Ft Multi Axle Container (15 Tonne)',
      tonnage: 15.0,
      driverName: 'Suresh Patil',
      status: 'on_highway',
      permitStatus: 'valid',
      insuranceDaysLeft: 92,
    },
    {
      id: 'v-3',
      regNumber: 'MH12RN4401',
      model: 'Tata Ace (1 Tonne)',
      tonnage: 1.0,
      driverName: 'Anil Yadav',
      status: 'available',
      permitStatus: 'valid',
      insuranceDaysLeft: 230,
    },
    {
      id: 'v-4',
      regNumber: 'TN09CK7712',
      model: '22 Ft Heavy Duty (10 Tonne)',
      tonnage: 10.0,
      driverName: 'Unassigned',
      status: 'available',
      permitStatus: 'renewal_due',
      insuranceDaysLeft: 18,
    },
    {
      id: 'v-5',
      regNumber: 'KA05D9081',
      model: '17 Ft High Side (6 Tonne)',
      tonnage: 6.0,
      driverName: 'Manjunath B.',
      status: 'maintenance',
      permitStatus: 'valid',
      insuranceDaysLeft: 140,
    },
  ];

  const filteredFleet =
    filter === 'all' ? fleet : fleet.filter((item) => item.status === filter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Transporter Header Card */}
      <View style={styles.orgCard}>
        <View>
          <Text style={styles.orgTag}>VERIFIED TRANSPORTER PORTAL</Text>
          <Text style={styles.orgName}>Balaji Roadways Logistics</Text>
          <Text style={styles.orgGst}>GSTIN: 29AAAAA0000A1Z5 • 8 Vehicles</Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricNumber}>8</Text>
          <Text style={styles.metricLabel}>Total Fleet</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: '#F0FDF4' }]}>
          <Text style={[styles.metricNumber, { color: THEME.colors.forest }]}>5</Text>
          <Text style={styles.metricLabel}>On Highway</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: '#FEFCE8' }]}>
          <Text style={[styles.metricNumber, { color: THEME.colors.goldDark }]}>2</Text>
          <Text style={styles.metricLabel}>Available</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {[
          { id: 'all', label: 'All Fleet (5)' },
          { id: 'on_highway', label: 'On Highway (2)' },
          { id: 'available', label: 'Available (2)' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setFilter(tab.id as any)}
            style={[styles.filterPill, filter === tab.id && styles.filterPillActive]}
          >
            <Text
              style={[
                styles.filterPillText,
                filter === tab.id && styles.filterPillTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fleet List */}
      <View style={styles.fleetList}>
        {filteredFleet.map((truck) => (
          <View key={truck.id} style={styles.truckCard}>
            <View style={styles.truckHeader}>
              <View>
                <Text style={styles.truckReg}>{truck.regNumber}</Text>
                <Text style={styles.truckModel}>{truck.model}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  truck.status === 'on_highway'
                    ? styles.statusHighway
                    : truck.status === 'available'
                    ? styles.statusAvailable
                    : styles.statusMaint,
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {truck.status === 'on_highway'
                    ? 'On Trip'
                    : truck.status === 'available'
                    ? 'Available'
                    : 'Maintenance'}
                </Text>
              </View>
            </View>

            <View style={styles.truckDetails}>
              <Text style={styles.detailText}>
                Assigned Driver:{' '}
                <Text style={{ fontWeight: 'bold', color: THEME.colors.textMain }}>
                  {truck.driverName}
                </Text>
              </Text>
              <Text style={styles.detailText}>
                National Permit:{' '}
                <Text
                  style={{
                    color:
                      truck.permitStatus === 'valid'
                        ? THEME.colors.forest
                        : THEME.colors.danger,
                    fontWeight: 'bold',
                  }}
                >
                  {truck.permitStatus === 'valid' ? 'Audit Verified' : 'Renewal Due'}
                </Text>
              </Text>
              <Text style={styles.detailText}>
                Insurance: {truck.insuranceDaysLeft} days remaining
              </Text>
            </View>
          </View>
        ))}
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
  orgCard: {
    backgroundColor: THEME.colors.forestDark,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.3)',
  },
  orgTag: {
    color: THEME.colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  orgName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 2,
  },
  orgGst: {
    color: '#A7C4B5',
    fontSize: 11,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  metricBox: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.forestDark,
  },
  metricLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  filterPillActive: {
    backgroundColor: THEME.colors.forest,
    borderColor: THEME.colors.forest,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  fleetList: {
    gap: 10,
  },
  truckCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  truckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  truckReg: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.forestDark,
  },
  truckModel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusHighway: {
    backgroundColor: THEME.colors.forestLight,
  },
  statusAvailable: {
    backgroundColor: '#FEF3C7',
  },
  statusMaint: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.forestDark,
  },
  truckDetails: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 8,
    gap: 3,
  },
  detailText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
});
