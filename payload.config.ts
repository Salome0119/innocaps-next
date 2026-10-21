import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { Users } from "./src/collections/Users";
import { Companies } from "./src/collections/Companies";
import { Contactos } from "./src/collections/Contactos";

// Definir __dirname para compatibilidad con ESM (Node.js ES Modules)
const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: __dirname,
    },
  },
  collections: [Users, Companies, Contactos],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "fallback-secret-change-in-production",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  typescript: {
    outputFile: "./payload-types.ts",
  },
});