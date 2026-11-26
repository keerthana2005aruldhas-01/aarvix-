import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { THEME } from '../theme';
import { BRAND } from '@aarvix/shared';

type DriverTripStage =
  | 'idle'
  | 'offered'
  | 'heading_to_pickup'
  | 'loading'
  | 'in_transit'
  | 'at_destination'
  | 'completed';

export const DriverHomeScreen: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [tripState, setTripState] = useState<DriverTripStage>('offered');
  const [deliveryOtp, setDeliveryOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [sosType, setSosType] = useState<'puncture' | 'breakdown' | 'accident'>('puncture');
  const [sosTransmitted, setSosTransmitted] = useState(false);

  const handleSendSos = () => {
    setSosTransmitted(true);
    setTimeout(() => {
      setSosModalVisible(false);
      setSosTransmitted(false);
      Alert.alert(
        'Emergency SOS Transmitted',
        'Your GPS location (NH-44 Corridor) and vehicle details have been transmitted to the central control tower. A dispatch supervisor is calling your mobile now.'
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Driver Cockpit Header */}
      <View style={styles.driverBar}>
        <View>
          <View style={styles.badgeRow}>
            <Text style={styles.driverGreeting}>Ramesh Kumar</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>HGV AUDITED</Text>
            </View>
          </View>
          <Text style={styles.vehicleInfo}>
            Assigned: Eicher 14ft (KA 01 AB 8829) • ARVX-V-1042
          </Text>
        </View>
        <View style={styles.statusToggle}>
          <Text
            style={[
              styles.statusText,
              { color: isOnline ? THEME.colors.success : THEME.colors.textMuted },
            ]}
          >
            {isOnline ? 'DUTY READY' : 'OFFLINE'}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#D1D5DB', true: THEME.colors.successLight }}
            thumbColor={isOnline ? THEME.colors.forest : '#9CA3AF'}
          />
        </View>
      </View>

      {/* Emergency Highway SOS Ribbon */}
      <TouchableOpacity
        style={styles.sosButton}
        onPress={() => setSosModalVisible(true)}
      >
        <Text style={styles.sosText}>🚨 EMERGENCY HIGHWAY SOS / BREAKDOWN</Text>
      </TouchableOpacity>

      {/* 1. Offered Trip Request (Accept / Reject) */}
      {tripState === 'offered' && isOnline && (
        <View style={styles.tripCard}>
          <View style={styles.tripCardHeader}>
            <View>
              <Text style={styles.tripSubHeader}>NEW CONSIGNMENT ASSIGNMENT</Text>
              <Text style={styles.tripId}>ARVX-2026-8921</Text>
            </View>
            <View style={styles.fareTag}>
              <Text style={styles.fareTagText}>₹14,500 Payout</Text>
            </View>
          </View>

          <View style={styles.routeBox}>
            <View style={styles.routeRow}>
              <View style={styles.dotPickup} />
              <View style={{ flex: 1 }}>
                <Text style={styles.routeLabel}>PICKUP (Loading Dock)</Text>
                <Text style={styles.routeAddress}>Gate 4, Peenya Industrial Area, Bengaluru</Text>
              </View>
            </View>

            <View style={styles.routeRow}>
              <View style={styles.dotDrop} />
              <View style={{ flex: 1 }}>
                <Text style={styles.routeLabel}>DROP (Receiving Warehouse)</Text>
                <Text style={styles.routeAddress}>Dock 2, Ambattur Industrial Estate, Chennai</Text>
              </View>
            </View>
          </View>

          <View style={styles.cargoRow}>
            <Text style={styles.cargoText}>Cargo: FMCG Cartons • 3,200 kg</Text>
            <Text style={styles.cargoText}>Distance: 346 km via NH-44</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => setTripState('idle')}
            >
              <Text style={styles.rejectButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => setTripState('heading_to_pickup')}
            >
              <Text style={styles.acceptButtonText}>Accept Consignment</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 2. Heading to Pickup */}
      {tripState === 'heading_to_pickup' && (
        <View style={styles.tripCard}>
          <Text style={styles.tripSubHeader}>STEP 1: EN ROUTE TO LOADING DOCK</Text>
          <Text style={styles.tripId}>Gate 4, Peenya Industrial Area</Text>
          <Text style={styles.instructionText}>
            Navigate to consignor warehouse. Present ARVX-2026-8921 at security gate.
          </Text>

          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => setTripState('loading')}
          >
            <Text style={styles.primaryActionText}>Confirm Arrived at Loading Bay</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 3. Loading Cargo & Weighment */}
      {tripState === 'loading' && (
        <View style={styles.tripCard}>
          <Text style={styles.tripSubHeader}>STEP 2: LOADING & WEIGHMENT</Text>
          <Text style={styles.tripId}>Consignment Loading in Progress</Text>
          <Text style={styles.instructionText}>
            Ensure all 40 cartons are strapped. Verify gross weighbridge slip before gate departure.
          </Text>

          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => setTripState('in_transit')}
          >
            <Text style={styles.primaryActionText}>Cargo Loaded • Start Highway Trip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. In Transit */}
      {tripState === 'in_transit' && (
        <View style={styles.tripCard}>
          <View style={styles.inTransitHeader}>
            <View style={styles.liveDot} />
            <Text style={styles.inTransitLabel}>IN TRANSIT • TELEMATICS ACTIVE</Text>
          </View>
          <Text style={styles.tripId}>Bengaluru → Chennai (NH-44)</Text>
          <Text style={styles.instructionText}>
            Corridor checkpoints active. Maintain speed within 55 km/h commercial limit.
          </Text>

          <TouchableOpacity
            style={[styles.primaryAction, { marginTop: THEME.spacing.md }]}
            onPress={() => setTripState('at_destination')}
          >
            <Text style={styles.primaryActionText}>Arrived at Destination Bay</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 5. Destination Delivery & Consignee OTP Verification */}
      {tripState === 'at_destination' && (
        <View style={styles.tripCard}>
          <Text style={styles.tripSubHeader}>STEP 3: DELIVERY VERIFICATION</Text>
          <Text style={styles.tripId}>Dock 2, Ambattur Industrial Estate</Text>
          <Text style={styles.instructionText}>
            Collect the 4-digit Delivery Verification OTP from the warehouse consignee after unloading.
          </Text>

          <TextInput
            style={styles.otpInput}
            placeholder="Enter 4-Digit Receiver OTP"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            maxLength={4}
            value={deliveryOtp}
            onChangeText={setDeliveryOtp}
          />

          <TouchableOpacity
            style={[styles.primaryAction, deliveryOtp.length < 4 && { opacity: 0.5 }]}
            disabled={deliveryOtp.length < 4}
            onPress={() => {
              setOtpVerified(true);
              setTripState('completed');
            }}
          >
            <Text style={styles.primaryActionText}>Verify OTP & Complete Delivery</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 6. Completed Trip Settlement Summary */}
      {tripState === 'completed' && (
        <View style={styles.completedCard}>
          <Text style={styles.completedBadge}>CONSIGNMENT CLOSED</Text>
          <Text style={styles.completedTitle}>Trip ARVX-2026-8921 Completed!</Text>
          <Text style={styles.completedSub}>
            Digital POD and consignee OTP verified. Payment settlement credited to your ledger.
          </Text>

          <View style={styles.earningsBreakdown}>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Base Freight Earnings</Text>
              <Text style={styles.earningsValue}>₹13,000</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Fastag Toll Reimbursement</Text>
              <Text style={styles.earningsValue}>₹1,500</Text>
            </View>
            <View style={[styles.earningsRow, { borderTopWidth: 1, borderTopColor: '#E2E5DC', paddingTop: 6, marginTop: 4 }]}>
              <Text style={[styles.earningsLabel, { fontWeight: 'bold', color: THEME.colors.forest }]}>
                Net Credited Payout
              </Text>
              <Text style={[styles.earningsValue, { fontWeight: 'bold', color: THEME.colors.forest, fontSize: 16 }]}>
                ₹14,500
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setTripState('offered');
              setDeliveryOtp('');
              setOtpVerified(false);
            }}
          >
            <Text style={styles.resetButtonText}>Ready for Next Load</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Idle state */}
      {tripState === 'idle' && (
        <View style={styles.completedCard}>
          <Text style={styles.completedTitle}>No Active Consignments</Text>
          <Text style={styles.completedSub}>
            Your status is ONLINE. Central dispatch tower will notify you when a matching load is available on your preferred corridors.
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setTripState('offered')}
          >
            <Text style={styles.resetButtonText}>Simulate New Load Assignment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Driver Compliance Checklist */}
      <View style={styles.checklistCard}>
        <Text style={styles.checklistTitle}>Mandatory Vehicle & Driver Checklist</Text>
        <Text style={styles.checkItem}>✓ Commercial DL (HGV) Verified & Active</Text>
        <Text style={styles.checkItem}>✓ All-India Goods Carriage Permit Current</Text>
        <Text style={styles.checkItem}>✓ Commercial Vehicle Fitness Certificate OK</Text>
        <Text style={styles.checkItem}>✓ Fastag Commercial Electronic Wallet: ₹2,450</Text>
      </View>

      {/* Emergency Highway SOS Modal */}
      <Modal
        visible={sosModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSosModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🚨 Highway Emergency SOS</Text>
            <Text style={styles.modalSub}>
              Transmits your current corridor GPS coordinates to the 24/7 central operations desk.
            </Text>

            <Text style={styles.modalSectionLabel}>SELECT EMERGENCY TYPE:</Text>
            <View style={styles.sosTypeRow}>
              {(['puncture', 'breakdown', 'accident'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSosType(type)}
                  style={[
                    styles.sosTypePill,
                    sosType === type && styles.sosTypePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sosTypePillText,
                      sosType === type && styles.sosTypePillTextActive,
                    ]}
                  >
                    {type === 'puncture'
                      ? 'Tyre Puncture'
                      : type === 'breakdown'
                      ? 'Engine Breakdown'
                      : 'Minor Accident'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.gpsLocationBox}>
              <Text style={styles.gpsLabel}>CURRENT TELEMATICS LOCATION:</Text>
              <Text style={styles.gpsCoords}>NH-44 Corridor, near Krishnagiri (12.528° N, 78.214° E)</Text>
            </View>

            <TouchableOpacity
              style={styles.sosTransmitButton}
              onPress={handleSendSos}
              disabled={sosTransmitted}
            >
              <Text style={styles.sosTransmitButtonText}>
                {sosTransmitted ? 'Transmitting Alert...' : 'TRANSMIT SOS TO DISPATCH TOWER'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSosModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  driverBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  driverGreeting: {
    fontSize: 15,
    fontWeight: 'bold',
    color: THEME.colors.forestDark,
  },
  verifiedBadge: {
    backgroundColor: THEME.colors.forestLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    color: THEME.colors.forest,
    fontSize: 9,
    fontWeight: '800',
  },
  vehicleInfo: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  statusToggle: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sosButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    shadowColor: '#DC2626',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  tripCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  tripSubHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.goldDark,
    letterSpacing: 0.8,
  },
  tripId: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.forestDark,
    marginTop: 2,
  },
  fareTag: {
    backgroundColor: THEME.colors.forestLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  fareTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.colors.forest,
  },
  routeBox: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  dotPickup: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.forest,
    marginTop: 4,
  },
  dotDrop: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.gold,
    marginTop: 4,
  },
  routeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  routeAddress: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMain,
  },
  cargoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  cargoText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  acceptButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.forest,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  instructionText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    lineHeight: 18,
    marginVertical: THEME.spacing.md,
  },
  primaryAction: {
    backgroundColor: THEME.colors.forest,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  inTransitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  inTransitLabel: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '800',
  },
  otpInput: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 4,
    color: THEME.colors.textMain,
    marginBottom: THEME.spacing.md,
  },
  completedCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
    alignItems: 'center',
  },
  completedBadge: {
    color: THEME.colors.forest,
    backgroundColor: THEME.colors.forestLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.forestDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  completedSub: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
    lineHeight: 16,
  },
  earningsBreakdown: {
    width: '100%',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  earningsLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  earningsValue: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMain,
  },
  resetButton: {
    backgroundColor: THEME.colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    width: '100%',
  },
  resetButtonText: {
    color: THEME.colors.forestDark,
    fontSize: 12,
    fontWeight: '800',
  },
  checklistCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  checklistTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.colors.forestDark,
    marginBottom: 8,
  },
  checkItem: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: THEME.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#991B1B',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.md,
  },
  modalSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    marginBottom: 6,
  },
  sosTypeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: THEME.spacing.md,
  },
  sosTypePill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  sosTypePillActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  sosTypePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
  sosTypePillTextActive: {
    color: '#B91C1C',
  },
  gpsLocationBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: THEME.spacing.md,
  },
  gpsLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  gpsCoords: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
  },
  sosTransmitButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginBottom: 8,
  },
  sosTransmitButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  modalCloseButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
});

export default DriverHomeScreen;
