"use client";

import { useEffect, useState } from "react";
import { generateQrDataUrl } from "@/lib/qrcode";
import { Card } from "@/components/ui/Card";

export function QrShareCard({ url }: { url: string }) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    generateQrDataUrl(url).then((dataUrl) => {
      if (!cancelled) setQrDataUrl(dataUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <Card className="flex flex-col items-center gap-3 text-center">
      {qrDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrDataUrl}
          alt="휴대폰으로 스캔하는 QR 코드"
          width={180}
          height={180}
          className="rounded-lg"
        />
      ) : (
        <div className="h-[180px] w-[180px] animate-pulse rounded-lg bg-zinc-100" />
      )}
      <p className="text-sm font-medium text-zinc-700">
        휴대폰 카메라로 QR을 스캔하면 이 결과가 폰에서 열려요
      </p>
      <p className="text-xs text-zinc-500">
        열린 화면에서 &quot;내 폰에 저장하기&quot;를 누르면 바로 사진에 저장돼요
      </p>
    </Card>
  );
}
