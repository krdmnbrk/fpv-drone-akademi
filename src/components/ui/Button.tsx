import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { buttonClasses, type ButtonStyleOptions } from './buttonVariants';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleOptions;

/** Action button. Use ButtonLink for navigation. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...rest}
    />
  );
});

type ButtonLinkProps = LinkProps & ButtonStyleOptions;

/** Router link styled as a button. */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant, size, className, ...rest },
  ref,
) {
  return <Link ref={ref} className={buttonClasses({ variant, size, className })} {...rest} />;
});
