import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

// Acordeón accesible (Radix): navegación por teclado, roles ARIA y animación de
// altura con la variable --radix-accordion-content-height (ver globals.css).

export interface AccordionEntry {
  id: string
  title: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionEntry[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn('w-full', className)}>
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          className="border-b border-border last:border-b-0"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-medium text-ink transition-colors hover:text-brand">
              {item.title}
              <ChevronDown
                className="size-5 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="accordion-anim overflow-hidden">
            <div className="pb-4 text-sm leading-relaxed text-muted">{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
