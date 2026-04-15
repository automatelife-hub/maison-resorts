import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { searchHotels, searchFlights, book, bookFlight } from "./api";

const server = new Server(
  {
    name: "maison-booking-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_sanctuaries",
        description: "Search for luxury hotel sanctuaries via Maison Resorts",
        inputSchema: {
          type: "object",
          properties: {
            destination: { type: "string" },
            checkInDate: { type: "string" },
            checkOutDate: { type: "string" },
            adults: { type: "number" },
          },
          required: ["destination", "checkInDate", "checkOutDate"],
        },
      },
      {
        name: "search_voyages",
        description: "Search for refined flight voyages via Maison Resorts",
        inputSchema: {
          type: "object",
          properties: {
            origin: { type: "string" },
            destination: { type: "string" },
            departureDate: { type: "string" },
            adults: { type: "number" },
          },
          required: ["origin", "destination", "departureDate", "adults"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "search_sanctuaries": {
      const { destination, checkInDate, checkOutDate, adults } = request.params.arguments as any;
      const results = await searchHotels(destination, checkInDate, checkOutDate, [{ adults: adults || 2 }]);
      return {
        content: [{ type: "text", text: JSON.stringify(results.data) }],
      };
    }
    case "search_voyages": {
      const { origin, destination, departureDate, adults } = request.params.arguments as any;
      const results = await searchFlights({ origin, destination, departureDate, adults });
      return {
        content: [{ type: "text", text: JSON.stringify(results) }],
      };
    }
    default:
      throw new Error("Tool not found");
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
