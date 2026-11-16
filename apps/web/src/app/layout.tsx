import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Griffy } from "next/font/google";
import { Provider as ChakraProvider } from "~/components/ui/provider";
import UrqlProvider from "~/lib/urql/provider";

const griffy = Griffy({
  weight: ["400"],
  variable: "--font-brand",
  style: "normal",
  subsets: ["latin"],
});

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  style: "normal",
});

const jetbrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Connected",
  description: "A place to share updates and stay close to your community.",
};

export const viewport: Viewport = { viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${griffy.variable}`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <UrqlProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </UrqlProvider>
      </body>
    </html>
  );
}
