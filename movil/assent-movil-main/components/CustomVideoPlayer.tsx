import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  PanResponder,
  Platform,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
} from 'lucide-react-native';
import { normalizeMediaUrl } from '../api/client';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const globalVideoPositions: Record<string, number> = {};

export interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  isMuted?: boolean;
  defaultMuted?: boolean;
  onMuteChange?: (isMuted: boolean) => void;
  style?: any;
  height?: number;
  fullBleed?: boolean;
  contentFit?: 'cover' | 'contain' | 'fill';
  isActive?: boolean;
  loop?: boolean;
  initialTime?: number;
  onTimeUpdate?: (seconds: number) => void;
  onPlay?: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');
  return `${formattedMins}:${formattedSecs}`;
}

export function isVideoMedia(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase().trim();
  if (lower.startsWith('data:video/')) return true;
  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi', '.mkv', '.ogv', '.3gp'];
  return videoExtensions.some((ext) => lower.includes(ext));
}

export function CustomVideoPlayer({
  src,
  poster,
  autoPlay = false,
  isMuted: isMutedProp,
  defaultMuted = false,
  onMuteChange,
  style,
  height = 340,
  fullBleed = false,
  contentFit: contentFitProp,
  isActive,
  loop = true,
  initialTime,
  onTimeUpdate,
  onPlay,
}: CustomVideoPlayerProps) {
  const normalizedSrc = normalizeMediaUrl(src) || src;
  const contentFit = contentFitProp || 'contain';
  const videoViewRef = useRef<any>(null);
  const isScreenFocused = useIsFocused();
  const isMountedRef = useRef(true);

  const initialMuted = isMutedProp !== undefined ? isMutedProp : defaultMuted;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showCenterIcon, setShowCenterIcon] = useState<'play' | 'pause' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState<number>(width - 48);

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userPausedRef = useRef<boolean>(false);
  const progressBarWidthRef = useRef<number>(width - 48);
  const durationRef = useRef<number>(0);
  durationRef.current = duration;

  // Track component mounted lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Initialize expo-video player with position restoration
  const player = useVideoPlayer(normalizedSrc, (p) => {
    p.loop = loop;
    p.muted = initialMuted;
    try {
      p.timeUpdateEventInterval = 0.25;
    } catch (e) {}

    const savedPos = initialTime !== undefined ? initialTime : (globalVideoPositions[normalizedSrc] || 0);
    if (savedPos > 0) {
      try {
        p.currentTime = savedPos;
        setCurrentTime(savedPos);
      } catch (e) {}
    }

    if (autoPlay || (isActive === true && isScreenFocused)) {
      try {
        p.play();
      } catch (e) {}
    }
  });

  // Sync mute state with isMutedProp
  useEffect(() => {
    if (!player || !isMountedRef.current) return;
    try {
      if (isMutedProp !== undefined) {
        player.muted = isMutedProp;
        setIsMuted(isMutedProp);
      }
    } catch (e) {}
  }, [isMutedProp, player]);

  // Handle isActive and isScreenFocused prop changes safely
  useEffect(() => {
    if (!player || !isMountedRef.current) return;

    if (!isScreenFocused || isActive === false) {
      userPausedRef.current = false;
      try {
        if (player.playing) {
          player.pause();
        }
      } catch (e) {}
      setIsPlaying(false);
      return;
    }

    if (isActive && isScreenFocused) {
      try {
        if (!userPausedRef.current && !player.playing) {
          player.play();
        }
      } catch (e) {}
    }
  }, [isActive, isScreenFocused, player]);

  // Dedicated PanResponder for scrubber
  const seekPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 3,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt) => {
        setIsSeeking(true);
        if (player && isMountedRef.current && durationRef.current > 0 && progressBarWidthRef.current > 0) {
          try {
            const touchX = Math.max(0, Math.min(evt.nativeEvent.locationX, progressBarWidthRef.current));
            const targetSeconds = (touchX / progressBarWidthRef.current) * durationRef.current;
            setSeekTime(targetSeconds);
            player.currentTime = targetSeconds;
            setCurrentTime(targetSeconds);
            globalVideoPositions[normalizedSrc] = targetSeconds;
          } catch (e) {}
        }
      },
      onPanResponderMove: (evt) => {
        if (player && isMountedRef.current && durationRef.current > 0 && progressBarWidthRef.current > 0) {
          try {
            const touchX = Math.max(0, Math.min(evt.nativeEvent.locationX, progressBarWidthRef.current));
            const targetSeconds = (touchX / progressBarWidthRef.current) * durationRef.current;
            setSeekTime(targetSeconds);
            player.currentTime = targetSeconds;
            setCurrentTime(targetSeconds);
            globalVideoPositions[normalizedSrc] = targetSeconds;
          } catch (e) {}
        }
      },
      onPanResponderRelease: () => {
        setIsSeeking(false);
        scheduleControlsHide(2000);
      },
      onPanResponderTerminate: () => {
        setIsSeeking(false);
        scheduleControlsHide(2000);
      },
    })
  ).current;

  const scheduleControlsHide = (delay = 2000) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      try {
        if (isMountedRef.current && player && player.playing) {
          setShowControls(false);
        }
      } catch (e) {}
    }, delay);
  };

  // Auto-hide controls 2 seconds after playing
  useEffect(() => {
    if (isPlaying) {
      scheduleControlsHide(2000);
    } else {
      setShowControls(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    }
  }, [isPlaying]);

  // Track player events and continuous seconds counter
  useEffect(() => {
    if (!player || !isMountedRef.current) return;

    try {
      player.timeUpdateEventInterval = 0.25;
    } catch (e) {}

    const timeUpdateSub = player.addListener('timeUpdate', (event) => {
      if (!isMountedRef.current) return;
      if (typeof event.currentTime === 'number' && event.currentTime >= 0) {
        setCurrentTime(event.currentTime);
        globalVideoPositions[normalizedSrc] = event.currentTime;
        if (onTimeUpdate) onTimeUpdate(event.currentTime);
      }
      try {
        if (player.duration) {
          setDuration(player.duration);
        }
      } catch (e) {}
      setIsLoading(false);
    });

    const statusSub = player.addListener('playingChange', (event) => {
      if (!isMountedRef.current) return;
      setIsPlaying(event.isPlaying);
      if (event.isPlaying) {
        setHasEnded(false);
        setIsLoading(false);
        scheduleControlsHide(2000);
        if (onPlay) onPlay();
      } else {
        setShowControls(true);
      }
    });

    const playToEndSub = player.addListener('playToEnd', () => {
      if (!isMountedRef.current) return;
      setIsPlaying(false);
      setHasEnded(true);
      setShowControls(true);
      globalVideoPositions[normalizedSrc] = 0;
    });

    const statusChangeSub = player.addListener('statusChange', (event) => {
      if (!isMountedRef.current) return;
      if (event.status === 'readyToPlay') {
        setIsLoading(false);
        try {
          if (player.duration) {
            setDuration(player.duration);
          }
          const savedPos = initialTime !== undefined ? initialTime : (globalVideoPositions[normalizedSrc] || 0);
          if (savedPos > 0 && Math.abs(player.currentTime - savedPos) > 0.5) {
            player.currentTime = savedPos;
            setCurrentTime(savedPos);
          }
        } catch (e) {}
      } else if (event.status === 'loading') {
        setIsLoading(true);
      } else if (event.status === 'error') {
        setIsLoading(false);
        setHasError(true);
      }
    });

    const muteSub = player.addListener('mutedChange', (event) => {
      if (!isMountedRef.current) return;
      setIsMuted(event.muted);
    });

    return () => {
      try {
        timeUpdateSub?.remove();
        statusSub?.remove();
        playToEndSub?.remove();
        statusChangeSub?.remove();
        muteSub?.remove();
      } catch (e) {}
    };
  }, [player, normalizedSrc, initialTime, onPlay, onTimeUpdate]);

  const toggleControls = () => {
    setShowControls((prev) => {
      const next = !prev;
      if (next) scheduleControlsHide(2500);
      return next;
    });
  };

  const triggerCenterIcon = (type: 'play' | 'pause') => {
    setShowCenterIcon(type);
    setTimeout(() => {
      setShowCenterIcon(null);
    }, 600);
  };

  const handleTogglePlay = () => {
    if (!player) return;
    if (hasEnded) {
      userPausedRef.current = false;
      player.seekBy(-currentTime);
      player.play();
      setHasEnded(false);
      triggerCenterIcon('play');
      scheduleControlsHide(2000);
    } else if (player.playing) {
      userPausedRef.current = true;
      player.pause();
      triggerCenterIcon('pause');
      setShowControls(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    } else {
      userPausedRef.current = false;
      player.play();
      triggerCenterIcon('play');
      scheduleControlsHide(2000);
    }
  };

  const handleToggleMute = () => {
    if (!player) return;
    const nextMuted = !player.muted;
    player.muted = nextMuted;
    setIsMuted(nextMuted);
    if (onMuteChange) {
      onMuteChange(nextMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoViewRef.current) {
      videoViewRef.current.enterFullscreen();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (hasError) {
    return (
      <View style={[styles.errorContainer, { height }, style]}>
        <Sparkles color="#10B981" size={24} />
        <Text style={styles.errorText}>No se pudo cargar el video.</Text>
        <TouchableOpacity
          onPress={() => {
            setHasError(false);
            setIsLoading(true);
            player?.replay();
          }}
          style={styles.retryBtn}
        >
          <RotateCcw color="#059669" size={16} />
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }, fullBleed && styles.containerFullBleed, style]}>
      {/* Video Stream Surface */}
      <VideoView
        ref={videoViewRef}
        player={player}
        style={StyleSheet.absoluteFillObject}
        contentFit={contentFit}
        nativeControls={false}
      />

      {/* Touch Backdrop to Play / Pause directly on video tap */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTogglePlay}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      )}

      {/* Quick Sound Badge in Top-Right */}
      <TouchableOpacity
        onPress={handleToggleMute}
        style={styles.soundBadge}
        activeOpacity={0.8}
      >
        {isMuted ? (
          <>
            <VolumeX color="#FB7185" size={13} />
            <Text style={styles.soundBadgeTextMuted}>Sin sonido</Text>
          </>
        ) : (
          <>
            <Volume2 color="#34D399" size={13} />
            <Text style={styles.soundBadgeTextActive}>Audio activo</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Big Center Play / Pause Indicator & Interactive Button */}
      <View style={styles.centerIconWrapper} pointerEvents="box-none">
        {(!isPlaying || showCenterIcon) && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleTogglePlay}
            style={[
              styles.centerIconCircle,
              !isPlaying && styles.centerIconCirclePaused,
            ]}
          >
            {isPlaying ? (
              <Pause color="#FFFFFF" fill="#FFFFFF" size={30} />
            ) : (
              <Play color="#FFFFFF" fill="#FFFFFF" size={30} style={{ marginLeft: 3 }} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Sleek Minimal Progress Line when controls are hidden after 2s */}
      {!showControls && isPlaying && duration > 0 && (
        <View style={styles.miniProgressBarTrack} pointerEvents="none">
          <View
            style={[
              styles.miniProgressBarFill,
              { width: `${Math.min(100, Math.max(0, progressPercent))}%` },
            ]}
          />
        </View>
      )}

      {/* Emerald Themed Glass Controls Overlay */}
      {showControls && (
        <View style={styles.controlsOverlay}>
          {/* Progress Bar / Scrubber with dedicated PanResponder */}
          <View
            style={styles.progressBarContainer}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              setProgressBarWidth(w);
              progressBarWidthRef.current = w;
            }}
            {...seekPanResponder.panHandlers}
          >
            {isSeeking && (
              <View
                style={[
                  styles.floatingSeekBubble,
                  { left: `${Math.min(88, Math.max(8, progressPercent))}%` },
                ]}
              >
                <Text style={styles.floatingSeekText}>{formatTime(seekTime)}</Text>
              </View>
            )}
            <View style={[styles.progressBarTrack, isSeeking && styles.progressBarTrackActive]}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(100, Math.max(0, progressPercent))}%` },
                ]}
              />
            </View>
            <View
              style={[
                styles.scrubberThumb,
                isSeeking && styles.scrubberThumbActive,
                { left: `${Math.min(97, Math.max(0, progressPercent))}%` },
              ]}
            />
          </View>

          {/* Action Row */}
          <View style={styles.controlsRow}>
            <View style={styles.leftControls}>
              {/* Play/Pause Button */}
              <TouchableOpacity
                onPress={handleTogglePlay}
                style={styles.playBtn}
                activeOpacity={0.8}
              >
                {isPlaying ? (
                  <Pause color="#059669" fill="#059669" size={16} />
                ) : (
                  <Play color="#059669" fill="#059669" size={16} />
                )}
              </TouchableOpacity>

              {/* Time Indicator */}
              <View style={styles.timePill}>
                <Text style={styles.timeCurrent}>{formatTime(currentTime)}</Text>
                <Text style={styles.timeDivider}>/</Text>
                <Text style={styles.timeTotal}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Right Controls: Fullscreen */}
            <TouchableOpacity
              onPress={handleFullscreen}
              style={styles.fullscreenBtn}
              activeOpacity={0.8}
            >
              <Maximize2 color="#E2E8F0" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#020617',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerFullBleed: {
    borderRadius: 0,
    borderWidth: 0,
    marginVertical: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorContainer: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  errorText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  retryBtnText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  soundBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    zIndex: 20,
  },
  soundBadgeTextMuted: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },
  soundBadgeTextActive: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
  },
  centerIconWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 25,
  },
  centerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(5, 150, 105, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  centerIconCirclePaused: {
    backgroundColor: 'rgba(5, 150, 105, 0.95)',
    transform: [{ scale: 1.05 }],
  },
  miniProgressBarTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    zIndex: 25,
  },
  miniProgressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    zIndex: 30,
    gap: 8,
  },
  progressBarContainer: {
    height: 28,
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 6,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarTrackActive: {
    height: 6,
    backgroundColor: '#475569',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  scrubberThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6EE7B7',
    marginLeft: -6,
    top: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
  scrubberThumbActive: {
    width: 18,
    height: 18,
    borderRadius: 9,
    top: 5,
    marginLeft: -9,
    backgroundColor: '#34D399',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowRadius: 6,
    elevation: 6,
  },
  floatingSeekBubble: {
    position: 'absolute',
    top: -24,
    backgroundColor: 'rgba(5, 150, 105, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: -20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    zIndex: 40,
  },
  floatingSeekText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 3,
  },
  timeCurrent: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  timeDivider: {
    color: '#64748B',
    fontSize: 11,
  },
  timeTotal: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fullscreenBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
