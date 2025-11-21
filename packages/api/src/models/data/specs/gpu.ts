import z from "zod";
import { SpecField, specFieldSchema } from "../../spec";

export default z.array(specFieldSchema).parse([
  {
    name: "chipset",
    label: "Chipset",
    placeholder: "e.g., RTX 4090",
    type: "text",
    validation: z.string().min(1).max(50),
  },
  {
    name: "memory",
    label: "Memory",
    placeholder: "e.g., 24GB GDDR6X",
    type: "text",
    validation: z.string().min(1).max(50),
  },
  {
    name: "coreClock",
    label: "Core Clock",
    placeholder: "e.g., 2230 MHz",

    type: "text",
    validation: z.string().min(1).max(50),
  },
  {
    name: "boostClock",
    label: "Boost Clock",
    placeholder: "e.g., 2520 MHz",
    type: "text",
    validation: z.string().min(1).max(50),
  },
  {
    name: "tdp",
    label: "TDP",
    placeholder: "e.g., 450W",
    type: "text",
    validation: z.string().min(1).max(50),
  },
  {
    name: "outputs",
    label: "Outputs",
    placeholder: "e.g., 3x DP, 1x HDMI",
    type: "text",
    validation: z.string().min(1).max(100),
  },
] satisfies SpecField[]);
