import { Portfolio } from "@/components/portfolio";
import { arabicFontProbes } from "./fonts";

export default function HomePage() {
  return <Portfolio arabicFonts={arabicFontProbes} />;
}
