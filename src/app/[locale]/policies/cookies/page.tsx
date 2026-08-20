import { PolicyLayout, ContactBlock } from "@/components/layout/PolicyLayout/PolicyLayout";

export const metadata = { title: "Cookie Policy — FeruToys" };

export default function CookiePolicyPage() {
  return (
    <PolicyLayout title="Cookie Policy" lastUpdated="19 August 2026">
      <h2>1. Scope</h2>
      <p>
        This Cookie Policy explains how FERUTAX OÜ uses cookies and similar technologies on
        https://www.ferutoys.com. It should be read with the Privacy Policy and the Cookie Settings interface.
      </p>

      <h2>2. What Cookies Are</h2>
      <p>
        Cookies are small text files stored on or read from a device when a website is visited. Similar
        technologies include local storage, pixels, tags, scripts and software development kits. In this Policy,
        “cookies” includes these technologies where appropriate.
      </p>
      <p>
        Cookies may be session cookies, which expire when the browser is closed, or persistent cookies, which
        remain for a stated period. They may be set by FeruToys or by a third-party provider.
      </p>

      <h2>3. Strictly Necessary Cookies</h2>
      <p>
        Strictly necessary cookies support functions requested by the user or essential to providing the
        Website, including:
      </p>
      <ul>
        <li>page navigation and secure connections;</li>
        <li>shopping basket and checkout;</li>
        <li>payment-session continuity;</li>
        <li>account authentication;</li>
        <li>security, load balancing and fraud prevention;</li>
        <li>storing privacy and cookie choices; and</li>
        <li>remembering an age-gate confirmation for a limited period.</li>
      </ul>
      <p>
        These cookies are used without consent where law permits because the Website cannot provide the
        requested function without them. They should not be used for unrelated advertising.
      </p>

      <h2>4. Preference Cookies</h2>
      <p>
        Preference cookies remember optional choices such as currency, language, region or display settings.
        Where consent is required, they are not set until consent is given.
      </p>
      <p>
        If preference cookies are refused, the Website remains usable but choices may need to be entered again.
      </p>

      <h2>5. Analytics Cookies</h2>
      <p>
        Analytics cookies help measure visits, traffic sources, navigation, errors and performance. We use
        analytics to understand aggregate Website use and improve functionality.
      </p>
      <p>
        Where required, analytics technologies are disabled until consent is given. We seek to minimise the data
        collected and do not use analytics to infer sensitive characteristics from purchases.
      </p>

      <h2>6. Advertising Cookies</h2>
      <p>
        If advertising or remarketing technologies are enabled, they may measure campaigns, limit repetition and
        help display relevant advertising. They may recognise a browser across websites.
      </p>
      <p>
        Advertising cookies are non-essential and are not set until valid consent is obtained where required. We
        do not intentionally create advertising audiences based on intimate purchase history or inferred sex
        life, sexual orientation or health.
      </p>

      <h2>7. Current Cookie Details</h2>
      <p>
        The current list of cookies and similar technologies, including provider, purpose, category and
        duration, is displayed in Cookie Settings. That live list forms part of this Policy and should be updated
        whenever a technology is added, removed or changed.
      </p>
      <p>
        No non-essential provider should be activated on the Website unless it is accurately included in Cookie
        Settings and the necessary consent mechanism is operating.
      </p>

      <h2>8. Consent and Choices</h2>
      <p>
        When required, the cookie banner allows you to accept all non-essential cookies, reject them or make
        category-level choices. Refusing consent must be as accessible as accepting it and must not prevent
        access to ordinary shopping functions.
      </p>
      <p>
        Consent is specific, informed and given through an affirmative action. Silence, continued browsing and
        pre-selected optional categories are not treated as consent where consent is legally required.
      </p>

      <h2>9. Changing or Withdrawing Consent</h2>
      <p>
        You can reopen Cookie Settings through the link in the Website footer and change or withdraw consent at
        any time. Withdrawal does not affect processing that occurred lawfully before withdrawal.
      </p>
      <p>
        You may also block or delete cookies through browser settings. Blocking strictly necessary cookies may
        prevent checkout, authentication or other requested functions.
      </p>

      <h2>10. Third-Party Cookies</h2>
      <p>
        Third-party providers may process data under their own privacy notices. Where they act as our processor,
        they are subject to contractual instructions. Where they act as an independent controller, their own
        purposes and legal responsibilities also apply.
      </p>
      <p>Cookie Settings identifies third-party providers when they are implemented.</p>

      <h2>11. Data Transfers and Retention</h2>
      <p>
        Cookie data may be processed outside the European Economic Area subject to the safeguards described in
        the Privacy Policy. Each persistent cookie expires after the period shown in Cookie Settings unless
        deleted sooner. We avoid retention longer than reasonably necessary for the stated purpose.
      </p>

      <h2>12. Browser Signals</h2>
      <p>
        Some browsers transmit “Do Not Track” or similar signals. Because there is no single universally
        implemented standard, the Website may not respond to every signal. Legally required consent controls and
        Global Privacy Control signals will be respected where applicable to the processing concerned.
      </p>

      <h2>13. Updates</h2>
      <p>
        We may update this Policy and the live cookie list when technologies, providers or legal requirements
        change. The revision date appears at the top.
      </p>

      <h2>14. Contact</h2>
      <p>Questions about cookies or privacy should be sent to info@ferutoys.com.</p>
      <ContactBlock />
    </PolicyLayout>
  );
}
