import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { GovInvoiceSchema, emptyInvoice } from "@/domain/govInvoice.schema";
import {
  PROVINCES,
  BUYER_TYPES,
  DOCUMENT_TYPES,
  SALE_TYPES,
  UOMS,
} from "@/constants/invoiceOptions";

export function GovInvoiceModal({ open, onClose, onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(GovInvoiceSchema),
    defaultValues: emptyInvoice(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleFormSubmit = (data) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("GovInvoice Form Data:", data);
    }
    onClose();
  };

  const handleFormError = (errors) => {
    console.log("Form validation errors:", errors);
    // Don't close the modal when there are validation errors
  };

  const handleCancel = () => {
    reset(emptyInvoice());
    onClose();
  };

  const addItem = () => {
    append({
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
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <DialogHeader className="justify-between p-6 border-b border-gray-100">
          <Typography variant="h4" color="blue-gray" className="font-bold">
            Government Invoice
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)}>
          <DialogBody className="overflow-y-auto max-h-[70vh] p-6">
            {/* General Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-red-700 font-medium">Please fix the following errors:</p>
                </div>
                <ul className="text-red-600 text-sm space-y-1">
                  {errors.invoiceType && <li>• Invoice Type: {errors.invoiceType.message}</li>}
                  {errors.invoiceDate && <li>• Invoice Date: {errors.invoiceDate.message}</li>}
                  {errors.sellerNTNCNIC && <li>• Seller NTN/CNIC: {errors.sellerNTNCNIC.message}</li>}
                  {errors.sellerBusinessName && <li>• Seller Business Name: {errors.sellerBusinessName.message}</li>}
                  {errors.sellerAddress && <li>• Seller Address: {errors.sellerAddress.message}</li>}
                  {errors.sellerProvince && <li>• Seller Province: {errors.sellerProvince.message}</li>}
                  {errors.buyerNTNCNIC && <li>• Buyer NTN/CNIC: {errors.buyerNTNCNIC.message}</li>}
                  {errors.buyerBusinessName && <li>• Buyer Business Name: {errors.buyerBusinessName.message}</li>}
                  {errors.buyerAddress && <li>• Buyer Address: {errors.buyerAddress.message}</li>}
                  {errors.buyerProvince && <li>• Buyer Province: {errors.buyerProvince.message}</li>}
                  {errors.buyerRegistrationType && <li>• Buyer Registration Type: {errors.buyerRegistrationType.message}</li>}
                  {errors.scenarioId && <li>• Scenario ID: {errors.scenarioId.message}</li>}
                  {errors.items && <li>• Items: Please check the item details below</li>}
                </ul>
              </div>
            )}
            
            <div className="grid gap-8">
              {/* Invoice Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Invoice Type</label>
                  <select
                    {...register("invoiceType")}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                      errors.invoiceType ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.invoiceType && (
                    <p className="text-red-500 text-sm mt-1">{errors.invoiceType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Invoice Date</label>
                  <input
                    type="date"
                    {...register("invoiceDate")}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                      errors.invoiceDate ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.invoiceDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.invoiceDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Invoice Ref No</label>
                  <input
                    {...register("invoiceRefNo")}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                      errors.invoiceRefNo ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter reference number"
                  />
                  {errors.invoiceRefNo && (
                    <p className="text-red-500 text-sm mt-1">{errors.invoiceRefNo.message}</p>
                  )}
                </div>
              </div>

              {/* Seller Information */}
              <div className="border-t pt-6">
                <Typography variant="h6" color="blue-gray" className="mb-6">
                  Seller Information
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Seller NTN/CNIC</label>
                    <input
                      {...register("sellerNTNCNIC")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.sellerNTNCNIC ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter NTN/CNIC"
                    />
                    {errors.sellerNTNCNIC && (
                      <p className="text-red-500 text-sm mt-1">{errors.sellerNTNCNIC.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Seller Business Name</label>
                    <input
                      {...register("sellerBusinessName")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.sellerBusinessName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter business name"
                    />
                    {errors.sellerBusinessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.sellerBusinessName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Seller Address</label>
                    <input
                      {...register("sellerAddress")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.sellerAddress ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter address"
                    />
                    {errors.sellerAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.sellerAddress.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Seller Province</label>
                    <select
                      {...register("sellerProvince")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.sellerProvince ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      {PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    {errors.sellerProvince && (
                      <p className="text-red-500 text-sm mt-1">{errors.sellerProvince.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="border-t pt-6">
                <Typography variant="h6" color="blue-gray" className="mb-6">
                  Buyer Information
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Buyer NTN/CNIC</label>
                    <input
                      {...register("buyerNTNCNIC")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.buyerNTNCNIC ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter NTN/CNIC"
                    />
                    {errors.buyerNTNCNIC && (
                      <p className="text-red-500 text-sm mt-1">{errors.buyerNTNCNIC.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Buyer Business Name</label>
                    <input
                      {...register("buyerBusinessName")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.buyerBusinessName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter business name"
                    />
                    {errors.buyerBusinessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.buyerBusinessName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Buyer Address</label>
                    <input
                      {...register("buyerAddress")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.buyerAddress ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter address"
                    />
                    {errors.buyerAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.buyerAddress.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Buyer Province</label>
                    <select
                      {...register("buyerProvince")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.buyerProvince ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      {PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    {errors.buyerProvince && (
                      <p className="text-red-500 text-sm mt-1">{errors.buyerProvince.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Buyer Registration Type</label>
                    <select
                      {...register("buyerRegistrationType")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.buyerRegistrationType ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      {BUYER_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.buyerRegistrationType && (
                      <p className="text-red-500 text-sm mt-1">{errors.buyerRegistrationType.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Scenario ID</label>
                    <input
                      {...register("scenarioId")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                        errors.scenarioId ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter scenario ID"
                    />
                    {errors.scenarioId && (
                      <p className="text-red-500 text-sm mt-1">{errors.scenarioId.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <Typography variant="h6" color="blue-gray">
                    Invoice Items
                  </Typography>
                  <Button
                    size="sm"
                    color="blue-gray"
                    onClick={addItem}
                    className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-6">
                      <Typography variant="h6" color="blue-gray">
                        Item {index + 1}
                      </Typography>
                      {fields.length > 1 && (
                        <IconButton
                          size="sm"
                          color="red"
                          variant="text"
                          onClick={() => remove(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      )}
                    </div>
                    
                    {/* Item-level errors */}
                    {errors.items?.[index] && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-medium">Please fix the following errors in Item {index + 1}:</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">HS Code</label>
                        <input
                          {...register(`items.${index}.hsCode`)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                            errors.items?.[index]?.hsCode ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="0000.0000"
                        />
                        {errors.items?.[index]?.hsCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.items[index].hsCode.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Product Description</label>
                        <input
                          {...register(`items.${index}.productDescription`)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                            errors.items?.[index]?.productDescription ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Enter product description"
                        />
                        {errors.items?.[index]?.productDescription && (
                          <p className="text-red-500 text-sm mt-1">{errors.items[index].productDescription.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Rate</label>
                        <input
                          {...register(`items.${index}.rate`)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                            errors.items?.[index]?.rate ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="0%"
                        />
                        {errors.items?.[index]?.rate && (
                          <p className="text-red-500 text-sm mt-1">{errors.items[index].rate.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Unit of Measure</label>
                        <select
                          {...register(`items.${index}.uoM`)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                            errors.items?.[index]?.uoM ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          {UOMS.map((uom) => (
                            <option key={uom} value={uom}>
                              {uom}
                            </option>
                          ))}
                        </select>
                        {errors.items?.[index]?.uoM && (
                          <p className="text-red-500 text-sm mt-1">{errors.items[index].uoM.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Quantity</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                            errors.items?.[index]?.quantity ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="0.00"
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="text-red-500 text-sm mt-1">{errors.items[index].quantity.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Total Values</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.totalValues`, { valueAsNumber: true })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Value Sales Excluding ST</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.valueSalesExcludingST`, { valueAsNumber: true })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Fixed Notified Value</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.fixedNotifiedValueOrRetailPrice`, { valueAsNumber: true })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Sales Tax Applicable</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.salesTaxApplicable`, { valueAsNumber: true })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Sales Tax Withheld</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.salesTaxWithheldAtSource`, { valueAsNumber: true })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Further Tax</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.furtherTax`, { valueAsNumber: true })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">FED Payable</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.fedPayable`, { valueAsNumber: true })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Discount</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.discount`, { valueAsNumber: true })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Extra Tax</label>
                        <input
                          {...register(`items.${index}.extraTax`)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="0%"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">SRO Schedule No</label>
                        <input
                          {...register(`items.${index}.sroScheduleNo`)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="Enter SRO schedule number"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Sale Type</label>
                        <select
                          {...register(`items.${index}.saleType`)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                        >
                          {SALE_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">SRO Item Serial No</label>
                        <input
                          {...register(`items.${index}.sroItemSerialNo`)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                          placeholder="Enter SRO item serial number"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="flex justify-end gap-2 p-6 border-t border-gray-100 bg-gray-50">
            <Button variant="text" color="red" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              color="blue-gray" 
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </div>
    </div>
  );
}

export default GovInvoiceModal; 