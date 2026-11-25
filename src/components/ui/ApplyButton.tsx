"use client";

import SlidingCircleButton, { type SlidingCircleButtonProps } from "./ViewAllButton";

/** Compact Apply variant of the shared sliding-circle interaction. */
export default function ApplyButton(props: SlidingCircleButtonProps) {
  return <SlidingCircleButton label="Apply" width={120} height={44} fontSize={16} {...props} />;
}
