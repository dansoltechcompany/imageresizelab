"use client";

import {
  useCallback,
  useRef,
  useState,
  type DragEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

export function Dropzone({
  accept,
  multiple = false,
  hint,
  compact = false,
  onFiles,
}: {
  accept: string;
  multiple?: boolean;
  hint?: string;
  compact?: boolean;
  onFiles: (files: File[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [hot, setHot] = useState(false);

  const take = useCallback(
    (list: FileList | File[] | null) => {
      if (!list || list.length === 0) return;
      onFiles(Array.from(list));
    },
    [onFiles],
  );

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setHot(false);
    take(e.dataTransfer.files);
  }

  const fileInput = (
    <input
      ref={input}
      type="file"
      accept={accept}
      multiple={multiple}
      className="hidden"
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        take(e.target.files);
        e.target.value = "";
      }}
    />
  );

  if (compact) {
    return (
      <div
        className={`mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
          hot ? "border-[var(--magenta)] bg-[var(--chip)]" : "border-[var(--rule)] bg-[var(--paper)]"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setHot(true);
        }}
        onDragLeave={() => setHot(false)}
        onDrop={onDrop}
      >
        <p className="text-sm text-[var(--muted)]">
          {multiple ? "Files loaded in this tab." : "Image loaded in this tab."} Drop to replace.
        </p>
        <button
          type="button"
          className="rounded-[10px] border border-[var(--rule)] bg-white px-4 py-2 text-sm font-semibold"
          onClick={() => input.current?.click()}
        >
          Replace file{multiple ? "s" : ""}
        </button>
        {fileInput}
      </div>
    );
  }

  return (
    <div
      className={`dropzone cursor-pointer rounded-2xl px-5 py-10 text-center ${hot ? "dropzone-hot" : ""}`}
      role="button"
      tabIndex={0}
      onDragOver={(e) => {
        e.preventDefault();
        setHot(true);
      }}
      onDragLeave={() => setHot(false)}
      onDrop={onDrop}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          input.current?.click();
        }
      }}
    >
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--chip)] text-[var(--magenta)]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 16V4m0 0 4 4M12 4 8 8M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className="mt-4 font-display text-2xl">Drop an image</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {hint ?? "Or click to browse. The file stays in this tab."}
      </p>
      <span className="btn-primary mt-5 inline-block px-5 py-2.5">
        Choose file{multiple ? "s" : ""}
      </span>
      {fileInput}
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg bg-[var(--paper)] px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-0.5 break-all font-medium tabular-nums">{value}</p>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm text-[var(--muted)]">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`control ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`control ${props.className ?? ""}`}
    />
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{message}</p>
  );
}
