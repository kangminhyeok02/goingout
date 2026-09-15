import { wrapText } from "./canvasImage";

export interface QuoteTheme {
  from: string;
  to: string;
  text: string;
}

export function drawQuoteCard(
  canvas: HTMLCanvasElement,
  quote: string,
  theme: QuoteTheme
) {
  const width = 640;
  const height = 400;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, theme.from);
  gradient.addColorStop(1, theme.to);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = theme.text;
  ctx.font = "600 14px sans-serif";
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.6;
  ctx.fillText("슬기로운 퇴사생활", width / 2, 56);
  ctx.globalAlpha = 1;

  ctx.font = "bold 28px sans-serif";
  ctx.textBaseline = "middle";
  const lines = wrapText(ctx, quote, width - 140);
  const lineHeight = 42;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  ctx.textBaseline = "alphabetic";
  ctx.font = "12px sans-serif";
  ctx.globalAlpha = 0.5;
  ctx.fillText("참고용 문구이며 재미로 즐기는 콘텐츠입니다", width / 2, height - 28);
  ctx.globalAlpha = 1;
}
