import {
  BarChart3,
  Bot,
  Cloud,
  Code2,
  Cpu,
  LayoutDashboard,
  Megaphone,
  Palette,
  PenTool,
  Plug,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export const categories = ['All', 'Development', 'Design & Brand', 'Marketing & Data', 'Cloud, Security & AI'] as const;
export type Category = Exclude<(typeof categories)[number], 'All'>;

// Photos: Unsplash (free to use, unsplash.com/license), stored in public/images/services.
export type Service = { title: string; description: string; category: Category; icon: LucideIcon; image: string };

export const services: Service[] = [
  { title: 'Website Development', image: '/images/services/website-development.jpg', icon: Code2, category: 'Development', description: 'Fast, responsive and SEO-friendly websites that represent your brand and drive results.' },
  { title: 'E-Commerce Solutions', image: '/images/services/e-commerce.jpg', icon: ShoppingCart, category: 'Development', description: 'Secure online stores with smooth payments, inventory management and a seamless shopping experience.' },
  { title: 'Mobile App Development', image: '/images/services/mobile-apps.jpg', icon: Smartphone, category: 'Development', description: 'High-performance Android & iOS apps that engage users and grow your business.' },
  { title: 'UI/UX Design', image: '/images/services/ui-ux-design.jpg', icon: PenTool, category: 'Design & Brand', description: 'Creative, intuitive designs that enhance usability and strengthen your brand identity.' },
  { title: 'Digital Marketing', image: '/images/services/digital-marketing.jpg', icon: Megaphone, category: 'Marketing & Data', description: 'SEO, Social Media, Google Ads and content strategies that increase traffic, leads and conversions.' },
  { title: 'Software Development', image: '/images/services/software-development.jpg', icon: Cpu, category: 'Development', description: 'Custom software tailored to your business processes to improve efficiency and growth.' },
  { title: 'Cloud Solutions', image: '/images/services/cloud-solutions.jpg', icon: Cloud, category: 'Cloud, Security & AI', description: 'Cloud migration, deployment and management for scalable, reliable, cost-effective infrastructure.' },
  { title: 'Cyber Security', image: '/images/services/cyber-security.jpg', icon: ShieldCheck, category: 'Cloud, Security & AI', description: 'Advanced security solutions, monitoring and vulnerability assessments to protect your data.' },
  { title: 'Branding & Identity', image: '/images/services/branding-identity.jpg', icon: Palette, category: 'Design & Brand', description: 'Logos, brand guidelines and visual identity that make your brand memorable.' },
  { title: 'IT Support & Maintenance', image: '/images/services/it-support.jpg', icon: Wrench, category: 'Cloud, Security & AI', description: 'Reliable support and maintenance to keep your systems running smoothly.' },
  { title: 'AI & Automation', image: '/images/services/ai-automation.jpg', icon: Bot, category: 'Cloud, Security & AI', description: 'Automate workflows and leverage AI for efficiency and smarter decisions.' },
  { title: 'API & Integrations', image: '/images/services/api-integrations.jpg', icon: Plug, category: 'Development', description: 'Seamless integrations connecting your systems, third-party services and applications.' },
  { title: 'SEO & Analytics', image: '/images/services/seo-analytics.jpg', icon: Search, category: 'Marketing & Data', description: 'Improve search rankings, track performance and grow organic traffic with data-driven SEO.' },
  { title: 'Business Analytics', image: '/images/services/business-analytics.jpg', icon: BarChart3, category: 'Marketing & Data', description: 'Data analysis and reporting to help you make smarter decisions and increase profitability.' },
  { title: 'Custom Dashboards', image: '/images/services/custom-dashboards.jpg', icon: LayoutDashboard, category: 'Marketing & Data', description: 'Real-time dashboards tailored to your KPIs for better monitoring and performance tracking.' },
];
