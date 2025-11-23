import { createComponentSchema } from "@repo/api/models";
import z from "zod";
import axios from "axios";
import { load as cheerio } from "cheerio";
import { db } from "@repo/db";

const coolingSchema = createComponentSchema.extend({
  specifications: z.object({
    socket: z.string(), // LGA1700, AM5, AM4, etc
    compatibility: z.string().optional(), // Multiple socket support
    type: z.string(), // Air Cooler, AIO, Custom Loop
    coolerHeight: z.string().optional(),
    fanSize: z.string().optional(),
    radiatorSize: z.string().optional(),
    tdpRating: z.string().optional(),
    noiseLevel: z.string().optional(),
    rpm: z.string().optional(),
    rgb: z.string().optional(),
    fanCount: z.string().optional(),
  }),
});

type CoolingSchema = z.infer<typeof coolingSchema>;

const url = "https://www.pc-kombo.com/ca/components/cpucoolers";

const storeToJsonFile = async (cooling: CoolingSchema) => {
  const fs = await import("fs/promises");
  const path = `./scraped-data/coolings.json`;

  // store to json file
  let existingData: CoolingSchema[] = [];
  try {
    const fileData = await fs.readFile(path, "utf-8");
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.log("No existing data found, creating new file.");
  }

  existingData.push(cooling);

  await fs.writeFile(path, JSON.stringify(existingData, null, 2), "utf-8");
};

const scrapeCoolingDetail = async (coolingUrl: string) => {
  const { data } = await axios.get(coolingUrl, {
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

  const cooling: CoolingSchema = {
    name: $("h1[itemprop='name']").first().text().trim(),
    type: "COOLING",
    imageUrl: null,
    price: price,
    specifications: {
      socket: getSpec("Socket") || getSpec("Compatibility"),
      compatibility: getSpec("Socket Support") || getSpec("Compatible Sockets"),
      type: getSpec("Type") || getSpec("Cooler Type"),
      coolerHeight: getSpec("Height") || getSpec("Cooler Height"),
      fanSize: getSpec("Fan Size") || getSpec("Fan Dimensions"),
      radiatorSize: getSpec("Radiator Size") || getSpec("Radiator"),
      tdpRating: getSpec("TDP") || getSpec("TDP Rating"),
      noiseLevel: getSpec("Noise Level") || getSpec("Noise"),
      rpm: getSpec("RPM") || getSpec("Fan Speed"),
      rgb: getSpec("RGB") || getSpec("Lighting"),
      fanCount: getSpec("Fans") || getSpec("Fan Count"),
    },
  };

  return cooling;
};

const scrapeCooling = async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio(data);

    const coolingElements = $("#hardware li");

    console.log("Found Cooling elements count:", coolingElements.length);

    for (let i = 0; i < coolingElements.length; i++) {
      const element = coolingElements[i];
      const url = $(element).find("a").attr("href") || "";

      const cooling = await scrapeCoolingDetail(url);
      try {
        const validatedCooling = coolingSchema.parse(cooling);

        const isExisting = await db.component.findFirst({
          where: { name: validatedCooling.name },
        });

        if (isExisting) {
          console.log(
            `Cooling already exists, skipping: ${validatedCooling.name}`,
          );
          continue;
        }

        await db.component.create({
          data: validatedCooling,
        });
        console.log(`Upserted Cooling: ${validatedCooling.name}`);
      } catch (error) {
        console.error("Error processing Cooling element:", error);
        await storeToJsonFile(cooling);
      }
    }
  } catch (error) {
    console.error("Error scraping Cooling data:", error);
  }
};

scrapeCooling();
