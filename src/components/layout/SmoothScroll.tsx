"use client";

import { useEffect } from "react";
import { startSmoothScroll } from "@/lib/smoothScroll";

export default function SmoothScroll() {
  useEffect(startSmoothScroll, []);
  return null;
}
