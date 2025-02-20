'use client';

import clsx from 'clsx';
import {useParams} from 'next/navigation';
import {ChangeEvent, ReactNode, useTransition} from 'react';
import {Locale, usePathname, useRouter} from '@/i18n/routing';
import { Globe } from 'lucide-react';

type Props = {
  children: ReactNode;
  defaultValue: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  return (
    <div
      className={clsx(
        'w-full h-10 flex items-center cursor-pointer hover:bg-[#f2f2f2] p-4 rounded-lg transition-all duration-300 ease-in-out',
        isPending && 'transition-opacity [&:disabled]:opacity-30'
      )}
    >
      <Globe />
      <select
        className="h-10 inline-flex items-center text-[16px] appearance-none outline-none focus:ring-0 focus:border-transparent bg-transparent pl-2 pr-6 cursor-pointer"
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
    </div>
  );
}