"use client";

import {
  useEffect,
  useState,
} from "react";

import { ModalActions, ModalShell } from "@/components";
import { EXTENSION_URL } from "@/config";

export default function NoExtensionModal({
  checked,
  available,
}: {
  checked: boolean;
  available: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkExtension = () => {
      if (checked && !available) {
        console.error("Extension not available");
        setOpen(true);
      }
    };
    checkExtension();
  }, [checked, available]);

  return (
    <>
      {open && (
        <ModalShell
          title={`No Extension Found`}
          subtitle={`To get connected to localhost make sure to install Hittable Extension`}
          onClose={() => setOpen(false)}
          isOnBlurPressClose={false}
        >
          <ol className="text-xs text-white/50 space-y-1">
            <li>1. Download and unzip the extension</li>
            <li>2. Go to <code>chrome://extensions</code></li>
            <li>3. Enable <strong>Developer mode</strong></li>
            <li>4. Click <strong>Load unpacked</strong> → select the folder</li>
          </ol>
          <ModalActions
            onCancel={() => setOpen(false)}
            onConfirm={() => {
              window.open(EXTENSION_URL, "_blank");
            }}
            confirmLabel="Download"
            cancelLabel="Close"
            confirmDanger
          />
        </ModalShell>
      )}
    </>
  );
}
