import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/layout/Hero";
import { StateFilter } from "@/components/vaquejada/StateFilter";
import { EventCarousel } from "@/components/vaquejada/EventCarousel";
import { vaquejadasDestaque } from "@/server/eventos";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const destaques = await vaquejadasDestaque(6);

  return (
    <>
      <Hero />

      <Container className="py-4">
        <div className="-mt-2 rounded-md bg-white px-4 py-10 shadow-sm md:px-8">
          <div className="pt-10 text-center md:pt-12">
            <h1 className="text-xl font-semibold uppercase tracking-wide text-escuro md:text-2xl">
              Qual o estado da vaquejada?
            </h1>
          </div>

          <div className="mt-6">
            <StateFilter />
          </div>

          <hr className="my-8 border-black/10" />

          <EventCarousel eventos={destaques} />

          <div className="mt-8 flex justify-center">
            <Button href="/vaquejadas" variant="verde">
              Mais vaquejadas
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
