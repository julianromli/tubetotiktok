"use client";

import { useEffect } from "react";
import { setFingerprintCookie } from "@/lib/utils/fingerprint";

export function FingerprintInitializer() {
  useEffect(() => {
    setFingerprintCookie();
  }, []);

  return null;
}
