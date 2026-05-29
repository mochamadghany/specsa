import type { SocialLink } from "@/lib/settings";

function Icon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  if (name === "instagram") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
      </svg>
    );
  }
  if (name === "tiktok") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M16.5 3c.3 2.1 1.6 3.6 3.5 3.9v2.5c-1.3.1-2.5-.3-3.6-1v6.2c0 3.2-2.4 5.4-5.3 5.4-2.7 0-4.8-2-4.8-4.7 0-2.9 2.4-4.9 5.4-4.4v2.6c-.4-.1-.9-.2-1.3-.2-1.2 0-2 .8-2 1.9 0 1.2.9 2 2.1 2 1.3 0 2.2-1 2.2-2.6V3h3.4z" />
      </svg>
    );
  }
  if (name === "youtube") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M23 12s0-3.2-.4-4.7c-.2-.9-.9-1.5-1.7-1.7C19.3 5.2 12 5.2 12 5.2s-7.3 0-8.9.4c-.8.2-1.5.8-1.7 1.7C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.7 1.7 1.6.4 8.9.4 8.9.4s7.3 0 8.9-.4c.8-.2 1.5-.8 1.7-1.7.4-1.5.4-4.7.4-4.7zM9.8 15V9l5.2 3-5.2 3z" />
      </svg>
    );
  }
  if (name === "linkedin") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.3 18.3v-7H6v7h2.3zM7.1 10a1.3 1.3 0 1 0 0-2.7 1.3 1.3 0 0 0 0 2.7zm11.2 8.3v-3.8c0-2-1.1-3-2.6-3-1.2 0-1.7.7-2 1.1v-1H11.4c0 .7 0 7 0 7h2.3v-3.9c0-.2 0-.4.1-.6.2-.4.5-.9 1.2-.9.9 0 1.2.7 1.2 1.6v3.8h2.1z" />
      </svg>
    );
  }
  return null;
}

export default function SocialIcons({
  links,
  className = "",
  itemClassName = "",
}: {
  links: SocialLink[];
  className?: string;
  itemClassName?: string;
}) {
  if (!links.length) return null;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label}${link.handle ? ` - ${link.handle}` : ""}`}
          title={link.handle || link.label}
          className={`inline-flex transition-colors ${itemClassName}`}
        >
          <Icon name={link.key} />
        </a>
      ))}
    </div>
  );
}
