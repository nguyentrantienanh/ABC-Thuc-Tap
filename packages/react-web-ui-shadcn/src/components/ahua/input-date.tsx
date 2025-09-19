import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { format, isValid, Locale } from 'date-fns';
import { CalendarDaysIcon } from 'lucide-react';
import { Calendar } from '@repo/react-web-ui-shadcn/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/react-web-ui-shadcn/components/ui/popover';
import { cn } from '../../lib/utils';
import { Matcher } from 'react-day-picker';
import { InputLabel, InputLabelOutside } from './input-base';

const CURRENT_YEAR = new Date().getFullYear();

const formControlVariants = cva(
  'grid items-center relative w-full rounded-md border border-input bg-background leading-none ring-offset-background',
  {
    variants: {
      size: {
        default: 'h-14',
        sm: 'h-10',
      },
      state: {
        default: '',
        focused: 'ring-2 ring-ring ring-offset-2',
        disabled: 'cursor-not-allowed bg-muted',
        error: 'border-destructive bg-destructive/10',
        errorFocused: 'bg-destructive/10 ring-2 ring-destructive ring-offset-2',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

const contentVariants = cva('px-3 text-sm whitespace-nowrap font-medium', {
  variants: {
    size: {
      default: '!leading-[24px] h-[28px]',
      sm: '!leading-[22px] h-[22px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const triggerVariants = cva('grid w-full justify-between focus:outline-none text-left', {
  variants: {
    size: {
      default: '',
      sm: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const triggerIconVariants = cva('text-muted-foreground absolute -translate-y-1/2', {
  variants: {
    size: {
      default: 'top-1/2 h-4 w-4 right-3',
      sm: 'top-1/2 h-3 w-3 right-3',
    },
    state: {
      default: '',
      disabled: 'opacity-50',
    },
  },
  defaultVariants: {
    size: 'default',
    state: 'default',
  },
});

export interface InputDateProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'value' | 'onChange'> {
  value?: Date;
  label?: string;
  labelDisplay?: 'inside' | 'outside';
  required?: boolean;
  disabled?: boolean;
  size?: 'default' | 'sm';
  labelClassName?: string;
  placeholder?: string;
  fromYear?: number;
  toYear?: number;
  disableBefore?: Date;
  dateFormat?: string;
  error?: boolean;
  locale?: Locale;
  onChange: (date?: Date) => void;
}

const InputDate = React.forwardRef<HTMLButtonElement, InputDateProps>(
  (
    {
      value,
      label,
      labelDisplay = 'inside',
      required = false,
      disabled = false,
      size = 'default',
      className,
      labelClassName,
      placeholder = 'Pick a date',
      fromYear = CURRENT_YEAR,
      toYear = CURRENT_YEAR + 10,
      disableBefore,
      dateFormat = 'dd/MM/yyyy',
      error,
      locale,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const ID = new Date().getTime();

    const formattedValue = useMemo(() => {
      if (!value || !isValid(value)) return '';
      try {
        const dateString = format(value, dateFormat);
        return dateString;
      } catch (e) {
        return '';
      }
    }, [value, dateFormat]);

    const getFormControlState = () => {
      if (disabled) return 'disabled';
      if (error) return isFocused ? 'errorFocused' : 'error';
      if (isFocused) return 'focused';
      return 'default';
    };

    const handleSelect = (date?: Date) => {
      if (disabled) return;
      onChange(date);
      setIsOpen(false);
      setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      const target = e.relatedTarget as Node | null;
      const isInsidePopover = popoverRef.current?.contains(target);
      const isInsideCalendar = target instanceof Element && target.closest('.rdp');

      if (!isInsidePopover && !isInsideCalendar) {
        setIsFocused(false);
        onBlur?.(e);
      }
    };

    const handleFocus = () => {
      if (!disabled) {
        setIsFocused(true);
      }
    };

    const handleOpenChange = (open: boolean) => {
      if (disabled) {
        setIsOpen(false);
        return;
      }

      setIsOpen(open);
      if (open) setIsFocused(true);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsidePopover = popoverRef.current?.contains(target);
      const isInsideCalendar =
        target instanceof Element && (target.closest('.rdp') || target.closest('[role="listbox"]') || target.closest('[role="combobox"]'));

      if (!isInsideContainer && !isInsidePopover && !isInsideCalendar) {
        setIsFocused(false);
      }
    }, []);

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    return (
      <>
        {label && labelDisplay === 'outside' && (
          <InputLabelOutside htmlFor={`input-${ID}`} label={label} required={required} className={cn(labelClassName)} />
        )}
        <div ref={containerRef} className={cn(formControlVariants({ size, state: getFormControlState() }), className)}>
          <div>
            <Popover open={isOpen} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <button
                  {...props}
                  ref={ref}
                  aria-label="input-date"
                  className={cn(triggerVariants({ size }), disabled && 'cursor-not-allowed')}
                  aria-expanded={isOpen}
                  disabled={disabled}
                  type="button"
                  onClick={() => !disabled && setIsFocused(true)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <CalendarDaysIcon className={triggerIconVariants({ size: 'default', state: disabled ? 'disabled' : 'default' })} />
                  {label && labelDisplay === 'inside' && (
                    <InputLabel htmlFor={`input-${ID}`} label={label} required={required} size={size} className={cn(labelClassName)} />
                  )}
                  <p className={cn(contentVariants({ size }), disabled && 'opacity-50')}>
                    {value ? <span className="text-foreground">{formattedValue}</span> : <span className="text-muted-foreground">{placeholder}</span>}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent ref={popoverRef} className="w-auto p-0" align="start">
                <Calendar
                  locale={locale}
                  initialFocus
                  mode="single"
                  captionLayout="dropdown-buttons"
                  fromYear={fromYear}
                  toYear={toYear}
                  defaultMonth={value}
                  selected={value}
                  disabled={{ before: disableBefore } as Matcher}
                  onSelect={handleSelect}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </>
    );
  }
);

InputDate.displayName = 'InputDate';

export { InputDate };
