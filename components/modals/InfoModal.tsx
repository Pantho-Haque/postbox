"use client";

import { Info, Keyboard, Puzzle } from "lucide-react";
import { useState } from "react";
import { ModalShell, ModalActions } from "@/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { KEYBINDINGS } from "@/constants";

const acordionItems = [
    {
      value: "keybindings",
      triggerIcon: <Keyboard size={12} className="text-cyan-500/50" />,
      triggerText: "Keybindings",
      content: <Keybindings />,
    },
    {
      value: "extension",
      triggerIcon: <Puzzle size={12} className="text-cyan-500/50" />,
      triggerText: "Localhost Extension",
      content: <LocalExtension />,
    },
  ];
  
export default function InfoModal() {
  const [open, setOpen] = useState(false);

  
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="modal-button-mini mt-auto mb-2"
      >
        <Info size={12} />
      </button>

      {open && (
        <ModalShell
          title="Hittable Info"
          subtitle=""
          onClose={() => setOpen(false)}
          size="md"
        >
          <div className="w-full font-mono overflow-y-auto">
            <Accordion type="multiple">
              {acordionItems.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger className="border-l border-b border-white/10">
                    <span className="flex items-center gap-2">
                      {item.triggerIcon}
                      {item.triggerText}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <ModalActions
            onCancel={() => setOpen(false)}
            onConfirm={() => setOpen(false)}
            confirmLabel="Got it"
          />
        </ModalShell>
      )}
    </>
  );
}

function Keybindings() {
  return (
    <div className="flex flex-col gap-2">
      {KEYBINDINGS.map(({ keys, description }) => (
        <div key={description} className="flex items-center justify-between">
          <span className="text-white/30">{description}</span>
          <div className="flex items-center gap-1">
            {keys.map((k, i) => (
              <span key={k} className="flex items-center gap-1">
                <kbd className="kbd">{k}</kbd>
                {i < keys.length - 1 && (
                  <span className="text-white/20 text-[10px]">+</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LocalExtension() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-white/30 leading-relaxed">
        To send requests to your local servers, install the Hittable browser
        extension.
      </p>
      <ol className="flex flex-col gap-1.5 text-white/30">
        {[
          "Download and unzip the extension",
          "Go to chrome://extensions",
          "Enable Developer mode",
          "Click Load unpacked → select the folder",
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-cyan-500/40 shrink-0">{i + 1}.</span>
            {step}
          </li>
        ))}
      </ol>
      <a
        href="https://github.com/pantho-haque/hittable-extension/releases/latest/download/hittable-extension.zip"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-md border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-[10px] font-semibold text-cyan-400 transition-colors hover:bg-cyan-500/10"
      >
        Download Extension
      </a>
    </div>
  );
}
