"use client";

import { useState } from "react";

function isoToDigits(iso: string): string {
  return iso.replace(/-/g, "");
}

function digitsToDisplay(digits: string): string {
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);
  return [y, m, d].filter(Boolean).join(".");
}

function isValidCalendarDate(y: number, m: number, d: number): boolean {
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function digitsToIso(digits: string): string {
  if (digits.length !== 8) return "";
  const y = Number(digits.slice(0, 4));
  const m = Number(digits.slice(4, 6));
  const d = Number(digits.slice(6, 8));
  if (!isValidCalendarDate(y, m, d)) return "";
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

interface DateDigitsInputProps {
  value: string; // "YYYY-MM-DD" 형태의 초기값
  onChange: (isoDate: string) => void;
  className?: string;
  required?: boolean;
}

export function DateDigitsInput({
  value,
  onChange,
  className = "",
  required,
}: DateDigitsInputProps) {
  const [digits, setDigits] = useState(() => isoToDigits(value));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
    setDigits(raw);
    onChange(digitsToIso(raw));
  }

  const showInvalidHint = digits.length === 8 && digitsToIso(digits) === "";

  return (
    <div>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={digitsToDisplay(digits)}
        onChange={handleChange}
        placeholder="예: 20020330 (YYYYMMDD)"
        maxLength={10}
        className={className}
        required={required}
      />
      {showInvalidHint && (
        <p className="mt-1 text-xs text-red-600">올바른 날짜인지 확인해주세요.</p>
      )}
    </div>
  );
}
