/** Site-wide copy and the routing shape. */
export const site = {
  title: "Makenna Linsky — Designer",
  description:
    "Portfolio of Makenna Linsky, a designer bringing you bold work from Duke University.",
  nav: [
    { label: "Home", href: "/" },
    // Work lives on the homepage, reached by anchor rather than its own route.
    { label: "Work", href: "/#work" },
    { label: "About", href: "/about" },
    // `short` is shown instead of `label` where the header bar is narrow.
    { label: "Playground", short: "Play", href: "/playground" },
  ],
};
