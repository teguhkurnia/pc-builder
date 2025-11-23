import { createComponentSchema } from "@repo/api/models";
import z from "zod";
import axios from "axios";
import { load as cheerio } from "cheerio";
import { db } from "@repo/db";

const caseSchema = createComponentSchema.extend({
  specifications: z.object({
    formFactor: z.string(), // ATX, Micro-ATX, Mini-ITX, etc
    compatibility: z.string().optional(), // Supported form factors
    maxGpuLength: z.string().optional(),
    maxCpuCoolerHeight: z.string().optional(),
    driveBays: z.string().optional(),
    expansionSlots: z.string().optional(),
    frontPanelUsb: z.string().optional(),
    sidePanel: z.string().optional(),
    psuPosition: z.string().optional(),
    dimensions: z.string().optional(),
    weight: z.string().optional(),
    fansIncluded: z.string().optional(),
    maxFans: z.string().optional(),
    radiatorSupport: z.string().optional(),
    rgb: z.string().optional(),
  }),
});

type CaseSchema = z.infer<typeof caseSchema>;

const url = "https://www.pc-kombo.com/ca/components/cases";

const storeToJsonFile = async (caseData: CaseSchema) => {
  const fs = await import("fs/promises");
  const path = `./scraped-data/cases.json`;

  // store to json file
  let existingData: CaseSchema[] = [];
  try {
    const fileData = await fs.readFile(path, "utf-8");
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.log("No existing data found, creating new file.");
  }

  existingData.push(caseData);

  await fs.writeFile(path, JSON.stringify(existingData, null, 2), "utf-8");
};

const scrapeCaseDetail = async (caseUrl: string) => {
  const { data } = await axios.get(caseUrl, {
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

  const caseData: CaseSchema = {
    name: $("h1[itemprop='name']").first().text().trim(),
    type: "CASE",
    imageUrl: null,
    price: price,
    specifications: {
      formFactor: getSpec("Form Factor") || getSpec("Type"),
      compatibility: getSpec("Compatibility") || getSpec("Motherboard Support"),
      maxGpuLength:
        getSpec("Max GPU Length") || getSpec("Graphics Card Length"),
      maxCpuCoolerHeight:
        getSpec("Max CPU Cooler Height") || getSpec("CPU Cooler Height"),
      driveBays: getSpec("Drive Bays") || getSpec("Storage Bays"),
      expansionSlots: getSpec("Expansion Slots") || getSpec("PCI Slots"),
      frontPanelUsb: getSpec("Front Panel USB") || getSpec("Front I/O"),
      sidePanel: getSpec("Side Panel") || getSpec("Window"),
      psuPosition: getSpec("PSU Position") || getSpec("Power Supply Position"),
      dimensions: getSpec("Dimensions") || getSpec("Size"),
      weight: getSpec("Weight"),
      fansIncluded: getSpec("Fans Included") || getSpec("Included Fans"),
      maxFans: getSpec("Max Fans") || getSpec("Fan Support"),
      radiatorSupport: getSpec("Radiator Support") || getSpec("Water Cooling"),
      rgb: getSpec("RGB") || getSpec("Lighting"),
    },
  };

  return caseData;
};

const scrapeCase = async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio(data);

    const caseElements = $("#hardware li");

    console.log("Found Case elements count:", caseElements.length);

    for (let i = 0; i < caseElements.length; i++) {
      const element = caseElements[i];
      const url = $(element).find("a").attr("href") || "";

      const caseData = await scrapeCaseDetail(url);
      try {
        const validatedCase = caseSchema.parse(caseData);

        const isExisting = await db.component.findFirst({
          where: { name: validatedCase.name },
        });

        if (isExisting) {
          console.log(`Case already exists, skipping: ${validatedCase.name}`);
          continue;
        }

        await db.component.create({
          data: validatedCase,
        });
        console.log(`Upserted Case: ${validatedCase.name}`);
      } catch (error) {
        console.error("Error processing Case element:", error);
        await storeToJsonFile(caseData);
      }
    }
  } catch (error) {
    console.error("Error scraping Case data:", error);
  }
};

scrapeCase();
