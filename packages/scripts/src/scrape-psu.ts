import { createComponentSchema } from "@repo/api/models";
import z from "zod";
import axios from "axios";
import { load as cheerio } from "cheerio";
import { db } from "@repo/db";

const psuSchema = createComponentSchema.extend({
  specifications: z.object({
    wattage: z.string(), // 650W, 750W, 850W, etc
    efficiency: z.string(), // 80+ Gold, 80+ Platinum, 80+ Titanium
    modular: z.string(), // Full Modular, Semi Modular, Non-Modular
    formFactor: z.string().optional(), // ATX, SFX, SFX-L
    pcieConnectors: z.string().optional(), // 2x 8-pin, 3x 8-pin
    sataConnectors: z.string().optional(),
    molexConnectors: z.string().optional(),
    fanSize: z.string().optional(),
    noiseLevel: z.string().optional(),
    dimensions: z.string().optional(),
    warranty: z.string().optional(),
    pfc: z.string().optional(), // Active PFC
    protection: z.string().optional(), // OVP, UVP, OCP, etc
  }),
});

type PsuSchema = z.infer<typeof psuSchema>;

const url = "https://www.pc-kombo.com/ca/components/powersupplies";

const storeToJsonFile = async (psu: PsuSchema) => {
  const fs = await import("fs/promises");
  const path = `./scraped-data/psus.json`;

  // store to json file
  let existingData: PsuSchema[] = [];
  try {
    const fileData = await fs.readFile(path, "utf-8");
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.log("No existing data found, creating new file.");
  }

  existingData.push(psu);

  await fs.writeFile(path, JSON.stringify(existingData, null, 2), "utf-8");
};

const scrapePsuDetail = async (psuUrl: string) => {
  const { data } = await axios.get(psuUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  const $ = cheerio(data);

  const rawPrice = $('span[itemprop="price"]').first().text().trim();
  const price = rawPrice ? parseFloat(rawPrice) : 0;

  // Helper function to get spec value
  const getSpec = (label: string): string => {
    return $("dt")
      .filter((i, el) => $(el).text().trim() === label)
      .next()
      .text()
      .trim();
  };

  const psu: PsuSchema = {
    name: $("h1[itemprop='name']").first().text().trim(),
    type: "PSU",
    imageUrl: null,
    price: price,
    specifications: {
      wattage: getSpec("Wattage") || getSpec("Power"),
      efficiency: getSpec("Efficiency") || getSpec("80 Plus"),
      modular: getSpec("Modular") || getSpec("Cable Management"),
      formFactor: getSpec("Form Factor") || getSpec("Type"),
      pcieConnectors: getSpec("PCIe Connectors") || getSpec("PCI-E Connectors"),
      sataConnectors: getSpec("SATA Connectors") || getSpec("SATA"),
      molexConnectors: getSpec("Molex Connectors") || getSpec("Molex"),
      fanSize: getSpec("Fan Size") || getSpec("Fan"),
      noiseLevel: getSpec("Noise Level") || getSpec("Noise"),
      dimensions: getSpec("Dimensions") || getSpec("Size"),
      warranty: getSpec("Warranty"),
      pfc: getSpec("PFC") || getSpec("Power Factor Correction"),
      protection: getSpec("Protection") || getSpec("Protections"),
    },
  };

  return psu;
};

const scrapePsu = async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio(data);

    const psuElements = $("#hardware li");

    console.log("Found PSU elements count:", psuElements.length);

    for (let i = 0; i < psuElements.length; i++) {
      const element = psuElements[i];
      const url = $(element).find("a").attr("href") || "";

      const psu = await scrapePsuDetail(url);
      try {
        const validatedPsu = psuSchema.parse(psu);

        const isExisting = await db.component.findFirst({
          where: { name: validatedPsu.name },
        });

        if (isExisting) {
          console.log(`PSU already exists, skipping: ${validatedPsu.name}`);
          continue;
        }

        await db.component.create({
          data: validatedPsu,
        });
        console.log(`Upserted PSU: ${validatedPsu.name}`);
      } catch (error) {
        console.error("Error processing PSU element:", error);
        await storeToJsonFile(psu);
      }
    }
  } catch (error) {
    console.error("Error scraping PSU data:", error);
  }
};

scrapePsu();
