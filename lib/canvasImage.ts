export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function downloadCanvasAsPng(
  canvas: HTMLCanvasElement,
  filename: string
) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, "image/png");
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

/**
 * 모바일 브라우저에서는 OS 공유 시트(Web Share API)를 띄워 "사진에 저장"까지
 * 한 번에 되도록 하고, 지원하지 않는 환경(대부분의 데스크톱 브라우저)에서는
 * 일반 파일 다운로드로 대체한다.
 */
export async function saveOrShareCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  shareTitle: string
): Promise<"shared" | "downloaded" | "cancelled"> {
  const blob = await canvasToBlob(canvas);
  if (blob) {
    const file = new File([blob], filename, { type: "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean;
    };
    if (nav.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: shareTitle });
        return "shared";
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return "cancelled";
        // 공유가 실패하면 다운로드로 대체
      }
    }
  }
  downloadCanvasAsPng(canvas, filename);
  return "downloaded";
}
