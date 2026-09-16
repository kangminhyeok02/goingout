import QRCode from "qrcode";

export async function generateQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 220,
    margin: 1,
    color: { dark: "#134e4a", light: "#ffffff" },
  });
}
