import React, { useState, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface ButtonProps {
  // Content
  children?: ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';

  // Tooltip
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';

  // Popup
  popup?: ReactNode;
  popupPosition?: 'top' | 'bottom' | 'left' | 'right';

  // Actions
  onClick?: (() => void) | undefined;
  onAction?: ((action: string) => void) | undefined;

  // States
  disabled?: boolean;
  loading?: boolean;
  active?: boolean | undefined;

  // Variants
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';

  // Styling
  rounded?: boolean;

  // Additional props
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  'aria-label'?: string;
}

export default function Button({
  children,
  icon: Icon,
  iconPosition = 'left',
  tooltip,
  tooltipPosition = 'top',
  popup,
  popupPosition = 'bottom',
  onClick,
  onAction,
  disabled = false,
  loading = false,
  active = false,
  variant = 'secondary',
  size = 'md',
  className,
  type = 'button',
  title,
  'aria-label': ariaLabel,
  rounded = false,
  ...props
}: ButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    if (disabled || loading) return;

    if (popup) {
      setShowPopup(!showPopup);
    } else if (onClick) {
      onClick();
    } else if (onAction) {
      onAction('click');
    }
  };

  const handleMouseEnter = () => {
    if (tooltip && !disabled) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setShowPopup(false);
  };

  // Base classes
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-2 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
    xl: 'px-6 py-3 text-lg gap-3',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 focus:ring-neutral-500',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-500',
    outline:
      'bg-transparent border border-neutral-200 hover:bg-neutral-50 text-neutral-700 focus:ring-neutral-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
  };

  // Active state
  const activeClasses = active ? 'ring-2 ring-blue-500 ring-offset-2' : '';

  // Icon size based on button size
  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
  };

  return (
    <div className='relative' onMouseLeave={handleMouseLeave}>
      <button
        type={type}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          activeClasses,
          rounded ? 'rounded-full' : 'rounded-md',
          className,
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        disabled={disabled}
        title={title}
        aria-label={ariaLabel || tooltip}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
        )}

        {/* Left icon */}
        {Icon && iconPosition === 'left' && !loading && <Icon size={iconSize[size]} />}

        {/* Content */}
        {children}

        {/* Right icon */}
        {Icon && iconPosition === 'right' && !loading && <Icon size={iconSize[size]} />}
      </button>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs text-white bg-neutral-800 rounded shadow-lg whitespace-nowrap',
            tooltipPosition === 'top' && 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
            tooltipPosition === 'bottom' && 'top-full left-1/2 transform -translate-x-1/2 mt-1',
            tooltipPosition === 'left' && 'right-full top-1/2 transform -translate-y-1/2 mr-1',
            tooltipPosition === 'right' && 'left-full top-1/2 transform -translate-y-1/2 ml-1',
          )}
        >
          {tooltip}
          {/* Tooltip arrow */}
          <div
            className={cn(
              'absolute w-2 h-2 bg-neutral-800 transform rotate-45',
              tooltipPosition === 'top' && 'top-full left-1/2 transform -translate-x-1/2 -mt-1',
              tooltipPosition === 'bottom' &&
                'bottom-full left-1/2 transform -translate-x-1/2 -mb-1',
              tooltipPosition === 'left' && 'left-full top-1/2 transform -translate-y-1/2 -ml-1',
              tooltipPosition === 'right' && 'right-full top-1/2 transform -translate-y-1/2 -mr-1',
            )}
          />
        </div>
      )}

      {/* Popup */}
      {popup && showPopup && (
        <div
          className={cn(
            'absolute z-50 bg-white border border-neutral-200 rounded-lg shadow-xl p-4 min-w-48',
            popupPosition === 'top' && 'bottom-full left-0 mb-2',
            popupPosition === 'bottom' && 'top-full left-0 mt-2',
            popupPosition === 'left' && 'right-full top-0 mr-2',
            popupPosition === 'right' && 'left-full top-0 ml-2',
          )}
        >
          {popup}
          {/* Popup arrow */}
          <div
            className={cn(
              'absolute w-3 h-3 bg-white border border-neutral-200 transform rotate-45',
              popupPosition === 'top' && 'top-full left-4 -mt-1.5 border-t-0 border-l-0',
              popupPosition === 'bottom' && 'bottom-full left-4 -mb-1.5 border-b-0 border-r-0',
              popupPosition === 'left' && 'left-full top-4 -ml-1.5 border-l-0 border-t-0',
              popupPosition === 'right' && 'right-full top-4 -mr-1.5 border-r-0 border-b-0',
            )}
          />
        </div>
      )}
    </div>
  );
}
