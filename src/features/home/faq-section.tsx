import { Container } from '@/components/layout/container'
import { SectionHeading } from '@/components/shared/section-heading'
import { Accordion, type AccordionEntry } from '@/components/ui/accordion'
import { faqItems } from '@/data/faq'

// Preguntas frecuentes (los mismos datos alimentan el JSON-LD FAQPage en home).
export function FaqSection() {
  const entries: AccordionEntry[] = faqItems.map((item) => ({
    id: item.id,
    title: item.question,
    content: <p>{item.answer}</p>,
  }))

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Dudas frecuentes"
          title="Todo lo que preguntan antes de reservar"
          align="center"
        />
        <div className="mx-auto mt-8 max-w-3xl">
          <Accordion items={entries} />
        </div>
      </Container>
    </section>
  )
}
