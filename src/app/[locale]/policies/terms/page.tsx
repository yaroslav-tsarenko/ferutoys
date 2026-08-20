import { PolicyLayout, ContactBlock } from "@/components/layout/PolicyLayout/PolicyLayout";

export const metadata = { title: "Terms and Conditions — FeruToys" };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms and Conditions" lastUpdated="19 August 2026">
      <h2>1. About These Terms</h2>
      <p>
        These Terms and Conditions (the “Terms”) govern access to and use of https://www.ferutoys.com
        (the “Website”) and all purchases made through the Website. The Website is operated by FERUTAX OÜ,
        company number 17559757, with its registered office at Tornimäe tn 7, Kesklinna linnaosa, Tallinn,
        Harju maakond, 10145, Estonia (“FeruToys”, “we”, “us” or “our”).
      </p>
      <p>
        By using the Website or placing an order, you agree to these Terms. Please read them before completing
        a purchase. If you do not agree, you must not use the Website or place an order.
      </p>
      <p>
        Mandatory rights granted to consumers by applicable law are not excluded, restricted or replaced by
        these Terms.
      </p>
      <ContactBlock />

      <h2>2. Eligibility and Adults-Only Access</h2>
      <p>
        The Website and its products are intended exclusively for adults. You may use the Website and purchase
        products only if:
      </p>
      <ul>
        <li>you are at least 18 years old;</li>
        <li>
          you have reached the age of legal majority in the place where you live and in the place to which the
          products will be delivered;
        </li>
        <li>you have legal capacity to enter into a binding contract; and</li>
        <li>purchasing, possessing, importing and using the relevant products is lawful in your jurisdiction.</li>
      </ul>
      <p>
        By accessing age-restricted areas or placing an order, you confirm that these conditions are satisfied.
        You must not purchase products for a person who is under 18 or otherwise legally prohibited from
        receiving them. We may refuse or cancel an order where we reasonably believe that an eligibility
        requirement has not been met.
      </p>

      <h2>3. Definitions</h2>
      <p>For these Terms:</p>
      <ul>
        <li>
          “Consumer” means a natural person acting mainly for purposes outside that person’s trade, business,
          craft or profession.
        </li>
        <li>“Contract” means the sales contract formed between you and FERUTAX OÜ for an accepted order.</li>
        <li>
          “Hygiene Seal” means a seal, protective wrapping or comparable tamper-evident barrier applied to a
          product for health-protection or hygiene purposes.
        </li>
        <li>“Order Confirmation” means our email confirming that we have accepted an order.</li>
        <li>“Product” means any item offered for sale through the Website.</li>
        <li>
          “Restricted Territory” means a country or territory to which we do not offer delivery or in which a
          transaction is prohibited or restricted by applicable law, sanctions, carrier rules or payment
          requirements.
        </li>
      </ul>

      <h2>4. Product Information</h2>
      <p>
        FeruToys is a reseller. Product descriptions, specifications, ingredients, materials, dimensions,
        compatibility information, instructions and safety warnings may originate from manufacturers or
        suppliers. We take reasonable steps to present this information accurately, but minor variations may
        occur and screen settings may affect how colours appear.
      </p>
      <p>
        Product images are illustrative. Packaging may change without notice where the product itself remains
        materially consistent with its description. You must read the manufacturer’s label, instructions and
        warnings supplied with the product before use. Information on the Website is not medical advice and
        must not be treated as a substitute for advice from a qualified healthcare professional.
      </p>
      <p>
        All products are subject to availability. Displaying a product on the Website does not guarantee that it
        is in stock or that an order will be accepted.
      </p>

      <h2>5. Accounts and Guest Checkout</h2>
      <p>
        Where account functionality is available, you must provide accurate, current and complete information.
        You are responsible for maintaining the confidentiality of your login credentials and for activity
        carried out through your account, except to the extent caused by our failure to protect the account.
      </p>
      <p>
        You must notify us promptly at info@ferutoys.com if you suspect unauthorised access. We may suspend an
        account where reasonably necessary to protect you, FeruToys or other users, to investigate suspected
        misuse, or to comply with law.
      </p>

      <h2>6. Placing an Order</h2>
      <p>
        The steps presented at checkout allow you to review and correct your order before submission. By
        selecting the final payment or order button, you submit an offer to purchase the selected products and
        acknowledge an obligation to pay if the order is accepted.
      </p>
      <p>
        After submission, we may send an acknowledgement confirming receipt. An acknowledgement is not
        acceptance. A Contract is formed only when we send the Order Confirmation. If we cannot accept an order,
        we will notify you and will not charge you, or will refund any amount already taken.
      </p>
      <p>
        We may refuse or cancel an order before dispatch for legitimate reasons, including unavailability, an
        obvious pricing or description error, failed payment authorisation, suspected fraud, age or eligibility
        concerns, delivery restrictions, product-safety concerns, sanctions requirements or a legal
        prohibition. We will provide a refund where payment has already been collected, unless law permits funds
        to be withheld.
      </p>

      <h2>7. Prices, Currencies and Taxes</h2>
      <p>
        The Website supports purchases in euros (EUR), pounds sterling (GBP) and United States dollars (USD).
        The currency selected at checkout is the transaction currency shown in the Order Confirmation.
      </p>
      <p>
        Prices and applicable delivery charges are displayed before the order is submitted. Unless stated
        otherwise, prices for deliveries within the European Union include VAT where VAT is chargeable. For
        deliveries outside the European Union, import VAT, customs duties, handling fees or other local charges
        may be payable by the recipient and are not included unless checkout expressly states otherwise.
      </p>
      <p>
        Your card issuer or bank may apply its own exchange rate or foreign-transaction fee. Those charges are
        imposed by the issuer and are not controlled by FeruToys.
      </p>
      <p>
        If a price is obviously incorrect, we are not required to supply the product at that price. We will
        contact you before accepting the order or cancel it and refund any payment already made.
      </p>

      <h2>8. Payments</h2>
      <p>
        Payment may be made using Visa or Mastercard and any other method displayed at checkout. Payments are
        processed through authorised third-party payment service providers. FeruToys does not require you to
        send full payment-card details by email.
      </p>
      <p>
        You confirm that you are authorised to use the selected payment method and that the information supplied
        is accurate. A payment provider or card issuer may conduct authentication, address verification,
        sanctions screening and fraud-prevention checks. We may delay acceptance or dispatch while a payment or
        fraud review is pending.
      </p>
      <p>
        If a payment is reversed, declined or charged back without a valid basis after products have been
        supplied, we may seek payment and reasonable recovery costs to the extent permitted by law. This does
        not affect your right to dispute an unauthorised or incorrect transaction.
      </p>

      <h2>9. Promotions and Discount Codes</h2>
      <p>
        Promotions and discount codes are subject to the conditions stated with the offer. Unless stated
        otherwise, they cannot be exchanged for cash, combined with other offers, applied retrospectively or
        used after expiry. We may reject misuse, duplication, manipulation or unauthorised resale of a code.
      </p>
      <p>
        If an order containing a free or discounted bundle item is returned, the refund may be adjusted to
        reflect any retained item, provided the calculation and applicable condition were clearly disclosed and
        mandatory consumer rights are respected.
      </p>

      <h2>10. Delivery</h2>
      <p>
        Orders are dispatched from Estonia. Delivery is carried out by DPD, FedEx or another suitable carrier
        selected for the destination, product and service level. Available services, charges and estimated
        delivery times are shown at checkout where practicable.
      </p>
      <p>
        Delivery dates are estimates unless expressly agreed as binding. If no other time has been agreed with a
        Consumer in the European Union, delivery will take place without undue delay and no later than 30 days
        after formation of the Contract, subject to applicable legal exceptions.
      </p>
      <p>
        Detailed delivery terms, territorial restrictions, customs responsibilities and procedures for delayed,
        damaged or missing parcels are set out in the Shipping and Delivery Policy, which forms part of these
        Terms.
      </p>

      <h2>11. Delivery Restrictions and Local Law</h2>
      <p>
        We do not deliver to Sudan, the Democratic Republic of the Congo, Iran, Mali, Myanmar (Burma), North
        Korea, South Sudan, Syria, Yemen, Afghanistan, Belarus, the Central African Republic, Cuba, Haiti, Iraq,
        Russia, Somalia, Venezuela or Zimbabwe.
      </p>
      <p>
        Additional restrictions may apply because of sanctions, local import laws, carrier limitations,
        dangerous-goods rules, product classification, payment controls or safety requirements. The availability
        of a country at checkout does not override applicable law. We may refuse delivery of a particular
        product to an otherwise supported country where a product-specific restriction applies.
      </p>
      <p>
        You are responsible for checking local restrictions that apply to possession or use. This responsibility
        does not exclude any obligation that applicable law places on FeruToys as seller, exporter or
        distributor.
      </p>

      <h2>12. Neutral Packaging</h2>
      <p>
        Orders are packed in plain, neutral outer packaging without explicit product descriptions or adult
        imagery. Shipping labels will contain information reasonably required by carriers, customs authorities
        and law. International customs documentation may require an accurate description of the goods; we cannot
        misdescribe a shipment.
      </p>

      <h2>13. Transfer of Risk and Ownership</h2>
      <p>
        For Consumers, risk of loss or damage passes when you or a third party nominated by you, other than the
        carrier, takes physical possession of the products. If you independently appoint a carrier not offered
        by us, risk may pass when the products are handed to that carrier, to the extent permitted by law.
      </p>
      <p>
        Ownership passes after we have received full payment and the products have been delivered, unless
        mandatory law provides otherwise.
      </p>

      <h2>14. Cancellation Before Dispatch</h2>
      <p>
        Contact info@ferutoys.com as soon as possible if you wish to cancel or change an order. We will try to
        assist, but cannot guarantee cancellation or amendment after fulfilment has started. If the order has
        already been dispatched, the Returns, Refunds and Withdrawal Policy will apply.
      </p>

      <h2>15. Withdrawal, Returns and Refunds</h2>
      <p>
        Eligible products may be returned under our 30-day voluntary return commitment. Consumers may also have
        a statutory right to withdraw, including the 14-day right generally available for distance contracts in
        the European Union.
      </p>
      <p>
        The right to withdraw may be lost for a sealed product that is not suitable for return for
        health-protection or hygiene reasons if its Hygiene Seal is broken after delivery. Different rules apply
        to defective, unsafe, damaged or incorrectly supplied products.
      </p>
      <p>
        The full conditions, free-return procedure, exclusions, refund timing and model withdrawal form are
        contained in the Returns, Refunds and Withdrawal Policy.
      </p>

      <h2>16. Defective or Non-Conforming Products</h2>
      <p>
        Products must conform to the Contract and applicable law. If a product is defective, unsafe, damaged on
        arrival, incomplete or materially different from its description, contact info@ferutoys.com promptly with
        the order number and a description of the issue.
      </p>
      <p>
        Depending on the circumstances and applicable law, remedies may include repair, replacement, a
        proportionate reduction in price or a refund. Mandatory legal guarantees apply independently of any
        manufacturer’s commercial warranty. See the Warranty and Complaints Policy.
      </p>

      <h2>17. Product Safety and Responsible Use</h2>
      <p>
        Use products only for their intended adult purpose and strictly in accordance with the manufacturer’s
        instructions, warnings, age restrictions, maintenance requirements, weight limits and compatibility
        information. Inspect products before each use and stop using any product that is damaged, degraded,
        recalled or causes pain, numbness, irritation or other unexpected effects.
      </p>
      <p>
        Some products require additional precautions, including bondage equipment, electrostimulation devices,
        vacuum pumps, products intended for insertion, intimate cosmetics, ingestible products, candles and
        load-bearing furniture. The Product Safety and Responsible Use Policy forms part of these Terms.
      </p>

      <h2>18. Prohibited Conduct</h2>
      <p>You must not:</p>
      <ul>
        <li>use the Website or products unlawfully or to harm, threaten, coerce, exploit or abuse another person;</li>
        <li>purchase products for a minor or a person who cannot lawfully possess them;</li>
        <li>
          interfere with Website security, introduce malicious code, scrape the Website at unreasonable scale or
          attempt unauthorised access;
        </li>
        <li>submit false payment, identity, age, delivery or eligibility information;</li>
        <li>infringe intellectual-property, privacy or other rights;</li>
        <li>resell, export or transfer products in breach of sanctions, customs, product-safety or other applicable rules; or</li>
        <li>use a product without the freely given, informed and ongoing consent of every participating adult.</li>
      </ul>
      <p>
        We may restrict access, cancel an unfulfilled order or report suspected unlawful conduct where
        reasonably necessary and lawful.
      </p>

      <h2>19. Reviews and User Content</h2>
      <p>
        If the Website allows reviews, questions, images or other content, you retain ownership of your content
        but grant FeruToys a non-exclusive, worldwide, royalty-free licence to host, reproduce and display it
        for operating and promoting the Website and products.
      </p>
      <p>
        Content must be truthful, relevant, lawful and appropriate for an adults-only commercial Website. It
        must not contain personal data about another person, explicit images of identifiable individuals,
        medical misinformation, undisclosed paid endorsements, infringement, hate, threats or illegal material.
        We may moderate or remove content for legitimate reasons. We will not suppress a genuine negative review
        merely because it is unfavourable.
      </p>

      <h2>20. Intellectual Property</h2>
      <p>
        The Website, its design, text, graphics, logos, photographs, software and compilation are owned by or
        licensed to FeruToys and are protected by intellectual-property laws. You may access and make limited
        copies for personal, non-commercial shopping purposes. No other use is permitted without prior written
        authorisation.
      </p>
      <p>
        Third-party product names and trademarks belong to their respective owners. Their appearance does not
        imply endorsement beyond the ordinary resale relationship.
      </p>

      <h2>21. Website Availability and Third-Party Links</h2>
      <p>
        We aim to keep the Website accurate and available but do not guarantee uninterrupted or error-free
        access. We may maintain, update or suspend parts of the Website where reasonably necessary.
      </p>
      <p>
        Third-party links are provided for convenience. FeruToys does not control third-party content or
        services and is not responsible for them, except where applicable law provides otherwise.
      </p>

      <h2>22. Privacy and Cookies</h2>
      <p>
        Personal data is processed in accordance with the Privacy Policy. Cookies and similar technologies are
        used as described in the Cookie Policy and the Cookie Settings interface. These documents form part of
        the Website’s legal information but do not reduce rights available under data-protection law.
      </p>

      <h2>23. Liability</h2>
      <p>
        Nothing in these Terms excludes or limits liability that cannot lawfully be excluded, including liability
        for death or personal injury caused by negligence, fraud, deliberate misconduct, defective products
        where strict liability applies, or breach of mandatory consumer rights.
      </p>
      <p>
        Subject to the preceding paragraph, FeruToys is not responsible for losses that were not reasonably
        foreseeable when the Contract was formed, for losses caused by unlawful or clearly improper use, or for
        business losses suffered by a Consumer. Any limitation will apply only to the maximum extent permitted by
        applicable law.
      </p>

      <h2>24. Events Beyond Reasonable Control</h2>
      <p>
        We are not responsible for delay or failure caused by events beyond our reasonable control, such as
        natural disasters, war, civil disturbance, epidemic, governmental action, sanctions changes, border
        closure, carrier disruption, cyberattack, infrastructure failure or industrial action not limited to our
        own workforce.
      </p>
      <p>
        We will take reasonable steps to minimise the effect. Mandatory cancellation and refund rights remain
        unaffected.
      </p>

      <h2>25. Governing Law and Consumer Rights</h2>
      <p>
        These Terms and Contracts are governed by Estonian law. If you are a Consumer habitually resident in
        another country, this choice does not deprive you of mandatory protections that apply under the law of
        that country.
      </p>
      <p>
        The courts of Estonia have jurisdiction, without restricting a Consumer’s right to bring or defend
        proceedings in another court where mandatory jurisdiction rules allow or require it.
      </p>

      <h2>26. Complaints and Alternative Dispute Resolution</h2>
      <p>
        Send complaints to info@ferutoys.com. Include your order number, contact details, a clear description
        and any relevant evidence. We will review the complaint and respond within a reasonable time.
      </p>
      <p>
        Consumers may be entitled to submit an unresolved dispute to the Estonian Consumer Disputes Committee
        operating through the Consumer Protection and Technical Regulatory Authority (TTJA). Information is
        available at https://ttja.ee/en. Participation and jurisdiction depend on applicable rules.
      </p>
      <p>
        The former European Commission Online Dispute Resolution platform was discontinued in 2025 and is not
        used for complaints.
      </p>

      <h2>27. Changes to These Terms</h2>
      <p>
        We may update these Terms to reflect legal, operational or service changes. The version displayed when
        an order is accepted governs that Contract unless a mandatory change must apply. Material changes will
        not retrospectively reduce accrued rights.
      </p>

      <h2>28. General Provisions</h2>
      <p>
        If a provision is found invalid or unenforceable, the remaining provisions continue to apply. A delay in
        enforcing a right is not a waiver. You may not transfer a Contract without our consent, except where law
        permits. We may transfer our rights or obligations only where this does not reduce your rights.
      </p>
      <p>
        These Terms, the Order Confirmation and the policies incorporated by reference form the agreement
        relating to the order. They do not exclude statements or rights that cannot lawfully be excluded.
      </p>

      <h2>29. Contact</h2>
      <p>
        If you have any questions about these Terms, your order, delivery, returns, warranty or any other
        matter, please contact us:
      </p>
      <ContactBlock />
    </PolicyLayout>
  );
}
