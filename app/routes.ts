import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/public/layout.tsx", [
    index("routes/public/home.tsx"),
    route("portfolio", "routes/public/portfolio.tsx"),
    route("portfolio/:slug", "routes/public/portfolio-detail.tsx"),
    route("blog", "routes/public/blog.tsx"),
    route("blog/:slug", "routes/public/blog-detail.tsx"),
    route("about", "routes/public/about.tsx"),
    route("contact", "routes/public/contact.tsx"),
  ]),

  route("auth/login", "routes/auth/login.tsx"),
  route("auth/callback", "routes/auth/callback.tsx"),
  route("auth/logout", "routes/auth/logout.tsx"),

  route("resources/theme", "routes/resources/theme.ts"),
  route("sitemap.xml", "routes/resources/sitemap.ts"),
  route("robots.txt", "routes/resources/robots.ts"),
] satisfies RouteConfig;
