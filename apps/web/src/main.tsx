import { App } from "@/App";
import { Providers } from "@/Providers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed in index.html
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Providers>
			<App />
		</Providers>
	</StrictMode>,
);
