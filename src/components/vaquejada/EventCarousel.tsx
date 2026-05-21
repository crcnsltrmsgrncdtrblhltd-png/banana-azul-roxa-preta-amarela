"use client";

import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { VaquejadaResumo } from "@/lib/types";
import { EventCard } from "@/components/vaquejada/EventCard";

interface EventCarouselProps {
  eventos: VaquejadaResumo[];
}

export function EventCarousel({ eventos }: EventCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="-mx-2 overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="min-w-0 flex-shrink-0 basis-full px-2 md:basis-1/2 lg:basis-1/3"
          >
            <EventCard evento={evento} />
          </div>
        ))}
      </div>
    </div>
  );
}
