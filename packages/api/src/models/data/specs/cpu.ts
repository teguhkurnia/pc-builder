import z from "zod";
import { SpecField, specFieldSchema } from "../../spec";

export default z.array(specFieldSchema).parse([
  {
    name: "cores",
    label: "Cores",
    type: "number",
    placeholder: "e.g., 24",
    validation: z
      .number("Number of cores must be between 1 and 128")
      .min(1)
      .max(128),
  },
  {
    name: "threads",
    label: "Threads",
    type: "number",
    placeholder: "e.g., 32",
    validation: z
      .number("Number of threads must be between 1 and 256")
      .min(1)
      .max(256),
  },
  {
    name: "baseClock",
    label: "Base Clock",
    type: "text",
    placeholder: "e.g., 3.0 GHz",
    validation: z
      .string("Base clock must be in the format of a number followed by GHz")
      .regex(/^\d+(\.\d+)?\s?GHz$/, "Must be in GHz format"),
  },
  {
    name: "boostClock",
    label: "Boost Clock",
    type: "text",
    placeholder: "e.g., 5.8 GHz",
    validation: z
      .string("Boost clock must be in the format of a number followed by GHz")
      .regex(/^\d+(\.\d+)?\s?GHz$/, "Must be in GHz format"),
  },
  {
    name: "unlockedMultiplier",
    label: "Unlocked Multiplier",
    type: "select",
    options: ["Yes", "No"],
    validation: z.enum(["Yes", "No"]),
  },
  {
    name: "integratedGraphics",
    label: "Integrated Graphics",
    type: "text",
    placeholder: "e.g., Intel UHD Graphics 770 or No",
    validation: z.string().min(1, "Integrated graphics info is required"),
  },
  {
    name: "architecture",
    label: "Architecture",
    type: "text",
    placeholder: "e.g., Zen 4, Raptor Lake",
    validation: z.string().min(1, "Architecture is required"),
  },
  {
    name: "tdp",
    label: "TDP",
    placeholder: "e.g., 125W",
    validation: z
      .string("TDP must be in the format of a number followed by W")
      .regex(/^\d+\s?W$/, "Must be in Watts format"),
    type: "text",
  },
  {
    name: "socket",
    label: "Socket",
    type: "select",
    options: ["LGA1700", "LGA1200", "AM5", "AM4", "LGA2066"],
    validation: z.enum(["LGA1700", "LGA1200", "AM5", "AM4", "LGA2066"]),
  },
  {
    name: "process",
    label: "Process",
    type: "text",
    placeholder: "e.g., 5nm, 7nm",
    validation: z.string().min(1, "Process info is required").optional(),
  },
  {
    name: "maxMemory",
    label: "Max Memory",
    type: "select",
    options: [
      "8 GB",
      "16 GB",
      "32 GB",
      "64 GB",
      "128 GB",
      "256 GB",
      "512 GB",
      "1 TB",
      "2 TB",
      "Unlimited",
    ],
    validation: z
      .enum([
        "8 GB",
        "16 GB",
        "32 GB",
        "64 GB",
        "128 GB",
        "256 GB",
        "512 GB",
        "1 TB",
        "2 TB",
        "Unlimited",
      ])
      .optional(),
  },
  {
    name: "memoryChannels",
    label: "Memory Channels",
    type: "select",
    options: ["Single", "Dual", "Quad", "Hexa", "Octa"],
    validation: z.enum(["Single", "Dual", "Quad", "Hexa", "Octa"]).optional(),
  },
  {
    name: "pcieVersion",
    label: "PCIe Version",
    type: "select",
    options: ["PCIe 3.0", "PCIe 4.0", "PCIe 5.0"],
    validation: z.enum(["PCIe 3.0", "PCIe 4.0", "PCIe 5.0"]).optional(),
  },
  {
    name: "productPage",
    label: "Product Page URL",
    type: "text",
    placeholder: "e.g., https://www.intel.com/...",
    validation: z.url("Must be a valid URL").optional(),
  },
] satisfies SpecField[]);
