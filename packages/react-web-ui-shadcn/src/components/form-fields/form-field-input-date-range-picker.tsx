import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { InputDateRange } from '@repo/react-web-ui-shadcn/components/ahua/input-date-range';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { InputDateProps } from '../ahua/input-date';
import { HelperText } from '../form-fields-base/helper-text';

export interface InputDateRange {
  from?: Date;
  to?: Date;
}

interface IFormFieldInputDateRangePickerProps<T extends FieldValues> extends Omit<InputDateProps, 'form' | 'onChange'> {
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  visibled?: boolean;
  showErrorMessage?: boolean;
  helperText?: string;
  translator?: any;
  onChange?: (dateRange?: InputDateRange) => void;
}

const FormFieldInputDateRangePicker = <T extends FieldValues>({
  className,
  messageClassName,
  labelDisplay = 'inside',
  form,
  formLabel,
  fieldName,
  placeholder,
  disabled = false,
  visibled = true,
  size = 'default',
  required = false,
  showErrorMessage = true,
  helperText,
  disableBefore,
  dateFormat,
  locale,
  translator,
  onChange,
}: IFormFieldInputDateRangePickerProps<T>) => {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            <FormControl>
              <InputDateRange
                {...field}
                locale={locale}
                label={formLabel}
                labelDisplay={labelDisplay}
                value={field.value}
                placeholder={placeholder}
                disabled={disabled}
                size={size}
                required={required}
                error={!!error}
                disableBefore={disableBefore}
                dateFormat={dateFormat}
                onChange={dateRange => {
                  field.onChange(dateRange);
                  onChange?.(dateRange);
                }}
              />
            </FormControl>
            {!error && <HelperText text={helperText} />}
            {showErrorMessage && error && (
              <FormMessage className={messageClassName} message={translator ? translator(error.message || '') : error.message} />
            )}
          </FormItem>
        );
      }}
    />
  );
};

export default FormFieldInputDateRangePicker;
