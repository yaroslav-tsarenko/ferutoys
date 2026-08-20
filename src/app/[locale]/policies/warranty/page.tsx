import { PolicyLayout, ContactBlock } from "@/components/layout/PolicyLayout/PolicyLayout";

export const metadata = { title: "Warranty and Complaints Policy — FeruToys" };

export default function WarrantyPolicyPage() {
  return (
    <PolicyLayout title="Warranty and Complaints Policy" lastUpdated="19 August 2026">
      <h2>1. Scope</h2>
      <p>
        This Policy explains your rights when a product is defective, unsafe, damaged, incomplete or does not
        conform to the Contract. It also explains the relationship between mandatory legal guarantees and any
        commercial warranty offered by a manufacturer.
      </p>

      <h2>2. Legal Guarantee</h2>
      <p>
        Products must conform to the Contract and meet applicable requirements of quality, functionality, safety,
        durability, compatibility and description.
      </p>
      <p>
        Consumers in the European Union generally benefit from a minimum two-year legal guarantee for new goods.
        A longer period or more favourable rules may apply under the mandatory law of the Consumer’s country.
        FERUTAX OÜ, as seller, remains responsible for statutory remedies and will not require a Consumer to
        pursue only the manufacturer.
      </p>

      <h2>3. Manufacturer Warranties</h2>
      <p>
        A manufacturer may provide a separate commercial warranty. Its duration, territorial scope, registration
        requirements and exclusions are stated in the manufacturer’s warranty materials.
      </p>
      <p>
        A commercial warranty is additional to, and does not replace, the legal guarantee. FeruToys may assist
        with a manufacturer process where appropriate, but statutory claims may be directed to us.
      </p>

      <h2>4. What May Constitute Non-Conformity</h2>
      <p>A product may be non-conforming if, for example, it:</p>
      <ul>
        <li>does not match the description, type, quantity or quality agreed;</li>
        <li>lacks advertised functionality, compatibility, accessories or instructions;</li>
        <li>is unsuitable for its ordinary purpose or an agreed particular purpose;</li>
        <li>does not possess durability, safety or performance reasonably expected;</li>
        <li>was incorrectly assembled where assembly formed part of the Contract or instructions were defective;</li>
        <li>arrives damaged, contaminated, incomplete or unusable; or</li>
        <li>fails to comply with mandatory product-safety requirements.</li>
      </ul>
      <p>Normal characteristics clearly disclosed before purchase are not defects.</p>

      <h2>5. Matters Not Normally Covered</h2>
      <p>Subject to mandatory law, a claim may be refused where the issue resulted solely from:</p>
      <ul>
        <li>normal wear and tear;</li>
        <li>failure to follow instructions, cleaning or maintenance requirements;</li>
        <li>use with an incompatible lubricant, charger, accessory, chemical or power source;</li>
        <li>impact, liquid exposure beyond the stated water-resistance rating, excessive heat or improper storage;</li>
        <li>unauthorised repair, modification or removal of identifiers;</li>
        <li>use beyond stated weight, pressure, duration or operating limits; or</li>
        <li>use for a purpose clearly outside the product’s intended function.</li>
      </ul>
      <p>The exclusion applies only to the extent the customer-caused matter is responsible for the issue.</p>

      <h2>6. Reporting a Problem</h2>
      <p>Stop using a product if continued use may be unsafe. Email info@ferutoys.com and provide:</p>
      <ul>
        <li>your name, contact details and order number;</li>
        <li>product name and, where available, batch, lot or serial number;</li>
        <li>date the issue was discovered;</li>
        <li>a clear description of the problem and circumstances in which it occurs; and</li>
        <li>photographs, video or other reasonable evidence where useful.</li>
      </ul>
      <p>
        Consumers should report non-conformity within a reasonable time after discovery. Where Estonian law
        applies, a Consumer should notify the seller within two months after discovering a lack of conformity. A
        delay will not remove rights where mandatory law provides otherwise.
      </p>

      <h2>7. Assessment</h2>
      <p>
        We may troubleshoot, request additional information, consult the manufacturer or ask for the product to
        be returned. Any assessment will be proportionate to the nature of the product, hygiene considerations
        and safety risk.
      </p>
      <p>
        Do not send a used intimate product, leaking battery, damaged electrical device, ingestible product or
        potentially contaminated item until we provide safe-return instructions.
      </p>

      <h2>8. Remedies</h2>
      <p>Where a product is non-conforming, the remedy will be provided in the order and manner required by applicable law. This may include:</p>
      <ul>
        <li>repair;</li>
        <li>replacement;</li>
        <li>a proportionate reduction in price; or</li>
        <li>termination of the Contract and refund.</li>
      </ul>
      <p>
        Repair or replacement will be free of charge, completed within a reasonable time and without significant
        inconvenience where required by law. A refund may be available if repair or replacement is impossible,
        disproportionate, unsuccessful, not completed in time, or the defect is sufficiently serious.
      </p>

      <h2>9. Costs</h2>
      <p>
        FeruToys covers necessary standard shipping, labour, material and related costs for a valid statutory
        claim. We will provide return instructions. Unauthorised premium shipping or costs unrelated to the
        defect may not be reimbursed.
      </p>

      <h2>10. Replacement Products</h2>
      <p>
        A replacement may be the same model or, where unavailable and lawful, an equivalent product agreed with
        you. Legal guarantee treatment of a repaired or replaced product is determined by applicable law. We will
        not represent a replacement as restarting a guarantee period unless that is legally correct.
      </p>

      <h2>11. Hygiene and Evidence</h2>
      <p>
        The fact that an intimate product has been opened or used does not by itself defeat a genuine defect or
        safety claim. We may apply appropriate hygiene procedures and request non-contact evidence before
        requiring a return.
      </p>
      <p>
        Information requested will be limited to what is reasonably necessary. Avoid sending intimate images or
        unnecessary health information.
      </p>

      <h2>12. Product Safety Incidents and Recalls</h2>
      <p>
        If a product causes or nearly causes serious injury, fire, electric shock, poisoning or another
        significant safety incident, stop use, preserve the product safely and contact info@ferutoys.com
        immediately. Seek emergency or medical assistance where needed.
      </p>
      <p>
        If we learn that a product is unsafe, we may contact affected customers, publish a safety notice, stop
        sales and arrange repair, replacement, refund or another legally required recall remedy. Follow recall
        instructions promptly.
      </p>

      <h2>13. Complaints Procedure</h2>
      <p>
        Submit complaints to info@ferutoys.com. We aim to acknowledge and investigate complaints promptly.
        Include the requested outcome and supporting information.
      </p>
      <p>
        If a complaint cannot be resolved, eligible Consumers may contact the Estonian Consumer Disputes
        Committee through the Consumer Protection and Technical Regulatory Authority. Information is available at
        https://ttja.ee/en.
      </p>

      <h2>14. No Restriction of Mandatory Rights</h2>
      <p>
        This Policy does not exclude product-liability rights, rights concerning unsafe products, legal
        guarantees or other remedies that cannot lawfully be limited.
      </p>

      <ContactBlock />
    </PolicyLayout>
  );
}
