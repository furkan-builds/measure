import type { ButtonHTMLAttributes } from "react";

const Button = (buttonProps: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return <button type="button" {...buttonProps} />;
};

export { Button };
