import Image from "next/image";

export function Hero() {
  return (
    <section className="relative">
      <div className="relative h-44 w-full overflow-hidden sm:h-56 md:h-72">
        <Image
          src="/brand/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-escuro-900/55" />
      </div>

      <div className="absolute inset-x-0 -bottom-12 flex justify-center md:-bottom-16">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg md:h-36 md:w-36">
          <Image
            src="/brand/logo.png"
            alt="Sua Senha"
            width={120}
            height={120}
            className="h-20 w-auto md:h-28"
            priority
          />
        </div>
      </div>
    </section>
  );
}
