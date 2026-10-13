import Image from "next/image";
import type { ReactNode } from "react";

type GameEntryScreenProps = {
  title: string;
  description: string;
  image: string;
  children: ReactNode;
};

export default function GameEntryScreen({
  title,
  description,
  image,
  children,
}: GameEntryScreenProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center overflow-hidden bg-[#180e13] px-4 py-20 text-white sm:px-8">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-[24px] border border-white/10 bg-[#241519] shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-64 md:min-h-[500px]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#180e13] via-[#180e13]/10 to-[#180e13]/15 md:bg-gradient-to-r md:from-transparent md:via-[#180e13]/15 md:to-[#241519]"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:bottom-8 md:p-10">
            <h1 className="max-w-lg text-3xl font-black leading-[0.98] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-rose-100/80 sm:text-base">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 p-6 sm:p-10 lg:p-12">
          {children}
        </div>
      </section>
    </div>
  );
}
