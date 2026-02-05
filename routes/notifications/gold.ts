import { Hono } from "hono"

import * as cheerio from "cheerio";
import { resend } from "../../lib/resend";

export const gold = new Hono()

const TO_EMAILS = [
    "sudhanshuneravati@gmail.com"
]

gold.get("/", async c => {

    try {
        // 1. Fetch page
        const response = await fetch("https://www.tickertape.in/digital-gold", {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        // 2. Extract gold price (may break if site changes)
        // This selector is fragile – inspect page if it fails
        const priceText = $("span")
            .filter((_, el) => $(el).text().includes("₹"))
            .first()
            .text()
            .replace(/[₹,]/g, "")
            .trim();

        const goldPrice = parseFloat(priceText);

        if (!goldPrice || isNaN(goldPrice)) {
            throw new Error("Could not parse gold price");
        }

        // Build email
        const emailText = `
Daily Gold Price

Current Price: ₹${goldPrice.toFixed(2)}

Checked at: ${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
        })}
Source: Tickertape (Digital Gold)
    `.trim();

        // Send email
        await resend.emails.send({
            from: "Gold Tracker <gold@unown.sbs>",
            // to: "voltantroyer2@gmail.com",
            to: TO_EMAILS,
            subject: "Daily Gold Price",
            text: emailText,
        });

        return c.json({
            success: true,
            goldPrice
        });

    } catch (error) {

        console.log(error)

        return c.json({
            success: false,
            error: error instanceof Error ? error.message : error,
        });

    }

})
