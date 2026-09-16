import { wrapText } from "./canvasImage";

// 동행복권 실제 공 색상 기준 (1-10 노랑, 11-20 파랑, 21-30 빨강, 31-40 회색, 41-45 초록)
const BALL_HEX = ["#facc15", "#38bdf8", "#f87171", "#a1a1aa", "#34d399"];

export function hexForNumber(n: number): string {
  if (n <= 10) return BALL_HEX[0];
  if (n <= 20) return BALL_HEX[1];
  if (n <= 30) return BALL_HEX[2];
  if (n <= 40) return BALL_HEX[3];
  return BALL_HEX[4];
}

function lighten(hex: string): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 70);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 70);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 70);
  return `rgb(${r}, ${g}, ${b})`;
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  n: number,
  ringColor?: string
) {
  if (ringColor) {
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = ringColor;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(
    x - radius * 0.35,
    y - radius * 0.35,
    radius * 0.1,
    x,
    y,
    radius
  );
  gradient.addColorStop(0, lighten(hexForNumber(n)));
  gradient.addColorStop(1, hexForNumber(n));
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(n), x, y + 1);
}

export function drawLottoCard(
  canvas: HTMLCanvasElement,
  numbers: number[],
  bonus: number,
  message: string
) {
  const width = 720;
  const height = 400;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(1, "#134e4a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const today = new Date();
  const dateLabel = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  ctx.fillStyle = "#5eead4";
  ctx.font = "600 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${dateLabel} · 가상 추첨`, width / 2, 40);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("퇴사 기념 당첨번호", width / 2, 74);

  const ballRadius = 28;
  const gap = 18;
  const mainWidth = numbers.length * ballRadius * 2 + (numbers.length - 1) * gap;
  const plusWidth = 40;
  const totalWidth = mainWidth + plusWidth + ballRadius * 2;
  let x = (width - totalWidth) / 2 + ballRadius;
  const y = 170;

  for (const n of numbers) {
    drawBall(ctx, x, y, ballRadius, n);
    x += ballRadius * 2 + gap;
  }

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 26px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("+", x - gap / 2 + ballRadius, y);
  x += plusWidth - gap;

  drawBall(ctx, x, y, ballRadius, bonus, "#fbbf2444");

  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("보너스", x, y + ballRadius + 20);

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#e4e4e7";
  ctx.font = "16px sans-serif";
  const lines = wrapText(ctx, message, width - 140);
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, 270 + i * 24);
  });

  ctx.fillStyle = "#71717a";
  ctx.font = "12px sans-serif";
  ctx.fillText(
    "슬기로운 퇴사생활 · 실제 당첨을 예측하지 않는 재미 콘텐츠입니다",
    width / 2,
    height - 24
  );
}
