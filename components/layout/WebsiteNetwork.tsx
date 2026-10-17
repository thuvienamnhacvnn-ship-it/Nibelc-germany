import { TextMask } from "@/components/ui/TextMask";
import { ArrowUpRight } from "lucide-react";
import { CURRENT_SITE_ID, WEBSITE_NETWORK, websiteNetworkLabels } from "@/lib/website-network";
import styles from "./website-network.module.css";

export function WebsiteNetworkList({ lang, cards = false, gon = false }: { lang: string; cards?: boolean; gon?: boolean }) {
  const labels = websiteNetworkLabels(lang);
  return (
    <ul className={`${styles.list} ${cards ? styles.cards : ""}`}>
      {WEBSITE_NETWORK.map((site) => {
        const current = site.id === CURRENT_SITE_ID;
        const content = <>
          <span className={`${styles.logo} ${site.plate === "light" ? styles.plateLight : styles.plateDark}`} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.logo} alt="" width={88} height={52} loading="lazy" />
          </span>
          <span className={styles.copy}>
            <span className={styles.name}>{site.name}</span>
            {!gon && <span className={styles.host}>{site.host}</span>}
            {current && <span className={styles.status}>{labels.current}</span>}
          </span>
          {current ? <span className={styles.dot} aria-hidden="true" /> : <>
            <ArrowUpRight size={16} className={styles.arrow} aria-hidden="true" />
            <span className="sr-only">{labels.newTab}</span>
          </>}
        </>;
        return <li key={site.id} data-site-id={site.id}>
          {current ? <div className={`${styles.item} ${styles.current}`} aria-current="true">{content}</div> :
            <a className={styles.item} href={site.url} target="_blank" rel="noopener noreferrer" title={`${site.name} — ${labels.newTab}`}>{content}</a>}
        </li>;
      })}
    </ul>
  );
}

export function WebsiteNetworkFooter({ lang }: { lang: string }) {
  return <nav className={`nb-wrap ${styles.footer}`} aria-label={websiteNetworkLabels(lang).title} data-website-network="footer">
    <h2 className={styles.heading}><TextMask>{websiteNetworkLabels(lang).title}</TextMask></h2>
    <WebsiteNetworkList lang={lang} cards />
  </nav>;
}

export function WebsiteNetworkMobile({ lang }: { lang: string }) {
  return <nav className={styles.mobile} aria-label={websiteNetworkLabels(lang).title} data-website-network="mobile">
    <h2 className={styles.heading}><TextMask>{websiteNetworkLabels(lang).title}</TextMask></h2>
    <WebsiteNetworkList lang={lang} />
  </nav>;
}
