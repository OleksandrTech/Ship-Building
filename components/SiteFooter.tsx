"use client";

type FooterProps = {
  companyName: string;
  description?: string;
};

export default function SiteFooter({ companyName, description }: FooterProps) {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("section-highlight");
    setTimeout(() => el.classList.remove("section-highlight"), 600);
  }

  return (
    <>
      <style>{`
        @keyframes sectionPulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.45); background-color: rgba(255,255,255,0.28); }
          50%  { box-shadow: 0 0 0 8px rgba(255,255,255,0); background-color: rgba(255,255,255,0.42); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); background-color: rgba(255,255,255,0.1); }
        }
        .section-highlight {
          animation: sectionPulse 0.55s ease-out forwards;
        }
      `}</style>
      <footer
        style={{
          background: "#1a1a1a",
          color: "#9ca3af",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          borderTop: "1px solid #2d2d2d",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "56px 32px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: "48px",
            alignItems: "start",
          }}
          className="footer-grid"
        >
        {/* Left: Company info */}
        <div>
          <h3
            style={{
              color: "#f3f4f6",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "14px",
              letterSpacing: "0.01em",
            }}
          >
            {companyName}
          </h3>
          <p
            style={{
              fontSize: "13.5px",
              lineHeight: "1.75",
              color: "#9ca3af",
              maxWidth: "280px",
            }}
          >
            {description ??
              '"involved from design to delivery" — Together with our clients we develop concepts and evaluate feasibility. We design, we engineer, we develop and we supervise your project.'}
          </p>
        </div>

        {/* Center: Gallery anchor */}
        <div>
          <h4
            style={{
              color: "#f3f4f6",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "16px",
            }}
          >
            Gallery
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {["View Gallery"].map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => scrollTo("section-gallery")}
                  style={{
                    background: "none",
                    border: "1px solid #3d3d3d",
                    borderRadius: "6px",
                    color: "#d1d5db",
                    fontSize: "13.5px",
                    padding: "8px 14px",
                    cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                    textAlign: "left",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#6b7280";
                    (e.currentTarget as HTMLButtonElement).style.color = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#3d3d3d";
                    (e.currentTarget as HTMLButtonElement).style.color = "#d1d5db";
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Navigation */}
        <div>
          <h4
            style={{
              color: "#f3f4f6",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "16px",
            }}
          >
            Navigate
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "What we do", target: "section-services" },
              { label: "Gallery", target: "section-gallery" },
              { label: "Contacts", target: "section-contacts" },
            ].map(({ label, target }) => (
              <li key={target}>
                <button
                  type="button"
                  onClick={() => scrollTo(target)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    fontSize: "13.5px",
                    transition: "color 0.2s",
                    textAlign: "left",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#f3f4f6")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Far right: Social icons */}
        <div className="social-icons" style={{ display: "flex", flexDirection: "row", gap: "14px", alignItems: "center" }}>
          <style>{`
            @media (min-width: 768px) {
              .social-icons {
                flexDirection: column !important;
              }
            }
          `}</style>
          {/* Instagram */}
          <a
            href="#"
            aria-label="Instagram"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              border: "1px solid #3d3d3d",
              color: "#9ca3af",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#6b7280";
              (e.currentTarget as HTMLAnchorElement).style.color = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#3d3d3d";
              (e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="#"
            aria-label="Facebook"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              border: "1px solid #3d3d3d",
              color: "#9ca3af",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#6b7280";
              (e.currentTarget as HTMLAnchorElement).style.color = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#3d3d3d";
              (e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="#"
            aria-label="LinkedIn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              border: "1px solid #3d3d3d",
              color: "#9ca3af",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#6b7280";
              (e.currentTarget as HTMLAnchorElement).style.color = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#3d3d3d";
              (e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid #2d2d2d",
          padding: "16px 32px",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        <span>© {new Date().getFullYear()} {companyName}. All rights reserved.</span>
        <span>Built with precision engineering</span>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
    </>
  );
}