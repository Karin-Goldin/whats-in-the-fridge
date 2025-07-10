import type { Metadata } from 'next';
import { Geist, Geist_Mono, Fredoka } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const playfulFont = Fredoka({
	variable: '--font-playful',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: "What's in the Fridge?",
	description:
		'Get delicious recipes based on ingredients you have at home. Reduce food waste and discover new meal ideas with AI-powered recipe suggestions.',
	icons: {
		icon: '/Untitled.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${playfulFont.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
