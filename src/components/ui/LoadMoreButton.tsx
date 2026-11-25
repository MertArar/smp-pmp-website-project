"use client";

import ApplyButton from "./ApplyButton";
import type { SlidingCircleButtonProps } from "./ViewAllButton";

/** Same sliding orb as Apply, sized for the certificate list. */
export default function LoadMoreButton({ className = "", ...props }: SlidingCircleButtonProps) {
  return <ApplyButton
    label="Load More"
    width="var(--load-more-width)"
    height="var(--load-more-height)"
    fontSize="var(--load-more-font-size)"
    className={`cursor-pointer [--load-more-width:170px] [--load-more-height:44px] [--load-more-font-size:15px] md:[--load-more-height:43px] xl:[--load-more-width:calc(170*var(--compliance-unit,1px))] xl:[--load-more-height:calc(43*var(--compliance-unit,1px))] xl:[--load-more-font-size:calc(15*var(--compliance-unit,1px))] ${className}`}
    {...props}
  />;
}
