import z from "zod";
import { SpecField, specFieldSchema } from "../../spec";

export default z.array(specFieldSchema).parse([
  {
    name: "wattage",
    label: "Wattage",
    type: "select",
    options: ["450W", "550W", "650W", "750W", "850W", "1000W", "1200W"],
    validation: z.enum([
      "450W",
      "550W",
      "650W",
      "750W",
      "850W",
      "1000W",
      "1200W",
    ]),
  },
  {
    name: "efficiency",
    label: "Efficiency",
    type: "select",
    options: [
      "80+ White",
      "80+ Bronze",
      "80+ Silver",
      "80+ Gold",
      "80+ Platinum",
      "80+ Titanium",
    ],
    validation: z.enum([
      "80+ White",
      "80+ Bronze",
      "80+ Silver",
      "80+ Gold",
      "80+ Platinum",
      "80+ Titanium",
    ]),
  },
  {
    name: "modular",
    label: "Modular",
    type: "select",
    options: ["Non-Modular", "Semi-Modular", "Fully Modular"],
    validation: z.enum(["Non-Modular", "Semi-Modular", "Fully Modular"]),
  },
  {
    name: "formFactor",
    label: "Form Factor",
    type: "select",
    options: ["ATX", "SFX", "SFX-L"],
    validation: z.enum(["ATX", "SFX", "SFX-L"]),
  },
] satisfies SpecField[]);
