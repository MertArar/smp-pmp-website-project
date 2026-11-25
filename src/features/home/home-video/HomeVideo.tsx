"use client";

import { useHomeCompact } from "../HomeMobileSections";

import HomeMediaVideo from "@/features/home/HomeMediaVideo";

import Image from "next/image";

import NewsletterSubscription from "./NewsletterSubscription";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

type VideoQuality = "HD" | "720p" | "SD";

const qualityOptions: VideoQuality[] = ["HD", "720p", "SD"];

function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(seconds);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const secs = totalSeconds % 60;

  return [hours, minutes, secs]

    .map((value) => String(value).padStart(2, "0"))

    .join(":");
}

export default function HomeVideo() {
  const compact = useHomeCompact();
  const [activeQuality, setActiveQuality] = useState<VideoQuality>("HD");

  const [volume, setVolume] = useState(75);

  const [isMuted, setIsMuted] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);

  const [hasStarted, setHasStarted] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const frameRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef<HTMLDivElement>(null);

  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressThumbRef = useRef<HTMLDivElement>(null);
  const renderedSecondRef = useRef(-1);

  const animationRef = useRef<number | null>(null);

  const draggingRef = useRef(false);

  const activeIndex = qualityOptions.indexOf(activeQuality);

  // Visibility

  const showControls = compact || (hasStarted && (isHovered || isFullscreen || !isPlaying));

  const showCenterPlay = !compact && !hasStarted;

  // SMOOTH PROGRESS

  const syncProgress = useCallback((time: number) => {
    const length = videoRef.current?.duration ?? 0;
    const percent = Number.isFinite(length) && length > 0
      ? Math.min(100, Math.max(0, time / length * 100)) : 0;
    if (progressFillRef.current) progressFillRef.current.style.width = `${percent}%`;
    if (progressThumbRef.current) progressThumbRef.current.style.left = `${percent}%`;
    const second = Math.floor(time);
    if (renderedSecondRef.current !== second) {
      renderedSecondRef.current = second;
      setCurrentTime(second);
    }
  }, []);

  const updateProgress = useCallback(function tickProgress() {
    const video = videoRef.current;

    if (!video) return;

    if (!draggingRef.current) {
      syncProgress(video.currentTime);
    }

    if (!video.paused && !video.ended) {
      animationRef.current = requestAnimationFrame(tickProgress);
    }
  }, [syncProgress]);

  const stopProgressAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);

      animationRef.current = null;
    }
  }, []);

  const startProgressAnimation = useCallback(() => {
    stopProgressAnimation();

    animationRef.current = requestAnimationFrame(updateProgress);
  }, [stopProgressAnimation, updateProgress]);

  useEffect(() => {
    return () => {
      stopProgressAnimation();
    };
  }, [stopProgressAnimation]);

  // FULLSCREEN LISTENER

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // VIDEO METADATA

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    setDuration(Number.isFinite(video.duration) ? video.duration : 0);

    syncProgress(video.currentTime);

    video.volume = volume / 100;
  };

  const handleDurationChange = () => {
    const video = videoRef.current;

    if (!video) return;

    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
  };

  // SEEK

  const seekToPointer = (clientX: number) => {
    const video = videoRef.current;

    const bar = progressRef.current;

    if (!video || !bar || duration <= 0) return;

    const rect = bar.getBoundingClientRect();

    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

    const nextTime = ratio * duration;

    video.currentTime = nextTime;

    syncProgress(nextTime);
  };

  const handleProgressPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (duration <= 0) return;

    draggingRef.current = true;

    event.currentTarget.setPointerCapture(event.pointerId);

    seekToPointer(event.clientX);
  };

  const handleProgressPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!draggingRef.current) return;

    seekToPointer(event.clientX);
  };

  const handleProgressPointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!draggingRef.current) return;

    seekToPointer(event.clientX);

    draggingRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleProgressKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current;

    if (!video || duration <= 0) return;

    let nextTime = video.currentTime;

    switch (event.key) {
      case "ArrowRight":
        nextTime += 5;

        break;

      case "ArrowLeft":
        nextTime -= 5;

        break;

      case "Home":
        nextTime = 0;

        break;

      case "End":
        nextTime = duration;

        break;

      default:
        return;
    }

    event.preventDefault();

    video.currentTime = Math.max(0, Math.min(duration, nextTime));

    syncProgress(video.currentTime);
  };

  // PLAY / PAUSE

  const handlePlayPause = async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.error("Video playback error:", error);
      }
    } else {
      video.pause();
    }
  };

  // PREVIOUS / NEXT

  const handleSkip = (seconds: number) => {
    const video = videoRef.current;

    if (!video || duration <= 0) return;

    const nextTime = Math.max(
      0,

      Math.min(duration, video.currentTime + seconds),
    );

    video.currentTime = nextTime;

    syncProgress(nextTime);
  };

  // FULLSCREEN

  const handleFullscreen = async () => {
    const frame = frameRef.current;

    if (!frame) return;

    try {
      if (document.fullscreenElement === frame) {
        await document.exitFullscreen();
      } else {
        await frame.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // MUTE / UNMUTE

  const handleMuteToggle = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.muted && video.volume === 0) {
      video.volume = 0.75;
    }

    video.muted = !video.muted;
  };

  // VOLUME CONTROL

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;

    const value = Math.max(0, Math.min(100, newVolume));

    setVolume(value);

    setIsMuted(value === 0);

    if (video) {
      video.volume = value / 100;

      video.muted = value === 0;
    }
  };

  // SHARED VISIBILITY STYLES

  const topOverlayStyle = {
    opacity: showControls ? 1 : 0,

    transform: showControls ? "translateY(0)" : "translateY(-12px)",

    transition:
      "opacity 450ms ease, transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",

    pointerEvents: showControls ? ("auto" as const) : ("none" as const),
  };

  const bottomOverlayStyle = {
    opacity: showControls ? 1 : 0,

    transform: showControls ? "translateY(0)" : "translateY(16px)",

    transition:
      "opacity 450ms ease, transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",

    pointerEvents: showControls ? ("auto" as const) : ("none" as const),
  };

  return (
    <section
      id="home-video"
      className="relative isolate w-full overflow-hidden"
      style={{
        backgroundColor: "#D1E8F6",
        backgroundImage:
          "linear-gradient(90deg, #D5EAF7 0%, #D1E8F6 48%, #C6E0F7 68%, #AFCDF9 90%, #BBD7FC 100%)",
      }}
    >
      {/* SOCIALMEDIA → HOMEVIDEO BACKGROUND BLEND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundColor: "#D8EDF8",
          backgroundImage: `

          radial-gradient(

            ellipse 65% 75% at 78% 78%,

            rgba(128, 167, 250, 0.64) 0%,

            rgba(157, 191, 252, 0.38) 45%,

            transparent 100%

          ),

          radial-gradient(

            ellipse 55% 65% at 48% 55%,

            rgba(178, 210, 251, 0.60) 0%,

            transparent 100%

          ),

          linear-gradient(

            110deg,

            #D9EFF8 0%,

            #D4EAF9 44%,

            #BCD6FA 100%

          )

        `,
          maskImage:
            "linear-gradient(to bottom, transparent 0px, transparent 40px, black 520px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0px, transparent 40px, black 520px)",
        }}
      />

      {/* MAIN CONTAINER */}

      <div
        className="

          relative
          z-10

          mx-auto

          w-[calc(100%-40px)]

          max-w-[1600px]

          pt-[80px]

          pb-[100px]

          md:w-[83.333333%]

          lg:pt-[140px]

          lg:pb-[140px]

        "
      >
        {/* VIDEO FRAME */}

        <div
          ref={frameRef}
          data-home-video-frame
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsHovered(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsHovered(false);
            }
          }}
          className="

            relative

            aspect-[1200/583]

            w-full

            overflow-hidden

            rounded-[40px]

            bg-[#27272A]

            fullscreen:aspect-auto

            fullscreen:h-screen

            fullscreen:w-screen

            fullscreen:rounded-none

          "
        >
          {/* VIDEO */}

          <HomeMediaVideo
            ref={videoRef}
            className="

              absolute

              inset-0

              h-full

              w-full

              object-cover

            "
            preload="metadata"
            muted
            playsInline
            loop
            disablePictureInPicture
            onLoadedMetadata={handleLoadedMetadata}
            onDurationChange={handleDurationChange}
            onTimeUpdate={(event) => {
              if (!draggingRef.current) {
                syncProgress(event.currentTarget.currentTime);
              }
            }}
            onPlay={() => {
              // Cached metadata may have arrived before React hydrated the video.
              handleLoadedMetadata();
              setIsPlaying(true);

              setHasStarted(true);

              startProgressAnimation();
            }}
            onPause={() => {
              setIsPlaying(false);

              stopProgressAnimation();
            }}
            onEnded={() => {
              setIsPlaying(false);

              stopProgressAnimation();
            }}
            onVolumeChange={(event) => {
              const video = event.currentTarget;

              setIsMuted(video.muted);

              setVolume(Math.round(video.volume * 100));
            }}
          >
            <source src="/home/home-video/home-video.webm" type="video/webm" />
          </HomeMediaVideo>

          {/* DARK OVERLAY - ONLY ON HOVER */}

          <div
            className="

              pointer-events-none

              absolute

              inset-0

              z-[1]

            "
            style={{
              backgroundColor: "rgba(39, 39, 42, 0.65)",

              opacity: showControls ? 1 : 0,

              transition: "opacity 500ms ease",
            }}
          />

          {/* TOP LEFT ICON */}

          <div
            className="

              pointer-events-none

              absolute

              z-10

              left-[2.6667%]

              top-[4.9743%]

              aspect-square

              w-[3.4167%]

            "
            style={topOverlayStyle}
          >
            <Image
              src="/home/home-video/video-arrow.png"
              alt=""
              fill
              sizes="55px"
              className="object-contain"
              draggable={false}
            />
          </div>

          {/* VIDEO TITLE */}

          <h2
            className="

              pointer-events-none

              absolute

              z-10

              m-0

              text-white

            "
            style={{
              top: "20.5832%",

              left: "3.4167%",

              width: "40.3333%",

              fontFamily: "var(--font-sf-pro), sans-serif",

              fontSize: "clamp(22px, 3.4722vw, 66.67px)",

              fontWeight: 410,

              fontStretch: "expanded",

              lineHeight: 1,

              letterSpacing: 0,

              ...topOverlayStyle,
            }}
          >
            Watch the
            <br />
            Promotional Video
          </h2>

          {/* VIDEO QUALITY SELECTOR */}

          <div
            className="absolute z-20"
            style={{
              top: "23.4991%",

              right: "3.6667%",

              width: "5.8333%",

              ...topOverlayStyle,
            }}
          >
            <div
              className="relative grid grid-rows-3"
              style={{
                gap: "clamp(6px, 0.5556vw, 10.67px)",
              }}
            >
              {qualityOptions.map((quality) => {
                const isActive = activeQuality === quality;

                return (
                  <button
                    key={quality}
                    type="button"
                    onClick={() => setActiveQuality(quality)}
                    aria-pressed={isActive}
                    className="

            relative

            flex

            w-full

            cursor-pointer

            items-center

            justify-center

            border-0

            text-white

            outline-none

            focus-visible:ring-2

            focus-visible:ring-white/80

          "
                    style={{
                      aspectRatio: "70 / 41",

                      borderRadius: "13.33px",

                      fontFamily: "var(--font-sf-pro), sans-serif",

                      fontSize: "clamp(10px, 1.0417vw, 20px)",

                      fontWeight: 410,

                      lineHeight: 1,

                      letterSpacing: 0,

                      background: isActive
                        ? "linear-gradient(180deg, #005EFF 0%, #001EA2 100%)"
                        : "rgba(255,255,255,0.20)",

                      backdropFilter: "blur(17.87px)",

                      WebkitBackdropFilter: "blur(17.87px)",

                      transition: "none",
                    }}
                  >
                    {quality}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM GLASS PANEL */}

          <div
            className="

              pointer-events-none

              absolute

              inset-x-0

              bottom-0

              z-10

            "
            style={{
              height: "21.7839%",

              backgroundColor: "rgba(255,255,255,0.10)",

              backdropFilter: "blur(44px)",

              WebkitBackdropFilter: "blur(44px)",

              ...bottomOverlayStyle,
            }}
          />

          {/* SMOOTH VIDEO PROGRESS BAR */}

          <div
            ref={progressRef}
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            aria-valuetext={formatVideoTime(currentTime)}
            tabIndex={showControls && duration > 0 ? 0 : -1}
            onPointerDown={handleProgressPointerDown}
            onPointerMove={handleProgressPointerMove}
            onPointerUp={handleProgressPointerUp}
            onPointerCancel={() => {
              draggingRef.current = false;
            }}
            onKeyDown={handleProgressKeyDown}
            className="

              absolute

              left-0

              z-20

              w-full

              cursor-pointer

              touch-none

              focus-visible:outline-2

              focus-visible:outline-white

            "
            style={{
              top: "77.18697%",

              height: "1.02916%",

              opacity: showControls ? 1 : 0,

              transition: "opacity 450ms ease",

              pointerEvents: showControls ? "auto" : "none",
            }}
          >
            {/* FULL TRACK */}

            <div
              className="absolute inset-0"
              style={{
                backgroundColor: "#9EB7D0",
              }}
            />

            {/* WATCHED PROGRESS */}

            <div
              ref={progressFillRef}
              className="

                absolute

                inset-y-0

                left-0

              "
              style={{
                width: "0%",

                backgroundColor: "#4687B8",
              }}
            />

            {/* THUMB */}

            <div
              ref={progressThumbRef}
              className="

                pointer-events-none

                absolute

                z-10

                rounded-full

              "
              style={{
                left: "0%",

                top: "50%",

                transform: "translate(-50%, -50%)",

                width: "2.5%",

                aspectRatio: "1",

                background: "linear-gradient(145deg, #0D5792, #0058F0)",

                padding: "1px",

                boxShadow: "0 0 38.67px #0058F0",
              }}
            >
              <div
                className="

                  relative

                  flex

                  h-full

                  w-full

                  items-center

                  justify-center

                  rounded-full

                "
                style={{
                  backgroundColor: "#0058F0",
                }}
              >
                <div
                  className="

                    flex

                    items-center

                    justify-center

                    rounded-full

                  "
                  style={{
                    width: "66.6667%",

                    height: "66.6667%",

                    padding: "1px",

                    background: "linear-gradient(145deg, #0D5792, #0058F0)",
                  }}
                >
                  <div
                    className="

                      h-full

                      w-full

                      rounded-full

                    "
                    style={{
                      backgroundColor: "rgba(255,255,255,0.20)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CURRENT TIME */}

          <span
            className="

              pointer-events-none

              absolute

              z-20

              block

              text-white

            "
            style={{
              left: "2.6667%",

              top: "81.1321%",

              width: "5.3333%",

              height: "2.4014%",

              fontFamily: "var(--font-sf-pro), sans-serif",

              fontSize: "clamp(9px, 0.8333vw, 16px)",

              fontWeight: 410,

              lineHeight: 1,

              whiteSpace: "nowrap",

              fontVariantNumeric: "tabular-nums",

              ...bottomOverlayStyle,
            }}
          >
            {formatVideoTime(currentTime)}
          </span>

          {/* TOTAL TIME */}

          <span
            className="

              pointer-events-none

              absolute

              z-20

              block

              text-white

            "
            style={{
              left: "91.4167%",

              top: "81.1321%",

              width: "5.3333%",

              height: "2.4014%",

              fontFamily: "var(--font-sf-pro), sans-serif",

              fontSize: "clamp(9px, 0.8333vw, 16px)",

              fontWeight: 410,

              lineHeight: 1,

              whiteSpace: "nowrap",

              textAlign: "right",

              fontVariantNumeric: "tabular-nums",

              ...bottomOverlayStyle,
            }}
          >
            {formatVideoTime(duration)}
          </span>

          {/* SEMPA ICON */}

          <div
            className="

              pointer-events-none

              absolute

              z-20

            "
            style={{
              left: "2.8333%",

              top: "86.6209%",

              width: "4.1667%",

              height: "5.8319%",

              ...bottomOverlayStyle,
            }}
          >
            <Image
              src="/home/home-video/sempa-icon.png"
              alt="Sempa"
              fill
              sizes="67px"
              className="object-contain"
              draggable={false}
            />
          </div>

          {/* VIDEO DESCRIPTION */}

          <p
            className="

              pointer-events-none

              absolute

              z-20

              m-0

              text-nowrap

            "
            style={{
              left: "7.75%",

              top: "86.96398%",

              width: "21.25%",

              height: "5.1458%",

              fontFamily: "var(--font-sf-pro), sans-serif",

              fontSize: "clamp(9px, 1.04167vw, 20px)",

              fontWeight: 410,

              lineHeight: 1,

              color: "#9EB7D0",

              ...bottomOverlayStyle,
            }}
          >
            Sempa Pump Manufacturing
            <br />
            Plant Promotional Video
          </p>

          {/* PREVIOUS BUTTON */}

          <button
            type="button"
            onClick={() => handleSkip(-10)}
            aria-label="10 seconds backward"
            tabIndex={showControls ? 0 : -1}
            className="

              absolute

              z-30

              cursor-pointer

              border-0

              bg-transparent

              p-0

              hover:scale-110

              focus-visible:outline-2

              focus-visible:outline-white

            "
            style={{
              left: "42.0833%",

              top: "88.5077%",

              width: "1.5833%",

              height: "2.9159%",

              ...bottomOverlayStyle,
            }}
          >
            <Image
              src="/home/home-video/previous.png"
              alt=""
              fill
              sizes="26px"
              className="object-contain"
              draggable={false}
            />
          </button>

          {/* NEXT BUTTON */}

          <button
            type="button"
            onClick={() => handleSkip(10)}
            aria-label="10 seconds forward"
            tabIndex={showControls ? 0 : -1}
            className="

              absolute

              z-30

              cursor-pointer

              border-0

              bg-transparent

              p-0

              hover:scale-110

              focus-visible:outline-2

              focus-visible:outline-white

            "
            style={{
              left: "56.1667%",

              top: "88.5077%",

              width: "1.5833%",

              height: "2.9159%",

              ...bottomOverlayStyle,
            }}
          >
            <Image
              src="/home/home-video/next.png"
              alt=""
              fill
              sizes="26px"
              className="object-contain"
              draggable={false}
            />
          </button>

          {/* INITIAL CENTER PLAY BUTTON */}

          <button
            type="button"
            onClick={handlePlayPause}
            aria-label="Play video"
            tabIndex={showCenterPlay ? 0 : -1}
            className="

              group

              absolute

              z-40

              flex

              cursor-pointer

              items-center

              justify-center

              rounded-full

              border-0

              p-0

              focus-visible:ring-2

              focus-visible:ring-white

            "
            style={{
              left: "50%",

              top: "50%",

              width: "6.3333%",

              aspectRatio: "1 / 1",

              padding: "1.33px",

              background: "linear-gradient(145deg, #0D5792 0%, #0058F0 100%)",

              boxShadow: "0 0 38.67px rgba(0,88,240,0.75)",

              opacity: showCenterPlay ? 1 : 0,

              transform: showCenterPlay
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.65)",

              transition:
                "opacity 350ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1)",

              pointerEvents: showCenterPlay ? "auto" : "none",
            }}
          >
            <span
              className="

                relative

                flex

                h-full

                w-full

                items-center

                justify-center

                rounded-full

              "
              style={{
                background: "linear-gradient(145deg, #205CB1 0%, #173885 100%)",
              }}
            >
              <span
                className="

                  relative

                  flex

                  h-[66%]

                  w-[66%]

                  items-center

                  justify-center

                  rounded-full

                  border

                  border-[#86B4F0]/70

                  bg-white/20

                  backdrop-blur-md

                  transition-colors

                  duration-300

                  group-hover:bg-white/30

                "
              >
                <svg
                  width="42%"
                  height="42%"
                  viewBox="0 0 30 34"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 2.5C4 1.1 5.6 0.3 6.8 1L28 14.5C29.2 15.3 29.2 17.1 28 17.9L6.8 31.4C5.6 32.2 4 31.3 4 29.9V2.5Z"
                    fill="#F7F7F7"
                  />
                </svg>
              </span>
            </span>
          </button>

          {/* BOTTOM PLAY / PAUSE BUTTON */}

          <button
            type="button"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            tabIndex={showControls ? 0 : -1}
            className="

              group

              absolute

              z-30

              flex

              cursor-pointer

              items-center

              justify-center

              rounded-full

              border-0

              p-0

              outline-none

              focus-visible:ring-2

              focus-visible:ring-white

            "
            style={{
              left: "46.75%",

              top: "83.5334%",

              width: "6.3333%",

              aspectRatio: "1 / 1",

              padding: "1.33px",

              background: "linear-gradient(145deg, #0D5792 0%, #0058F0 100%)",

              boxShadow: "0 0 38.67px rgba(0,88,240,0.75)",

              ...bottomOverlayStyle,
            }}
          >
            <span
              className="

                relative

                flex

                h-full

                w-full

                items-center

                justify-center

                rounded-full

              "
              style={{
                background: "linear-gradient(145deg, #205CB1 0%, #173885 100%)",
              }}
            >
              <span
                className="

                  relative

                  flex

                  h-[66%]

                  w-[66%]

                  items-center

                  justify-center

                  rounded-full

                  border

                  border-[#86B4F0]/70

                  bg-white/20

                  backdrop-blur-md

                  transition-colors

                  duration-300

                  group-hover:bg-white/30

                "
              >
                {/* PLAY */}

                <span
                  className="

                    absolute

                    flex

                    items-center

                    justify-center

                    transition-all

                    duration-300

                  "
                  style={{
                    opacity: isPlaying ? 0 : 1,

                    transform: isPlaying ? "scale(0.5)" : "scale(1)",
                  }}
                >
                  <svg
                    width="30"
                    height="34"
                    viewBox="0 0 30 34"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 2.5C4 1.1 5.6 0.3 6.8 1L28 14.5C29.2 15.3 29.2 17.1 28 17.9L6.8 31.4C5.6 32.2 4 31.3 4 29.9V2.5Z"
                      fill="#F7F7F7"
                    />
                  </svg>
                </span>

                {/* PAUSE */}

                <span
                  className="

                    absolute

                    flex

                    items-center

                    justify-center

                    transition-all

                    duration-300

                  "
                  style={{
                    opacity: isPlaying ? 1 : 0,

                    transform: isPlaying ? "scale(1)" : "scale(0.5)",
                  }}
                >
                  <svg
                    width="30"
                    height="34"
                    viewBox="0 0 30 34"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="5"
                      y="4"
                      width="7"
                      height="26"
                      rx="2"
                      fill="#F7F7F7"
                    />

                    <rect
                      x="18"
                      y="4"
                      width="7"
                      height="26"
                      rx="2"
                      fill="#F7F7F7"
                    />
                  </svg>
                </span>
              </span>
            </span>
          </button>

          {/* VOLUME CONTROL */}

          <div
            className="

              absolute

              z-30

              flex

              items-center

            "
            style={{
              right: "7.75%",

              top: "86.96398%",

              width: "14.1667%",

              height: "5.6604%",

              borderRadius: "13.33px",

              backgroundColor: "rgba(255,255,255,0.20)",

              backdropFilter: "blur(17.87px)",

              WebkitBackdropFilter: "blur(17.87px)",

              padding: "0 12px",

              gap: "10px",

              ...bottomOverlayStyle,
            }}
          >
            {/* SOUND ICON */}

            <button
              type="button"
              onClick={handleMuteToggle}
              aria-label={isMuted ? "Unmute" : "Mute"}
              tabIndex={showControls ? 0 : -1}
              className="

                relative

                flex

                shrink-0

                cursor-pointer

                items-center

                justify-center

                border-0

                bg-transparent

                p-0

                transition-opacity

                duration-200

                hover:opacity-75

              "
              style={{
                width: "26.67px",

                height: "21.33px",

                opacity: isMuted ? 0.6 : 1,
              }}
            >
              <Image
                src="/home/home-video/sound.png"
                alt=""
                fill
                sizes="27px"
                className="object-contain"
                draggable={false}
              />

              {isMuted && (
                <span
                  className="

                    pointer-events-none

                    absolute

                  "
                  style={{
                    width: "28px",

                    height: "2px",

                    borderRadius: "2px",

                    backgroundColor: "#F7F7F7",

                    transform: "rotate(-45deg)",

                    boxShadow: "0 0 2px rgba(0,0,0,0.8)",
                  }}
                />
              )}
            </button>

            {/* VOLUME SLIDER */}

            <div
              className="

                relative

                min-w-0

                flex-1

              "
              style={{
                height: "24px",
              }}
            >
              {/* FULL BAR */}

              <div
                className="

                  pointer-events-none

                  absolute

                  left-0

                  right-0

                  top-1/2

                  -translate-y-1/2

                  rounded-full

                "
                style={{
                  height: "7px",

                  backgroundColor: "#9EB7D0",
                }}
              />

              {/* ACTIVE BAR */}

              <div
                className="

                  pointer-events-none

                  absolute

                  left-0

                  top-1/2

                  -translate-y-1/2

                  rounded-full

                "
                style={{
                  width: `${isMuted ? 0 : volume}%`,

                  height: "7px",

                  backgroundColor: "#4687B8",
                }}
              />

              {/* VOLUME THUMB */}

              <div
                className="

                  pointer-events-none

                  absolute

                  z-10

                  rounded-full

                "
                style={{
                  left: `${isMuted ? 0 : volume}%`,

                  top: "50%",

                  width: "24px",

                  height: "24px",

                  transform: "translate(-50%, -50%)",

                  background:
                    "linear-gradient(180deg, #005EFF 0%, #001EA2 100%)",

                  boxShadow: "0 0 38.67px rgba(0,88,240,0.65)",
                }}
              >
                <div
                  className="

                    absolute

                    rounded-full

                  "
                  style={{
                    width: "16px",

                    height: "16px",

                    left: "50%",

                    top: "50%",

                    transform: "translate(-50%, -50%)",

                    padding: "1.33px",

                    background:
                      "linear-gradient(145deg, #0D5792 0%, #0058F0 100%)",
                  }}
                >
                  <div
                    className="

                      h-full

                      w-full

                      rounded-full

                    "
                    style={{
                      backgroundColor: "rgba(255,255,255,0.20)",
                    }}
                  />
                </div>
              </div>

              {/* RANGE INPUT */}

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={isMuted ? 0 : volume}
                onChange={(event) =>
                  handleVolumeChange(Number(event.target.value))
                }
                aria-label="Volume"
                tabIndex={showControls ? 0 : -1}
                className="

                  absolute

                  inset-0

                  z-20

                  h-full

                  w-full

                  cursor-pointer

                  appearance-none

                  bg-transparent



                  [&::-webkit-slider-runnable-track]:h-[7px]

                  [&::-webkit-slider-runnable-track]:bg-transparent



                  [&::-webkit-slider-thumb]:h-[24px]

                  [&::-webkit-slider-thumb]:w-[24px]

                  [&::-webkit-slider-thumb]:appearance-none

                  [&::-webkit-slider-thumb]:rounded-full

                  [&::-webkit-slider-thumb]:bg-transparent



                  [&::-moz-range-track]:h-[7px]

                  [&::-moz-range-track]:bg-transparent



                  [&::-moz-range-thumb]:h-[24px]

                  [&::-moz-range-thumb]:w-[24px]

                  [&::-moz-range-thumb]:border-0

                  [&::-moz-range-thumb]:bg-transparent

                "
              />
            </div>
          </div>

          {/* FULLSCREEN BUTTON */}

          <button
            type="button"
            onClick={handleFullscreen}
            aria-label="Toggle fullscreen"
            tabIndex={showControls ? 0 : -1}
            className="

              absolute

              z-30

              cursor-pointer

              border-0

              bg-transparent

              p-0

              hover:scale-110

              focus-visible:outline-2

              focus-visible:outline-white

            "
            style={{
              left: "93.9167%",

              top: "86.96398%",

              width: "2.8333%",

              height: "5.8319%",

              ...bottomOverlayStyle,
            }}
          >
            <Image
              src="/home/home-video/full-screen-icon.png"
              alt=""
              fill
              sizes="46px"
              className="object-contain"
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* NEWSLETTER SUBSCRIPTION */}

      <NewsletterSubscription />
    </section>
  );
}
