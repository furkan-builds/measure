import { SignJWT, jwtVerify } from "jose";

const getSecret = () => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET environment variable is required");
	}
	return new TextEncoder().encode(secret);
};

const createToken = async (userId: string): Promise<string> => {
	const token = await new SignJWT({ sub: userId })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(getSecret());

	return token;
};

const verifyToken = async (token: string): Promise<string | null> => {
	try {
		const { payload } = await jwtVerify(token, getSecret());
		return payload.sub ?? null;
	} catch {
		return null;
	}
};

export { createToken, verifyToken };
