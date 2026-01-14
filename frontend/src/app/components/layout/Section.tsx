export default function Section({
                                  children,
                                  variant = "default",
                                }: {
  children: React.ReactNode;
  variant?: "default" | "surface" | "accent";
}) {
  const variants = {
    default: "bg-background-light dark:bg-background-dark",
    surface: "bg-surface-light dark:bg-surface-dark",
    accent: "bg-accent-soft dark:bg-accent/10",
  };

  return (
    <section className={`w-full ${variants[variant]}`}>
      <div className="mx-auto max-w-7xl px-6 py-24">
        {children}
      </div>
    </section>
  );
}
