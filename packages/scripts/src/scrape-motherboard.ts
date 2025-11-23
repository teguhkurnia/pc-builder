import { createComponentSchema } from "@repo/api/models";
import z from "zod";
import axios from "axios";
import { load as cheerio } from "cheerio";
import { db } from "@repo/db";

const motherboardSchema = createComponentSchema.extend({
  specifications: z.object({
    socket: z.string(),
    chipset: z.string(),
    memoryType: z.string(),
    memorySlots: z.number().min(1).max(8),
    maxMemory: z.string(),
    formFactor: z.string(),
    pcieSlots: z.string().optional(),
    m2Slots: z.string().optional(),
    sataPorts: z.string().optional(),
    usbPorts: z.string().optional(),
    ethernet: z.string().optional(),
    wifi: z.string().optional(),
  }),
});

type MotherboardSchema = z.infer<typeof motherboardSchema>;

const url = "https://www.pc-kombo.com/ca/components/motherboards";

const storeToJsonFile = async (motherboard: MotherboardSchema) => {
  const fs = await import("fs/promises");
  const path = `./scraped-data/motherboards.json`;

  // store to json file
  let existingData: MotherboardSchema[] = [];
  try {
    const fileData = await fs.readFile(path, "utf-8");
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.log("No existing data found, creating new file.");
  }

  existingData.push(motherboard);

  await fs.writeFile(path, JSON.stringify(existingData, null, 2), "utf-8");
};

const scrapeMotherboardDetail = async (motherboardUrl: string) => {
  const { data } = await axios.get(motherboardUrl, {
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

  const motherboard: MotherboardSchema = {
    name: $("h1[itemprop='name']").first().text().trim(),
    type: "MOTHERBOARD",
    imageUrl: null,
    manufacturer: getSpec("Producer") || null,
    price: price,
    specifications: {
      socket: getSpec("Socket"),
      chipset: getSpec("Chipset"),
      memoryType: getSpec("Memory Type") || getSpec("RAM Type"),
      memorySlots:
        parseInt(getSpec("Memory Slots") || getSpec("RAM Slots")) || 4,
      maxMemory: getSpec("Max Memory") || getSpec("Max RAM"),
      formFactor: getSpec("Form Factor") || getSpec("Format"),
      pcieSlots: getSpec("PCIe Slots") || getSpec("Expansion Slots"),
      m2Slots: getSpec("M.2 Slots") || getSpec("M.2"),
      sataPorts: getSpec("SATA Ports") || getSpec("SATA"),
      usbPorts: getSpec("USB Ports") || getSpec("USB"),
      ethernet: getSpec("Ethernet") || getSpec("LAN"),
      wifi: getSpec("WiFi") || getSpec("Wireless"),
    },
  };

  return motherboard;
};

const scrapeMotherboard = async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio(data);

    const motherboardElements = $("#hardware li");

    console.log(
      "Found Motherboard elements count:",
      motherboardElements.length,
    );

    for (let i = 0; i < motherboardElements.length; i++) {
      const element = motherboardElements[i];
      const url = $(element).find("a").attr("href") || "";

      const motherboard = await scrapeMotherboardDetail(url);
      try {
        const validatedMotherboard = motherboardSchema.parse(motherboard);

        const isExisting = await db.component.findFirst({
          where: { name: validatedMotherboard.name },
        });

        if (isExisting) {
          console.log(
            `Motherboard already exists, skipping: ${validatedMotherboard.name}`,
          );
          continue;
        }

        await db.component.create({
          data: validatedMotherboard,
        });
        console.log(`Upserted Motherboard: ${validatedMotherboard.name}`);
      } catch (error) {
        console.error("Error processing Motherboard element:", error);
        await storeToJsonFile(motherboard);
      }
    }
  } catch (error) {
    console.error("Error scraping Motherboard data:", error);
  }
};

scrapeMotherboard();
