"use client";

export default function SiteHeader({ companyName }: { companyName: string }) {
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

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 8px 0 rgba(0,0,0,0.07)",
        }}
      >
        <div
          className="header-container"
          style={{
            width: "100%",
            padding: "0 16px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              .header-container {
                padding: 0 50px !important;
                height: 80px !important;
              }
              .company-name {
                fontSize: clamp(16px, 1.8vw, 22px) !important;
                maxWidth: none !important;
                overflow: visible !important;
                textOverflow: clip !important;
                flexShrink: 1 !important;
                minWidth: 0 !important;
              }
              .header-nav {
                gap: 10px !important;
              }
              .nav-button {
                fontSize: 16px !important;
                padding: 8px 16px !important;
              }
            }
            @media (max-width: 1199px) and (min-width: 768px) {
              .company-name {
                flexShrink: 1 !important;
                minWidth: 0 !important;
              }
            }
            @media (max-width: 1199px) {
              .company-name {
                maxWidth: none !important;
                fontSize: 14px !important;
                whiteSpace: normal !important;
                lineHeight: 1.2 !important;
                textAlign: left !important;
              }
            }
            @media (max-width: 767px) {
              .header-nav {
                display: none !important;
              }
            }
          `}</style>
          {/* Logo / company name — left */}
          <span
            className="company-name"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 700,
              fontSize: "clamp(14px, 2vw, 18px)",
              color: "#111",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flexShrink: 1,
              minWidth: 0,
            }}
          >
            ⚓&nbsp;{companyName}
          </span>

          {/* Nav — right */}
          <nav className="header-nav" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {[
              { label: "What we do", target: "section-services" },
              { label: "Gallery",    target: "section-gallery" },
              { label: "Contacts",   target: "section-contacts" },
            ].map(({ label, target }) => (
              <button
                key={target}
                type="button"
                onClick={() => scrollTo(target)}
                className="nav-button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "clamp(12px, 2vw, 14px)",
                  fontWeight: 500,
                  color: "#374151",
                  letterSpacing: "0.01em",
                  transition: "background 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                  (e.currentTarget as HTMLButtonElement).style.color = "#111";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "none";
                  (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}