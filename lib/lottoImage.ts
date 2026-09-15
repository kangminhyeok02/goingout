import { wrapText } from "./canvasImage";

const BALL_HEX = ["#fbbf24", "#38bdf8", "#f87171", "#a1a1aa", "#34d399"];

function hexForNumber(n: number): string {
  if (n <= 10) return BALL_HEX[0];
  if (n <= 20) return BALL_HEX[1];
  if (n <= 30) return BALL_HEX[2];
  if (n <= 40) return BALL_HEX[3];
  return BALL_HEX[4];
}

export function drawLottoCard(
  canvas: HTMLCanvasElement,
  numbers: number[],
  message: string
) {
  const width = 640;
  const height = 360;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f0fdfa");
  gradient.addColorStop(1, "#fffbeb");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#71717a";
  ctx.font = "600 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("퇴사 기념 행운 번호", width / 2, 56);

  const ballRadius = 32;
  const gap = 20;
  const totalWidth = numbers.length * ballRadius * 2 + (numbers.length - 1) * gap;
  let x = (width - totalWidth) / 2 + ballRadius;
  const y = 160;

  for (const n of numbers) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = hexForNumber(n);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(n), x, y + 2);

    x += ballRadius * 2 + gap;
  }

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#3f3f46";
  ctx.font = "16px sans-serif";
  const lines = wrapText(ctx, message, width - 120);
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, 236 + i * 24);
  });

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "12px sans-serif";
  ctx.fillText(
    "슬기로운 퇴사생활 · 실제 당첨을 예측하지 않는 재미 콘텐츠입니다",
    width / 2,
    height - 20
  );
}
