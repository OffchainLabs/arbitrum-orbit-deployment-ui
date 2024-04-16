'use client';

import Link, { LinkProps as NextLinkProps } from 'next/link';
import React, { PropsWithChildren } from 'react';
import { usePostHog } from 'posthog-js/react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';
import { ExternalLink } from './ExternalLink';

// Our card component can act as a Next-Link / External Link / Button or a simple div
type CardType = 'link' | 'externalLink' | 'button' | 'div';

type AnalyticsProps = {
  eventName: string;
  eventProperties?: { [property: string]: string };
};

type LinkProps = { cardType: 'link' } & NextLinkProps;
type ExternalLinkProps = {
  cardType: 'externalLink';
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = {
  cardType: 'button';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
type DivProps = React.HTMLProps<HTMLDivElement>;

type CardProps = LinkProps | ButtonProps | ExternalLinkProps | DivProps;
type CardAnalyticsProps = {
  className?: string;
  cardType?: CardType;
  analyticsProps?: AnalyticsProps;
  showExternalLinkArrow?: boolean;
};
type CardPropsWithAnalytics = CardProps & CardAnalyticsProps;

const ExternalLinkArrow = () => (
  <ArrowRightIcon className="absolute bottom-4 right-4 hidden h-4 w-4 group-hover:flex" />
);

export const Card = ({
  children,
  cardType = 'div',
  showExternalLinkArrow,
  ...props
}: PropsWithChildren<CardPropsWithAnalytics>) => {
  const posthog = usePostHog();

  const commonClassName = twMerge(
    'group w-full overflow-hidden rounded-lg bg-default-black p-4 text-sm relative transition-colors duration-300',
    props.className,
  );

  const captureEventOnClick = (e: any) => {
    try {
      if (props.analyticsProps) {
        posthog?.capture(props.analyticsProps.eventName, props.analyticsProps.eventProperties);
      }
    } catch (e) {}

    // execute the actual click event
    if (typeof props.onClick === 'function') {
      props.onClick(e);
    }
  };

  // Card that can also act as a next-optimized internal link
  if (cardType === 'link') {
    const { analyticsProps, cardType, ...cardProps } = props as LinkProps & CardAnalyticsProps;
    return (
      <Link
        {...cardProps}
        className={twMerge('hover:bg-default-black-hover cursor-pointer', commonClassName)}
        onClick={captureEventOnClick}
      >
        {children}
        {showExternalLinkArrow && <ExternalLinkArrow />}
      </Link>
    );
  }

  // Card that can also act as an external link
  if (cardType === 'externalLink') {
    const cardProps = props as ExternalLinkProps;
    return (
      <ExternalLink
        {...cardProps}
        className={twMerge('hover:bg-default-black-hover', commonClassName)}
        onClick={captureEventOnClick}
      >
        {children}

        {showExternalLinkArrow && <ExternalLinkArrow />}
      </ExternalLink>
    );
  }

  // Card that can also act as a button
  if (cardType === 'button') {
    const cardProps = props as ButtonProps;
    return (
      <button
        {...cardProps}
        className={twMerge('hover:bg-default-black-hover', commonClassName)}
        onClick={captureEventOnClick}
      >
        {children}
        {showExternalLinkArrow && <ExternalLinkArrow />}
      </button>
    );
  }

  // Normal Card without any additional functionality
  const cardProps = props as DivProps;
  return (
    <div
      {...cardProps}
      className={twMerge(
        'w-full overflow-hidden rounded-lg bg-default-black/80 p-4 text-sm',
        cardProps.className,
      )}
      onClick={captureEventOnClick}
    >
      {children}
      {showExternalLinkArrow && <ExternalLinkArrow />}
    </div>
  );
};
