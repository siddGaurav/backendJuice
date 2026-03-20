import puppeteer from "puppeteer";
import * as QRCode from "qrcode";

export const createInvoicePDF = async (invoice: any) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const subtotal = Number(invoice?.subtotal || 0);
  const taxTotal = Number(invoice?.taxTotal || 0);
  const discount = Number(invoice?.discount || 0);
  const grandTotal = Number(invoice?.grandTotal || 0);

  // QR code as square barcode
  const qrLink = "https://7c6c6mr4-8081.inc1.devtunnels.ms/api/v1/invoice/26";
  const qrImage = await QRCode.toDataURL(qrLink, { width: 150 });






  const generateInvoiceNumber = () => {
    let num = "";
    for (let i = 0; i < 12; i++) {
      num += Math.floor(Math.random() * 10);
    }
    return "INV-" + num.match(/.{1,4}/g)?.join("-");
  };

  // Items table rows
  const itemsRows = (invoice?.items || [])
    .map((item: any, index: number) => {
      const qty = Number(item?.quantity || 0);
      const price = Number(item?.unitPrice || 0);
      const total = qty * price;
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${item?.description || "-"}</td>
          <td>${qty}</td>
          <td>₹${price.toFixed(2)}</td>
          <td>${item?.size || "-"}</td>
          <td>${item?.sku || "-"}</td>
          <td>₹${total.toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      @page { size: A4; margin: 20px; }
      body { font-family: Arial, sans-serif; color: #333; background: #FFFFFF; position: relative; }

     /* JUICE IMAGE WATERMARK */
.watermark {
  position: fixed;
  top: 45%;
  left: 30%;
  // transform: translate(-50%, -50%) rotate(-25deg);
  opacity: 0.07;
  z-index: 0;
  pointer-events: none;
}

.watermark img {
  width: 350px;
}

/* Content above watermark */
.invoice-container {
  position: relative;
  z-index: 1;
}

      .invoice-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        // background: #f2ecec;
        border: 1px solid #ddd;
        border-radius: 8px;
        position: relative;
        z-index: 1;
        page-break-inside: avoid;
      }

      .top { display: flex; justify-content: space-between; align-items: center; }
      .company { font-size: 50px; font-weight: bold; }
      .invoice-title { text-align: right; }
      .invoice-title h1 { margin: 0; font-size: 24px; }
      hr { margin: 15px 0 25px 0; }
      .info-section { display: flex; justify-content: space-between; margin-bottom: 25px; background: #f3f3f3; padding: 15px; border-radius: 6px; }
      .info-box h3 { margin: 0 0 10px 0; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
      .info-box p { margin: 3px 0; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; page-break-inside: avoid; }
      th { background: #000; color: white; padding: 10px; font-size: 13px; }
      td { padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; text-align: center; }
      td:nth-child(2) { text-align: left; }

      .totals-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 20px; page-break-inside: avoid; }
      .totals { width: 300px; }
      .totals td { padding: 6px 0; font-size: 13px; }
      .grand { font-weight: bold; border-top: 2px solid #000; padding-top: 8px; }

      .qr-code { width: 150px; height: 150px; }
      .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #777; }
       .logo img {
    height: 70px;
  }

    </style>
  </head>

  <body>
   <div class="watermark">
    <img src="https://res.cloudinary.com/dsp64fcfy/image/upload/v1771839336/oifmx1d4iq8o8k7wdoh1.webp" />
  </div>
    <div class="invoice-container">
      <div class="top">
       <h1>INVOICE</h1>
       <div class="logo">
      <img src="https://res.cloudinary.com/dsp64fcfy/image/upload/v1771839336/oifmx1d4iq8o8k7wdoh1.webp" />
    </div>

       
        <div class="invoice-title">
          
          <p><strong>#${generateInvoiceNumber()}${invoice?.invoiceNumber}</strong></p>
          <p>${invoice?.date ? new Date(invoice.date).toLocaleDateString() : ""}</p>
        </div>
      </div>

      <hr/>

      <div class="info-section">
        <div class="info-box">
          <h3>Bill To</h3>
          <p><strong>${invoice?.client?.clientName || ""}</strong></p>
          <p>${invoice?.client?.email || ""}</p>
          <p>${invoice?.client?.phone || ""}</p>
          <p>${invoice?.address?.city || ""}</p>
          <p>${invoice?.address?.addressLine || ""}</p>
          <p>${invoice?.address?.zip || ""}</p>
          <p>${invoice?.address?.country || ""}</p>
        </div>

        <div class="info-box">
          <h3>Payment Details</h3>
          <p><strong>Mode:</strong> ${invoice?.payment?.mode || ""}</p>
          <p><strong>Status:</strong> ${invoice?.payment?.status || ""}</p>
          <p><strong>Coupon:</strong> ${invoice?.payment?.coupon || ""}</p>
        </div>
      </div>

      <table>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Size</th>
          <th>SKU</th>
          <th>Total</th>
        </tr>
        ${itemsRows}
      </table>

      <div class="totals-section">
        <table class="totals">
          <tr><td>Subtotal</td><td>₹${subtotal.toFixed(2)}</td></tr>
          <tr><td>Tax</td><td>₹${taxTotal.toFixed(2)}</td></tr>
          <tr><td>Discount</td><td>- ₹${discount.toFixed(2)}</td></tr>
          <tr class="grand"><td>Grand Total</td><td>₹${grandTotal.toFixed(2)}</td></tr>
        </table>

        <div>
          <a href="${qrLink}" target="_blank">
            <img src="${qrImage}" class="qr-code"/>
          </a>
        </div>
      </div>

      <div class="footer">
        Thank you for your business ❤️ <br/>
        This is a system generated invoice.
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });

  await browser.close();
  return pdfBuffer;
};