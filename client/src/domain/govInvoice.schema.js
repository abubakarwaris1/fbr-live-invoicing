import { z } from "zod";

// GovInvoiceItem Schema
export const GovInvoiceItemSchema = z.object({
  hsCode: z.string().regex(/^[0-9]{4}\.[0-9]{4}$/, "HS Code must be in format XXXX.XXXX"),
  productDescription: z.string().optional(),
  rate: z.string().regex(/^[0-9]{1,2}(\.[0-9]{1,2})?%$/, "Rate must be in format like '0%' or '17%'"),
  uoM: z.string().optional(),
  quantity: z.number().min(0, "Quantity must be >= 0"),
  totalValues: z.number().min(0, "Total values must be >= 0"),
  valueSalesExcludingST: z.number().min(0, "Value sales excluding ST must be >= 0"),
  fixedNotifiedValueOrRetailPrice: z.number().min(0, "Fixed notified value or retail price must be >= 0"),
  salesTaxApplicable: z.number().min(0, "Sales tax applicable must be >= 0"),
  salesTaxWithheldAtSource: z.number().min(0, "Sales tax withheld at source must be >= 0"),
  furtherTax: z.number().min(0, "Further tax must be >= 0"),
  fedPayable: z.number().min(0, "FED payable must be >= 0"),
  discount: z.number().min(0, "Discount must be >= 0"),
  extraTax: z.union([
    z.string().refine(val => val === "" || /^[0-9]{1,2}(\.[0-9]{1,2})?%$/.test(val), "Extra tax must be empty or in format like '0%'"),
    z.number().min(0, "Extra tax must be >= 0")
  ]),
  sroScheduleNo: z.string().optional(),
  saleType: z.string().optional(),
  sroItemSerialNo: z.string().optional(),
});

// GovInvoice Schema
export const GovInvoiceSchema = z.object({
  invoiceType: z.enum(["Sale Invoice", "Credit Note", "Debit Note", "STWH"], {
    errorMap: () => ({ message: "Invoice type must be one of: Sale Invoice, Credit Note, Debit Note, STWH" })
  }),
  invoiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invoice date must be in format yyyy-MM-dd"),
  sellerNTNCNIC: z.string().regex(/^\d{7,15}$/, "Seller NTN/CNIC must be 7-15 digits only"),
  buyerNTNCNIC: z.string().regex(/^\d{7,15}$/, "Buyer NTN/CNIC must be 7-15 digits only"),
  sellerBusinessName: z.string().min(1, "Seller business name cannot be empty"),
  buyerBusinessName: z.string().min(1, "Buyer business name cannot be empty"),
  sellerAddress: z.string().min(1, "Seller address cannot be empty"),
  buyerAddress: z.string().min(1, "Buyer address cannot be empty"),
  sellerProvince: z.string().min(1, "Seller province cannot be empty"),
  buyerProvince: z.string().min(1, "Buyer province cannot be empty"),
  buyerRegistrationType: z.enum(["Registered", "Unregistered", "Unregistered Distributor", "Retail Consumer"], {
    errorMap: () => ({ message: "Buyer registration type must be one of: Registered, Unregistered, Unregistered Distributor, Retail Consumer" })
  }),
  invoiceRefNo: z.string().optional(),
  scenarioId: z.string().regex(/^SN[0-9]{3}$/, "Scenario ID must be in format SN followed by 3 digits"),
  items: z.array(GovInvoiceItemSchema).min(1, "At least one item is required"),
});

// Helper function to create empty invoice
export const emptyInvoice = () => ({
  invoiceType: "Sale Invoice",
  invoiceDate: new Date().toISOString().split('T')[0], // Current date in yyyy-MM-dd format
  sellerNTNCNIC: "",
  buyerNTNCNIC: "",
  sellerBusinessName: "",
  buyerBusinessName: "",
  sellerAddress: "",
  buyerAddress: "",
  sellerProvince: "",
  buyerProvince: "",
  buyerRegistrationType: "Registered",
  invoiceRefNo: "",
  scenarioId: "SN001",
  items: [emptyItem()],
});

// Helper function to create empty item
export const emptyItem = () => ({
  hsCode: "0000.0000",
  productDescription: "",
  rate: "0%",
  uoM: "",
  quantity: 0,
  totalValues: 0,
  valueSalesExcludingST: 0,
  fixedNotifiedValueOrRetailPrice: 0,
  salesTaxApplicable: 0,
  salesTaxWithheldAtSource: 0,
  furtherTax: 0,
  fedPayable: 0,
  discount: 0,
  extraTax: "0%",
  sroScheduleNo: "",
  saleType: "",
  sroItemSerialNo: "",
}); 