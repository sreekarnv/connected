import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Text,
} from "react-email";

export function WelcomeEmail({ name }: { name: string }) {
	return (
		<Html lang="en">
			<Head />
			<Preview>Your Connected account is ready.</Preview>
			<Body
				style={{
					backgroundColor: "#f4f4f5",
					color: "#18181b",
					fontFamily: "Arial, sans-serif",
					margin: "0",
					padding: "32px 12px",
				}}
			>
				<Container
					style={{
						backgroundColor: "#ffffff",
						border: "1px solid #e4e4e7",
						borderRadius: "8px",
						maxWidth: "560px",
						padding: "32px 24px",
					}}
				>
					<Text
						style={{
							color: "#2563eb",
							fontSize: "12px",
							fontWeight: "bold",
							letterSpacing: "2px",
							margin: "0 0 24px",
						}}
					>
						CONNECTED
					</Text>
					<Heading
						style={{ fontSize: "28px", lineHeight: "36px", margin: "0 0 24px" }}
					>
						Welcome to Connected
					</Heading>
					<Text style={{ fontSize: "16px", lineHeight: "24px" }}>
						Hi {name},
					</Text>
					<Text style={{ fontSize: "16px", lineHeight: "24px" }}>
						Your account is ready. We&apos;re glad you&apos;re here.
					</Text>
					<Hr
						style={{ borderTop: "1px solid #e4e4e7", margin: "32px 0 16px" }}
					/>
					<Text style={{ color: "#52525b", fontSize: "12px", margin: "0" }}>
						Connected
					</Text>
				</Container>
			</Body>
		</Html>
	);
}
