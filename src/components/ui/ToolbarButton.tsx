import React from 'react';
import { LucideIcon } from 'lucide-react';
import Button, { ButtonProps } from './Button';

export interface ToolbarButtonProps extends Omit<ButtonProps, 'size' | 'variant'> {
  // Toolbar-specific props
  compact?: boolean;
  square?: boolean;
  active?: boolean | undefined;
  divider?: boolean;

  // Icon-only button
  iconOnly?: boolean;
  icon?: LucideIcon;

  // Tooltip
  tooltip?: string;

  // Actions
  onClick?: () => void;
  onAction?: (action: string) => void;

  // States
  disabled?: boolean;
  loading?: boolean;

  // Variant override
  variant?: ButtonProps['variant'];
}

export default function ToolbarButton({
  compact = false,
  square = false,
  active = false,
  divider = false,
  iconOnly = true,
  icon: Icon,
  tooltip,
  onClick,
  onAction,
  disabled = false,
  loading = false,
  className,
  variant,
  ...props
}: ToolbarButtonProps) {
  // If it's a divider, render a visual separator
  if (divider) {
    return <div className='w-px h-6 bg-neutral-200 mx-2' />;
  }

  // Ensure icon and tooltip are provided when not a divider
  if (!Icon || !tooltip) {
    console.warn('ToolbarButton requires both icon and tooltip when not a divider');
    return null;
  }

  // Determine button size based on compact mode
  const buttonSize = compact ? 'sm' : 'md';

  // Determine variant based on active state
  const buttonVariant = active ? 'primary' : 'ghost';

  // Determine if button should be square
  const buttonClasses = square ? 'aspect-square' : '';

  return (
    <Button
      icon={Icon}
      iconPosition='left'
      tooltip={tooltip}
      tooltipPosition='bottom'
      onClick={onClick}
      onAction={onAction}
      disabled={disabled}
      loading={loading}
      active={active}
      variant={variant || buttonVariant}
      size={buttonSize}
      className={cn(buttonClasses, className)}
      {...props}
    >
      {!iconOnly && props.children}
    </Button>
  );
}

// Helper function for combining class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
