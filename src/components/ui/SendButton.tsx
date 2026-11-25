"use client";

import ApplyButton from "./ApplyButton";
import type { SlidingCircleButtonProps } from "./ViewAllButton";

/** Apply's interaction with the existing consultation form dimensions. */
export default function SendButton({ className = "", ...props }: SlidingCircleButtonProps) {
  return <ApplyButton
    type="submit"
    label="Send"
    width="var(--send-button-width)"
    height="var(--send-button-height)"
    fontSize="var(--send-button-font-size)"
    className={`cursor-pointer self-center [--send-button-width:calc(141*var(--industry-unit,1px))] [--send-button-height:44px] [--send-button-font-size:calc(15*var(--industry-unit,1px))] md:self-auto md:[--send-button-height:calc(43*var(--industry-unit,1px))] ${className}`}
    {...props}
  />;
}
