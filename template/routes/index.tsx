import { createFileRoute } from "@tanstack/react-router"
import { Content } from "#components/layout/Content.tsx"
import { Footer } from "#components/layout/Footer.tsx"
import { Section } from "#components/shared/Section.tsx"
import { SectionHeader } from "#components/shared/SectionHeader.tsx"

export const Route = createFileRoute("/")({
  component: Component,
})

function Component() {
  return (
    <>
      <Section>
        <Content>
          <SectionHeader
            label="Welcome"
            title="My Project"
            subtitle="Get started by editing this page"
          />
        </Content>
      </Section>
      <Footer />
    </>
  )
}
