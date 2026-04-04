import { createFileRoute } from "@tanstack/react-router"
import { Content } from "../components/Content.tsx"
import { Footer } from "../components/Footer.tsx"
import { Section } from "../components/Section.tsx"
import { SectionHeader } from "../components/SectionHeader.tsx"

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
