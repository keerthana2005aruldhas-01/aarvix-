import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '../theme';
import {
  VEHICLE_CATALOG,
  MAJOR_HUBS,
  calculateApproxDistanceKm,
  calculateTransparentFare,
} from '@aarvix/shared';

interface RecentBookingItem {
  id: string;
  lane: string;
  vehicle: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Scheduled';
  statusColor: string;
  statusBg: string;
}

const RECENT_BOOKINGS: RecentBookingItem[] = [
  {
    id: 'ARVX-8812',
    lane: 'Bengaluru → Chennai',
    vehicle: '14 Ft Eicher Pro (4T)',
    date: '21 Oct, 14:30',
    status: 'Delivered',
    statusColor: '#166534',
    statusBg: '#DCFCE7',
  },
  {
    id: 'ARVX-8790',
    lane: 'Chennai → Hyderabad',
    vehicle: 'Tata 407 LCV (2.5T)',
    date: '18 Oct, 09:15',
    status: 'Delivered',
    statusColor: '#166534',
    statusBg: '#DCFCE7',
  },
  {
    id: 'ARVX-8654',
    lane: 'Bengaluru → Coimbatore',
    vehicle: 'Tata Ace (1T)',
    date: '14 Oct, 11:00',
    status: 'Delivered',
    statusColor: '#166534',
    statusBg: '#DCFCE7',
  },
];

export const CustomerHomeScreen: React.FC = () => {
  const [pickupCity, setPickupCity] = useState('Bengaluru');
  const [dropCity, setDropCity] = useState('Chennai');
  const [selectedVehicleId, setSelectedVehicleId] = useState(VEHICLE_CATALOG[0].id);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fromHub = MAJOR_HUBS.find((h) => h.city === pickupCity) || MAJOR_HUBS[0];
  const toHub = MAJOR_HUBS.find((h) => h.city === dropCity) || MAJOR_HUBS[1];

  const distanceKm = useMemo(() => {
    if (pickupCity === dropCity) return 25;
    return calculateApproxDistanceKm(fromHub.lat, fromHub.lng, toHub.lat, toHub.lng);
  }, [fromHub, toHub, pickupCity, dropCity]);

  const fare = useMemo(() => {
    return calculateTransparentFare(selectedVehicleId, distanceKm, 0);
  }, [selectedVehicleId, distanceKm]);

  const selectedVehicle =
    VEHICLE_CATALOG.find((v) => v.id === selectedVehicleId) || VEHICLE_CATALOG[0];

  const handleBookingAction = () => {
    setActionNotice(
      `Fare quote for ${selectedVehicle.name} (${pickupCity} → ${dropCity}) ready at ₹${fare.totalFare.toLocaleString()}. Dispatch desk will connect for loading dock slot.`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. App-like Header & Greeting */}
      <View style={styles.greetingCard}>
        <View style={styles.greetingHeader}>
          <View>
            <Text style={styles.greetingSub}>WELCOME BACK</Text>
            <Text style={styles.greetingTitle}>Hello, Freight Shipper</Text>
          </View>
          <View style={styles.verifiedTag}>
            <Text style={styles.verifiedTagText}>RC VERIFIED</Text>
          </View>
        </View>
        <Text style={styles.greetingDesc}>
          Book verified commercial lorries with transparent spot freight tariffs across 500+ lanes.
        </Text>
      </View>

      {/* 2. Route Pickup and Drop-Off Fields */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionBadge}>CONSIGNMENT ROUTE</Text>
        <Text style={styles.sectionTitle}>Where is your cargo moving?</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>PICKUP LOCATION</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
          {MAJOR_HUBS.slice(0, 6).map((hub) => (
            <TouchableOpacity
              key={hub.city}
              onPress={() => {
                setPickupCity(hub.city);
                setActionNotice(null);
              }}
              style={[styles.hubPill, pickupCity === hub.city && styles.hubPillActive]}
            >
              <Text
                style={[
                  styles.hubPillText,
                  pickupCity === hub.city && styles.hubPillTextActive,
                ]}
              >
                {hub.city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.inputLabel, { marginTop: THEME.spacing.md }]}>
          DROP-OFF LOCATION
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
          {MAJOR_HUBS.slice(0, 6).map((hub) => (
            <TouchableOpacity
              key={hub.city}
              onPress={() => {
                setDropCity(hub.city);
                setActionNotice(null);
              }}
              disabled={hub.city === pickupCity}
              style={[
                styles.hubPill,
                dropCity === hub.city && styles.hubPillActive,
                hub.city === pickupCity && { opacity: 0.3 },
              ]}
            >
              <Text
                style={[
                  styles.hubPillText,
                  dropCity === hub.city && styles.hubPillTextActive,
                ]}
              >
                {hub.city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>
            Official Highway Distance: <Text style={styles.boldText}>{distanceKm} km</Text>
          </Text>
          <Text style={styles.transitText}>Est. Transit: ~{fare.estimatedHours} hrs</Text>
        </View>
      </View>

      {/* 3. Vehicle Category Cards */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionBadge}>SELECT VEHICLE</Text>
        <Text style={styles.sectionTitle}>Commercial Vehicle Categories</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleScroll}>
        {VEHICLE_CATALOG.slice(0, 6).map((vehicle) => {
          const isSelected = selectedVehicleId === vehicle.id;
          return (
            <TouchableOpacity
              key={vehicle.id}
              onPress={() => {
                setSelectedVehicleId(vehicle.id);
                setActionNotice(null);
              }}
              style={[styles.vehicleCard, isSelected && styles.vehicleCardActive]}
            >
              <View style={styles.vehicleHeader}>
                <Text style={styles.vehicleTonnage}>{vehicle.tonnage} Tonne</Text>
                <Text style={styles.vehicleBody}>
                  {vehicle.bodyType.replace('_', ' ').toUpperCase()}
                </Text>
              </View>

              <Text style={styles.vehicleName} numberOfLines={2}>
                {vehicle.name}
              </Text>

              <View style={styles.vehicleSpecsBox}>
                <Text style={styles.vehiclePayload}>Payload: {vehicle.payloadKg.toLocaleString()} kg</Text>
                <Text style={styles.vehicleDimensions}>
                  {vehicle.dimensions.lengthFt}×{vehicle.dimensions.widthFt}×{vehicle.dimensions.heightFt} ft
                </Text>
              </View>

              <View style={styles.vehicleRateBox}>
                <Text style={styles.vehicleRate}>₹{vehicle.baseFare}</Text>
                <Text style={styles.vehiclePerKm}>+{vehicle.perKmRate}/km</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 4. Transparent Fare Breakdown & Prominent Booking Action */}
      <View style={styles.priceCard}>
        <View style={styles.priceHeader}>
          <Text style={styles.priceTitle}>TRANSPARENT SPOT FARE</Text>
          <Text style={styles.transitHours}>{selectedVehicle.name}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalAmount}>₹{fare.totalFare.toLocaleString()}</Text>
          <Text style={styles.totalSub}>Door-to-door all-inclusive estimate</Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Base Tariff ({selectedVehicle.baseKm}km incl.)</Text>
          <Text style={styles.breakdownValue}>₹{fare.baseFare.toLocaleString()}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>
            Distance ({Math.max(0, distanceKm - selectedVehicle.baseKm)} km)
          </Text>
          <Text style={styles.breakdownValue}>₹{fare.distanceFare.toLocaleString()}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Fuel Index (6%)</Text>
          <Text style={styles.breakdownValue}>₹{fare.fuelSurcharge.toLocaleString()}</Text>
        </View>
        {fare.tollEstimate > 0 && (
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>NH Tolls / Fastag</Text>
            <Text style={styles.breakdownValue}>₹{fare.tollEstimate.toLocaleString()}</Text>
          </View>
        )}
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>GTA GST (5%)</Text>
          <Text style={styles.breakdownValue}>₹{fare.gstAmount.toLocaleString()}</Text>
        </View>

        {/* Notice on booking */}
        {actionNotice && (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>{actionNotice}</Text>
          </View>
        )}

        {/* Prominent booking action button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBookingAction}>
          <Text style={styles.bookButtonText}>Book This Verified Lorry</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimerText}>
          Tariff is calculated based on standard highway distance. Dedicated dispatch coordinator verifies RC and permits prior to gate loading.
        </Text>
      </View>

      {/* 5. Recent Consignments / Past Bookings */}
      <View style={[styles.sectionHeader, { marginTop: THEME.spacing.xl }]}>
        <Text style={styles.sectionBadge}>ACTIVITY</Text>
        <Text style={styles.sectionTitle}>Recent Consignments</Text>
      </View>

      <View style={styles.recentList}>
        {RECENT_BOOKINGS.map((item) => (
          <View key={item.id} style={styles.recentItemCard}>
            <View style={styles.recentItemTop}>
              <Text style={styles.recentLane}>{item.lane}</Text>
              <View style={[styles.statusChip, { backgroundColor: item.statusBg }]}>
                <Text style={[styles.statusChipText, { color: item.statusColor }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.recentItemBottom}>
              <Text style={styles.recentVehicle}>{item.vehicle}</Text>
              <Text style={styles.recentMeta}>{item.id} • {item.date}</Text>
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
    padding: THEME.spacing.md,
    paddingBottom: 40,
  },
  greetingCard: {
    backgroundColor: THEME.colors.forestDark,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.3)',
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  greetingSub: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  verifiedTag: {
    backgroundColor: 'rgba(197, 155, 39, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.gold,
  },
  verifiedTagText: {
    color: THEME.colors.gold,
    fontSize: 9,
    fontWeight: '800',
  },
  greetingDesc: {
    color: '#D1E0D7',
    fontSize: 12,
    lineHeight: 17,
  },
  sectionHeader: {
    marginBottom: THEME.spacing.sm,
  },
  sectionBadge: {
    color: THEME.colors.goldDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.forestDark,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.xs,
  },
  pillRow: {
    flexDirection: 'row',
  },
  hubPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surfaceSubtle,
    marginRight: 8,
  },
  hubPillActive: {
    backgroundColor: THEME.colors.forest,
    borderColor: THEME.colors.forest,
  },
  hubPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMain,
  },
  hubPillTextActive: {
    color: '#FFFFFF',
  },
  distanceBadge: {
    marginTop: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 11,
    color: THEME.colors.forest,
  },
  boldText: {
    fontWeight: 'bold',
  },
  transitText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  vehicleScroll: {
    marginBottom: THEME.spacing.lg,
  },
  vehicleCard: {
    width: 170,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: 10,
    justifyContent: 'space-between',
  },
  vehicleCardActive: {
    borderColor: THEME.colors.forest,
    borderWidth: 2,
    backgroundColor: '#F7FAF8',
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleTonnage: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.colors.forest,
    backgroundColor: THEME.colors.forestLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vehicleBody: {
    fontSize: 8,
    color: THEME.colors.textMuted,
    fontWeight: '700',
  },
  vehicleName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.colors.textMain,
    marginBottom: 4,
  },
  vehicleSpecsBox: {
    marginVertical: 4,
  },
  vehiclePayload: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  vehicleDimensions: {
    fontSize: 9,
    color: THEME.colors.textLight,
    marginTop: 1,
  },
  vehicleRateBox: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  vehicleRate: {
    fontSize: 13,
    fontWeight: 'bold',
    color: THEME.colors.forest,
  },
  vehiclePerKm: {
    fontSize: 9,
    color: THEME.colors.textMuted,
  },
  priceCard: {
    backgroundColor: THEME.colors.forestDark,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.3)',
    marginBottom: THEME.spacing.lg,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
  },
  priceTitle: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  transitHours: {
    color: '#D1E0D7',
    fontSize: 10,
    fontWeight: '600',
  },
  totalRow: {
    marginBottom: THEME.spacing.md,
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  totalSub: {
    fontSize: 10,
    color: '#A7C4B5',
    marginTop: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#D1E0D7',
  },
  breakdownValue: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  noticeBox: {
    backgroundColor: 'rgba(197, 155, 39, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.gold,
    borderRadius: THEME.borderRadius.sm,
    padding: THEME.spacing.sm,
    marginTop: THEME.spacing.md,
  },
  noticeText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 16,
  },
  bookButton: {
    backgroundColor: THEME.colors.gold,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: THEME.spacing.md,
  },
  bookButtonText: {
    color: THEME.colors.forestDark,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  disclaimerText: {
    color: '#8CA698',
    fontSize: 9,
    textAlign: 'center',
    marginTop: THEME.spacing.sm,
    lineHeight: 13,
  },
  recentList: {
    gap: 10,
  },
  recentItemCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  recentItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentLane: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textMain,
  },
  statusChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
  },
  statusChipText: {
    fontSize: 9,
    fontWeight: '700',
  },
  recentItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentVehicle: {
    fontSize: 11,
    color: THEME.colors.forest,
    fontWeight: '500',
  },
  recentMeta: {
    fontSize: 10,
    color: THEME.colors.textLight,
  },
});

export default CustomerHomeScreen;
