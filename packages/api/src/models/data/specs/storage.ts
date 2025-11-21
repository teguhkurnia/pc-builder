import z from "zod";
import { SpecField, specFieldSchema } from "../../spec";

export default z.array(specFieldSchema).parse([
  {
    name: "capacity",
    label: "Capacity",
    type: "select",
    options: ["256GB", "512GB", "1TB", "2TB", "4TB", "8TB"],
    validation: z.enum(["256GB", "512GB", "1TB", "2TB", "4TB", "8TB"]),
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: ["NVMe SSD", "SATA SSD", "HDD"],
    validation: z.enum(["NVMe SSD", "SATA SSD", "HDD"]),
  },
  {
    name: "interface",
    label: "Interface",
    type: "select",
    options: ["PCIe 4.0 x4", "PCIe 3.0 x4", "SATA III"],
    validation: z.enum(["PCIe 4.0 x4", "PCIe 3.0 x4", "SATA III"]),
  },
  {
    name: "readSpeed",
    label: "Read Speed",
    placeholder: "e.g., 7000 MB/s",
    type: "text",
    validation: z.string().optional(),
  },
  {
    name: "writeSpeed",
    label: "Write Speed",
    placeholder: "e.g., 5300 MB/s",
    type: "text",
    validation: z.string().optional(),
  },
  {
    name: "formFactor",
    label: "Form Factor",
    type: "select",
    options: ["M.2 2280", "M.2 2260", "M.2 22110", "2.5 inch", "3.5 inch"],
    validation: z.enum([
      "M.2 2280",
      "M.2 2260",
      "M.2 22110",
      "2.5 inch",
      "3.5 inch",
    ]),
  },
] satisfies SpecField[]);
