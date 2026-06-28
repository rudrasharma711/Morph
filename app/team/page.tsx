import PageShell from "@/components/ui/PageShell";
import TeamGrid from "@/components/team/TeamGrid";

export const metadata = {
  title: "Team — Morph",
  description:
    "Meet the people behind Morph Labs — building a web that bends to the person using it.",
};

export default function Page() {
  return (
    <PageShell
      eyebrow="Team"
      title="The people behind Morph."
      intro="A small team with a single conviction: the internet should adapt to you."
      width="wide"
      centered
    >
      <TeamGrid />
    </PageShell>
  );
}
