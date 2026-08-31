import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

/**
 * Shimmering Placeholder Box with fast, smooth pulsing animation
 */
export function ShimmerBox({
  width: boxWidth,
  height: boxHeight,
  borderRadius = 6,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.9],
  });

  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E2E8F0', '#CBD5E1'],
  });

  return (
    <Animated.View
      style={[
        {
          width: boxWidth as any,
          height: boxHeight,
          borderRadius,
          opacity,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

/**
 * Shimmering Horizontal Cards for "Guías de Luz" section
 */
export function TherapistsSkeletonLoader() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.therapistsRow}
    >
      {[1, 2, 3, 4].map((item) => (
        <View key={item} style={styles.therapistCard}>
          <ShimmerBox width={54} height={54} borderRadius={27} />
          <ShimmerBox width={90} height={12} borderRadius={4} />
          <ShimmerBox width={65} height={10} borderRadius={3} />
          <ShimmerBox width={80} height={26} borderRadius={13} style={{ marginTop: 4 }} />
        </View>
      ))}
    </ScrollView>
  );
}

/**
 * Full Feed Skeleton Loader for Post Cards
 */
export function FeedSkeletonLoader() {
  return (
    <View style={styles.container}>
      {[1, 2].map((card) => (
        <View key={card} style={styles.postCard}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <ShimmerBox width={44} height={44} borderRadius={22} />
            <View style={styles.postHeaderInfo}>
              <ShimmerBox width={140} height={13} borderRadius={4} />
              <ShimmerBox width={80} height={9} borderRadius={3} style={{ marginTop: 6 }} />
            </View>
            <ShimmerBox width={24} height={16} borderRadius={4} />
          </View>

          {/* Post Content Lines */}
          <View style={styles.postContentLines}>
            <ShimmerBox width="92%" height={12} borderRadius={3} style={{ marginBottom: 6 }} />
            <ShimmerBox width="75%" height={12} borderRadius={3} style={{ marginBottom: 6 }} />
            <ShimmerBox width="45%" height={12} borderRadius={3} />
          </View>

          {/* Media Container (Image/Video Shimmer) */}
          <View style={styles.postMediaBox}>
            <ShimmerBox width="100%" height={Math.round(width * 0.75)} borderRadius={0} />
          </View>

          {/* Post Footer Actions */}
          <View style={styles.postFooter}>
            <ShimmerBox width={100} height={28} borderRadius={16} />
            <ShimmerBox width={110} height={28} borderRadius={16} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 40,
  },
  therapistsRow: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 8,
  },
  therapistCard: {
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: -16,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 14,
    paddingBottom: 10,
    width: width,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  postContentLines: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postMediaBox: {
    width: width,
    marginBottom: 10,
    overflow: 'hidden',
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
});
