import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const server = new Server(
  { name: "blender-mcp-bridge", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Definir las herramientas disponibles para el LLM
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "blender_create_cube",
      description: "Crea un cubo básico en la escena activa de Blender",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "blender_import_glb",
      description: "Importa un archivo .glb en Blender",
      inputSchema: {
        type: "object",
        properties: {
          filepath: { type: "string", description: "Ruta absoluta al archivo .glb" }
        },
        required: ["filepath"]
      }
    }
  ]
}));

// Manejar la ejecución de las herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let actionPayload = {};
    if (name === "blender_create_cube") {
      actionPayload = { action: "create_cube" };
    } else if (name === "blender_import_glb") {
      actionPayload = { action: "import_glb", filepath: args.filepath };
    } else {
      throw new Error(`Herramienta desconocida: ${name}`);
    }

    const response = await fetch("http://localhost:8080", {
      method: "POST",
      body: JSON.stringify(actionPayload),
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (error) {
    return { content: [{ type: "text", text: JSON.stringify({ status: "error", message: error.message }) }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);