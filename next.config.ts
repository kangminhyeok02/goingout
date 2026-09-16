import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 중 휴대폰 등 다른 기기에서 LAN IP로 접속할 때, Next.js 개발 서버가
  // _next 정적 자산 요청을 다른 출처로 간주해 차단하는 것을 허용한다.
  // (버튼이 눌리지 않는 등 hydration 실패 증상으로 나타남)
  allowedDevOrigins: ["25.25.122.218"],
};

export default nextConfig;
