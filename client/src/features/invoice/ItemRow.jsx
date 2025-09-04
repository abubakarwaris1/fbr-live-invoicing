import React from "react";
import {
  Input,
  Select,
  Option,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { SALE_TYPES, UOMS } from "@/constants/invoiceOptions";

export function ItemRow({ index, control, register, errors, remove }) {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6" color="blue-gray">
          Item {index + 1}
        </Typography>
        <IconButton
          size="sm"
          color="red"
          variant="text"
          onClick={() => remove(index)}
        >
          <TrashIcon className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="HS Code"
          {...register(`items.${index}.hsCode`)}
          error={!!errors.items?.[index]?.hsCode}
        />
        
        <Input
          label="Product Description"
          {...register(`items.${index}.productDescription`)}
          error={!!errors.items?.[index]?.productDescription}
        />
        
        <Input
          label="Rate"
          {...register(`items.${index}.rate`)}
          error={!!errors.items?.[index]?.rate}
        />
        
        <Select
          label="Unit of Measure"
          {...register(`items.${index}.uoM`)}
          error={!!errors.items?.[index]?.uoM}
        >
          {UOMS.map((uom) => (
            <Option key={uom} value={uom}>
              {uom}
            </Option>
          ))}
        </Select>
        
        <Input
          label="Quantity"
          type="number"
          step="0.01"
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          error={!!errors.items?.[index]?.quantity}
        />
        
        <Input
          label="Total Values"
          type="number"
          step="0.01"
          {...register(`items.${index}.totalValues`, { valueAsNumber: true })}
          error={!!errors.items?.[index]?.totalValues}
        />
        
        <Input
          label="Value Sales Excluding ST"
          type="number"
          step="0.01"
          {...register(`items.${index}.valueSalesExcludingST`, { valueAsNumber: true })}
          error={!!errors.items?.[index]?.valueSalesExcludingST}
        />
        
        <Input
          label="Fixed Notified Value"
          type="number"
          step="0.01"
          {...register(`items.${index}.fixedNotifiedValueOrRetailPrice`, { valueAsNumber: true })}
          error={!!errors.items?.[index]?.fixedNotifiedValueOrRetailPrice}
        />
        
        <Input
          label="Sales Tax Applicable"
          type="number"
          step="0.01"
          {...register(`items.${index}.salesTaxApplicable`, { valueAsNumber: true })}
          error={!!errors.items?.[index]?.salesTaxApplicable}
        />
        
        <Input
          label="Sales Tax Withheld"
          type="number"
          step="0.01"
          {...register(`items.${index}.salesTaxWithheldAtSource`, { valueAsNumber: true })}
          error={!!errors.items?.[index]?.salesTaxWithheldAtSource}
        />
        
        <Input
          label="Extra Tax"
          {...register(`items.${index}.extraTax`)}
          error={!!errors.items?.[index]?.extraTax}
        />
        
        <Input
          label="Further Tax"
          type="number"
          step="0.01"
          {...register(`items.${index}.furtherTax`, { valueAsNumber: true })}
          error={!!errors.items?.[index]?.furtherTax}
        />
        
        <Input
          label="SRO Schedule No"
          {...register(`items.${index}.sroScheduleNo`)}
          error={!!errors.items?.[index]?.sroScheduleNo}
        />
        
        <Input
          label="FED Payable"
          type="number"
          step="0.01"
          {...register(`items.${index}.fedPayable`, { valueAsNumber: true })}
          error={!!errors.items?.[index]?.fedPayable}
        />
        
        <Input
          label="Discount"
          type="number"
          step="0.01"
          {...register(`items.${index}.discount`, { valueAsNumber: true })}
          error={!!errors.items?.[index]?.discount}
        />
        
        <Select
          label="Sale Type"
          {...register(`items.${index}.saleType`)}
          error={!!errors.items?.[index]?.saleType}
        >
          {SALE_TYPES.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
        
        <Input
          label="SRO Item Serial No"
          {...register(`items.${index}.sroItemSerialNo`)}
          error={!!errors.items?.[index]?.sroItemSerialNo}
        />
      </div>
    </div>
  );
}

export default ItemRow; 