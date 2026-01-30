import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RevaBrain - Neurologische Revalidatiepraktijk",
  description: "Multidisciplinaire groepspraktijk gespecialiseerd in neurologische revalidatie. Logopedie, kinesitherapie, ergotherapie, neuropsychologie en dietiek.",
  keywords: "neurologische revalidatie, logopedie, kinesitherapie, ergotherapie, neuropsychologie, hersenletsel, NAH, België",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
