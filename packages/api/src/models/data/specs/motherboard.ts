import z from "zod";
import { SpecField, specFieldSchema } from "../../spec";

export default z.array(specFieldSchema).parse([
  {
    name: "socket",
    label: "Socket",
    type: "select",
    options: ["LGA1700", "LGA1200", "AM5", "AM4", "LGA2066"],
    validation: z.string().nonempty("Socket is required"),
  },
  {
    name: "chipset",
    label: "Chipset",
    placeholder: "e.g., Z790",
    type: "text",
    validation: z.string().nonempty("Chipset is required"),
  },
  {
    name: "formFactor",
    label: "Form Factor",
    type: "select",
    options: ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"],
    validation: z.string().nonempty("Form Factor is required"),
  },
  {
    name: "memorySlots",
    label: "Memory Slots",
    type: "number",
    placeholder: "e.g., 4",
    validation: z
      .number()
      .int("Memory Slots must be an integer")
      .min(1, "There must be at least 1 memory slot")
      .max(8, "There can be at most 8 memory slots"),
  },
  {
    name: "maxMemory",
    label: "Max Memory",
    placeholder: "e.g., 128GB",
    type: "text",
    validation: z.string().nonempty("Max Memory is required"),
  },
  {
    name: "pcie",
    label: "PCIe Slots",
    placeholder: "e.g., 3x PCIe 4.0",
    type: "text",
    validation: z.string().nonempty("PCIe Slots is required"),
  },
] satisfies SpecField[]);
