import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

/* `withPayload` liga o painel ao build do Next: externaliza as dependências de
   servidor do Payload e mantém o `sharp` fora do bundle do cliente. */
export default withPayload(nextConfig);
