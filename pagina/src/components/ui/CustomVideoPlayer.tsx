import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Eye,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayOnScroll?: boolean;
  viewsCount?: number;
  onPlay?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  initialTime?: number;
  onClickContainer?: (e: React.MouseEvent, currentTime: number) => void;
  isPaused?: boolean;
  defaultMuted?: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');
  return `${formattedMins}:${formattedSecs}`;
}

function formatViews(count: number): string {
  if (isNaN(count) || count <= 0) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return count.toLocaleString('es-ES');
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  poster,
  className,
  autoPlay = false,
  autoPlayOnScroll = false,
  viewsCount,
  onPlay,
  onTimeUpdate,
  onEnded,
  initialTime = 0,
  onClickContainer,
  isPaused = false,
  defaultMuted = true
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldResumeOnVisibleRef = useRef<boolean>(Boolean(autoPlay));

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(defaultMuted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showCenterIcon, setShowCenterIcon] = useState<'play' | 'pause' | null>(null);

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pause video if parent requests pause (e.g., when full screen modal is open)
  useEffect(() => {
    if (isPaused) {
      const v = videoRef.current;
      if (v && !v.paused) {
        v.pause();
        setIsPlaying(false);
      }
    }
  }, [isPaused]);

  // Apply initialTime position reliably when video is ready
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !initialTime || initialTime <= 0) return;

    const applyInitialTime = () => {
      try {
        if (Math.abs(v.currentTime - initialTime) > 0.5) {
          v.currentTime = initialTime;
          setCurrentTime(initialTime);
        }
      } catch (err) {
        console.warn("Error seeking to initialTime:", err);
      }
    };

    if (v.readyState >= 1) {
      applyInitialTime();
    } else {
      v.addEventListener('loadedmetadata', applyInitialTime, { once: true });
    }
  }, [initialTime, src]);

  // Handle explicit autoPlay when video is unpaused & ready
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const v = videoRef.current;
    if (!v) return;

    const playVideo = () => {
      v.muted = isMuted;
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          v.muted = true;
          v.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    };

    if (v.readyState >= 2) {
      playVideo();
    } else {
      v.addEventListener('canplay', playVideo, { once: true });
    }
  }, [autoPlay, isPaused, src, isMuted]);

  // IntersectionObserver: Pause video when scrolled off-screen, resume when scrolled back into view
  useEffect(() => {
    if (isPaused) return;

    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            // When entering view: only resume if it was playing before leaving screen, or if autoPlayOnScroll is enabled
            if (shouldResumeOnVisibleRef.current || autoPlayOnScroll) {
              if (video.paused && !video.ended) {
                video.muted = isMuted;
                video.volume = volume;
                video
                  .play()
                  .then(() => {
                    setIsPlaying(true);
                  })
                  .catch(() => {
                    // Fallback to muted playback if browser policy requires it
                    video.muted = true;
                    video.play().then(() => setIsPlaying(true)).catch(() => {});
                  });
              }
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.25) {
            // When leaving view: if currently playing, remember state and pause automatically
            if (!video.paused && !video.ended) {
              shouldResumeOnVisibleRef.current = true;
              video.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      {
        threshold: [0.1, 0.25, 0.4, 0.7]
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [autoPlayOnScroll, isMuted, volume, isPaused]);

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused || v.ended) {
      shouldResumeOnVisibleRef.current = true;
      v.muted = false;
      v.volume = volume || 0.8;
      setIsMuted(false);
      v.play()
        .then(() => {
          setIsPlaying(true);
          triggerCenterIcon('play');
          if (onPlay) onPlay();
        })
        .catch(() => {});
    } else {
      shouldResumeOnVisibleRef.current = false;
      v.pause();
      setIsPlaying(false);
      triggerCenterIcon('pause');
    }
  }, [volume, onPlay]);

  const triggerCenterIcon = (type: 'play' | 'pause') => {
    setShowCenterIcon(type);
    setTimeout(() => {
      setShowCenterIcon(null);
    }, 600);
  };

  // Time Updates
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v) {
      setCurrentTime(v.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(v.currentTime, v.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) {
      setDuration(v.duration);
      if (initialTime > 0 && v.currentTime < 1) {
        try {
          v.currentTime = initialTime;
        } catch {
          // ignore seek errors on initial metadata
        }
      }
    }
  };

  // Seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const v = videoRef.current;
    if (v) {
      v.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Volume & Mute
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    const v = videoRef.current;
    setVolume(newVol);
    if (v) {
      v.volume = newVol;
      v.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (isMuted) {
      v.muted = false;
      v.volume = volume || 1;
      setIsMuted(false);
    } else {
      v.muted = true;
      setIsMuted(true);
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    const c = containerRef.current;
    if (!c) return;

    if (!document.fullscreenElement) {
      if (c.requestFullscreen) {
        c.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto hide controls after mouse/touch idle
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2800);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => { setIsHovered(true); setShowControls(true); }}
      onMouseLeave={() => { setIsHovered(false); if (isPlaying) setShowControls(false); }}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      className={cn(
        'relative overflow-hidden bg-slate-950 group select-none shadow-lg transition-all duration-300 w-full flex flex-col items-center justify-center',
        isFullscreen
          ? 'fixed inset-0 z-[99999] h-screen w-screen rounded-none border-none bg-black max-w-none max-h-none'
          : 'rounded-2xl border border-slate-800/80',
        className
      )}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={isMuted}
        onClick={(e) => {
          if (onClickContainer) {
            onClickContainer(e, videoRef.current?.currentTime || 0);
          } else {
            togglePlay();
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          if (onPlay) onPlay();
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          shouldResumeOnVisibleRef.current = false;
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        className={cn(
          "w-full object-contain mx-auto cursor-pointer block bg-black transition-all",
          isFullscreen
            ? "h-full w-full max-h-screen max-w-screen flex-1 my-auto"
            : "h-auto max-h-[540px] md:max-h-[580px]"
        )}
        preload="metadata"
        playsInline
      />

      {/* Reel Sound Badge (Top-Right on Mobile & Desktop for Quick Mute/Unmute) */}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute top-3 right-3 z-30 bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer"
      >
        {isMuted ? (
          <>
            <VolumeX className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-[11px] text-slate-300">Sin sonido</span>
          </>
        ) : (
          <>
            <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[11px] text-emerald-300 font-bold">Audio activo</span>
          </>
        )}
      </button>

      {/* Big Animated Center Emerald Play/Pause Indicator */}
      {showCenterIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-gradient-to-br from-emerald-500/95 to-teal-700/95 backdrop-blur-md p-5 rounded-full text-white border border-emerald-300/50 animate-in zoom-in-50 fade-in duration-200 shadow-2xl shadow-emerald-500/50">
            {showCenterIcon === 'play' ? (
              <Play className="h-9 w-9 md:h-11 md:w-11 fill-white translate-x-0.5" />
            ) : (
              <Pause className="h-9 w-9 md:h-11 md:w-11 fill-white" />
            )}
          </div>
        </div>
      )}

      {/* Glassmorphism Controls Overlay - Emerald Theme & Mobile Responsive */}
      <div
        className={cn(
          'absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-3 md:p-4 transition-all duration-300 z-30 flex flex-col gap-2',
          showControls || !isPlaying || isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        )}
      >
        {/* Scrubber / Progress Bar with Larger Mobile Touch Hitbox */}
        <div className="relative group/scrubber flex items-center h-6 cursor-pointer">
          <div className="w-full bg-slate-800/90 h-1.5 md:h-2 rounded-full overflow-hidden relative group-hover/scrubber:h-2.5 transition-all">
            <div
              className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 h-full rounded-full transition-all duration-75 relative shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>

        {/* Action Controls Row - Mobile Friendly */}
        <div className="flex items-center justify-between text-white text-xs pt-0.5">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 md:p-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 transition-all backdrop-blur-md active:scale-95 cursor-pointer flex items-center justify-center min-h-[38px] min-w-[38px]"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-emerald-300" />
              ) : (
                <Play className="h-4 w-4 fill-emerald-300 translate-x-0.5" />
              )}
            </button>

            {/* Time Display */}
            <div className="font-mono text-[11px] font-semibold text-slate-300 flex items-center gap-1 bg-slate-900/70 px-2.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold">{formatTime(currentTime)}</span>
              <span className="text-slate-500">/</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Reproduction / Views Counter Badge */}
            {typeof viewsCount === 'number' && (
              <div
                className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-900 text-slate-300 px-2.5 py-1.5 rounded-xl border border-slate-800/90 backdrop-blur-md shadow-xs transition-colors select-none"
                title={`${viewsCount.toLocaleString('es-ES')} reproducciones`}
              >
                <Eye className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span className="font-bold text-slate-100 text-[11px] tabular-nums">
                  {formatViews(viewsCount)}
                </span>
                <span className="hidden xs:inline text-[10px] text-slate-400 font-medium">
                  {viewsCount === 1 ? 'reprod.' : 'reprod.'}
                </span>
              </div>
            )}
          </div>

          {/* Right Controls: Volume & Fullscreen */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Volume Control Slider (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center gap-1.5 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-rose-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-emerald-400" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all opacity-80 group-hover/vol:opacity-100"
              />
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 md:p-2.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 transition-all backdrop-blur-md cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
