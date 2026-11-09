import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Text,
} from "react-email";

export function ResetPassword({
	name,
	resetUrl,
}: {
	name: string;
	resetUrl: string;
}) {
	return (
		<Html lang="en">
			<Head />
			<Preview>Reset your Connected password.</Preview>
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
						Reset your password
					</Heading>
					<Text style={{ fontSize: "16px", lineHeight: "24px" }}>
						Hi {name},
					</Text>
					<Text style={{ fontSize: "16px", lineHeight: "24px" }}>
						Follow this link to choose a new password for your Connected account.
					</Text>
					<Button
						href={resetUrl}
						style={{
							backgroundColor: "#2563eb",
							borderRadius: "6px",
							color: "#ffffff",
							padding: "12px 20px",
						}}
					>
						Reset password
					</Button>
					<Text>
						This link expires in 30 minutes. If you did not request a password
						reset, ignore this email. Your password will stay the same.
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
