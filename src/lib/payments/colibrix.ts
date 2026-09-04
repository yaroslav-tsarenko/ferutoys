import crypto from "crypto";

export interface ColibrixAddress {
  city?: string;
  country?: string;
  line1?: string;
  postal_code?: string;
  state?: string;
}

export interface ColibrixCustomer {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: ColibrixAddress;
}

export interface ColibrixOrder {
  amount: number; // in minor units (e.g. 1000 for 10.00 EUR)
  currency: string;
  description?: string;
  reference_id: string;
}

export interface ColibrixSettings {
  expires_in?: number;
  language?: string;
  return_url?: string;
  redirect_success_url?: string;
  redirect_fail_url?: string;
  webhook_url?: string;
}

export interface ColibrixCard {
  number: string;
  cvv?: string;
  exp_month: string;
  exp_year: string;
  holder: string;
}

export interface ColibrixTokenDetails {
  type: "apple" | "google" | "network";
  tavv: string;
  eci?: string;
  scheme?: string;
}

export interface ColibrixRecurring {
  enabled: boolean;
  frequency?: number;
  indicator?: "c101" | "c102" | "c103" | "c104";
  billing_schedule?: {
    anchor_date?: string;
    frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly" | "unscheduled";
  };
}

export interface ColibrixPaymentSessionPayload {
  order: ColibrixOrder;
  payment_method: {
    type: "card" | "open_banking" | "apple_pay" | "google_pay";
    bank_features?: string[];
    bank_name?: string;
  };
  available_payment_methods?: readonly ("card" | "apple_pay" | "google_pay" | "open_banking")[] | ("card" | "apple_pay" | "google_pay" | "open_banking")[];
  customer?: ColibrixCustomer;
  recurring?: ColibrixRecurring;
  settings?: ColibrixSettings;
  metadata?: Record<string, string>;
}

export interface ColibrixTransactionPayload {
  auto_capture?: boolean;
  order: ColibrixOrder;
  card?: ColibrixCard;
  token_details?: ColibrixTokenDetails;
  customer: ColibrixCustomer;
  recurring?: ColibrixRecurring;
  settings?: ColibrixSettings;
  metadata?: Record<string, string>;
}

export interface ColibrixWithdrawalPayload {
  bank_card: {
    holder: string;
    number: string;
  };
  customer: ColibrixCustomer;
  order: ColibrixOrder;
  settings?: {
    webhook_url?: string;
  };
}

export interface ColibrixRecurringChargePayload {
  indicator?: "m101" | "m102" | "m103" | "m104";
  order: ColibrixOrder;
  settings?: {
    webhook_url?: string;
  };
}

export interface ColibrixResponse {
  transaction_id: string;
  reference_id: string;
  status: "new" | "success" | "pending" | "failed";
  redirect_url?: string;
  [key: string]: unknown;
}

export interface ColibrixBalanceResponse {
  balance_in: string;
  balance_out: string;
  balance_net: string;
  currency?: string;
}

export class ColibrixAPI {
  private apiKey: string;
  private signatureKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.COLIBRIX_API_KEY || "";
    this.signatureKey = process.env.COLIBRIX_SIGNATURE_KEY || "";
    
    // COLIBRIX_GATE_STATUS: "true" for live (PROD), "false" (or unset) for sandbox (DEV)
    const isLive = process.env.COLIBRIX_GATE_STATUS === "true";
    this.baseUrl =
      process.env.COLIBRIX_BASE_URL ||
      (isLive
        ? "https://mapi.clx.acq.mellifera.tech/api/v2"
        : "https://mapi.new.acq.mellifera.dev/api/v2");
  }

  /**
   * Generates SHA-256 signature for POST body: SHA256(json_body + SECRET)
   */
  private signBody(rawBody: string): string {
    return crypto
      .createHash("sha256")
      .update(rawBody + this.signatureKey)
      .digest("hex");
  }

  /**
   * Generates SHA-256 signature for GET request: SHA256(path + SECRET)
   */
  private signPath(path: string): string {
    return crypto
      .createHash("sha256")
      .update(path + this.signatureKey)
      .digest("hex");
  }

  private validateCredentials() {
    if (!this.apiKey || this.apiKey === "your_colibrix_api_key_here" || this.apiKey.trim() === "") {
      throw new Error("Colibrix API Key (COLIBRIX_API_KEY) is not configured in environment variables.");
    }
    if (!this.signatureKey || this.signatureKey === "your_colibrix_signature_key_here" || this.signatureKey.trim() === "") {
      throw new Error("Colibrix Signature Key (COLIBRIX_SIGNATURE_KEY) is not configured in environment variables.");
    }
  }

  /**
   * Create a Hosted Payment Page session (POST /session/payment)
   */
  async createPaymentSession(data: ColibrixPaymentSessionPayload): Promise<ColibrixResponse> {
    this.validateCredentials();

    const url = `${this.baseUrl}/session/payment`;
    const rawBody = JSON.stringify(data);
    const signature = this.signBody(rawBody);

    console.log(`[Colibrix API] Creating payment session at ${url}:`, rawBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-KEY": this.apiKey,
        "X-Signature": signature,
      },
      body: rawBody,
    });

    const responseText = await response.text();
    console.log(`[Colibrix API] Session Response Status: ${response.status}`, responseText);

    if (!response.ok) {
      throw new Error(`Colibrix session creation failed with status ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  /**
   * Direct card payment / CIT (POST /transaction)
   */
  async createTransaction(data: ColibrixTransactionPayload): Promise<ColibrixResponse> {
    this.validateCredentials();

    const url = `${this.baseUrl}/transaction`;
    const rawBody = JSON.stringify(data);
    const signature = this.signBody(rawBody);

    console.log(`[Colibrix API] Creating direct transaction at ${url}:`, rawBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-KEY": this.apiKey,
        "X-Signature": signature,
      },
      body: rawBody,
    });

    const responseText = await response.text();
    console.log(`[Colibrix API] Transaction Response Status: ${response.status}`, responseText);

    if (!response.ok) {
      throw new Error(`Colibrix transaction failed with status ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  /**
   * Payout / Withdrawal (POST /transaction/withdrawal)
   */
  async createWithdrawal(data: ColibrixWithdrawalPayload): Promise<ColibrixResponse> {
    this.validateCredentials();

    const url = `${this.baseUrl}/transaction/withdrawal`;
    const rawBody = JSON.stringify(data);
    const signature = this.signBody(rawBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-KEY": this.apiKey,
        "X-Signature": signature,
      },
      body: rawBody,
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Colibrix withdrawal failed with status ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  /**
   * MIT recurring charge (POST /recurring/{recurring_token}/charge)
   */
  async chargeRecurring(recurringToken: string, data: ColibrixRecurringChargePayload): Promise<ColibrixResponse> {
    this.validateCredentials();

    const url = `${this.baseUrl}/recurring/${recurringToken}/charge`;
    const rawBody = JSON.stringify(data);
    const signature = this.signBody(rawBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-KEY": this.apiKey,
        "X-Signature": signature,
      },
      body: rawBody,
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Colibrix recurring charge failed with status ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  /**
   * Check balance (GET /balance)
   */
  async getBalance(): Promise<ColibrixBalanceResponse> {
    this.validateCredentials();

    const path = "/api/v2/balance";
    const url = `${this.baseUrl}/balance`;
    const signature = this.signPath(path);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-API-KEY": this.apiKey,
        "X-Signature": signature,
      },
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Colibrix getBalance failed with status ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  /**
   * Query transaction status directly (GET /card/status_query/{uid})
   */
  async getTransactionStatus(transactionId: string): Promise<any> {
    this.validateCredentials();

    const path = `/card/status_query/${transactionId}`;
    const baseHost = this.baseUrl.replace(/\/api\/v2\/?$/, "");
    const url = `${baseHost}${path}`;
    const signature = this.signPath(path);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-API-KEY": this.apiKey,
        "X-Signature": signature,
      },
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Colibrix getTransactionStatus failed with status ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  /**
   * Request gateway to replay webhook (POST /webhook/replay)
   */
  async replayWebhook(transactionId: string): Promise<any> {
    this.validateCredentials();

    const url = `${this.baseUrl}/webhook/replay`;
    const rawBody = JSON.stringify({ transaction_id: transactionId });
    const signature = this.signBody(rawBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-KEY": this.apiKey,
        "X-Signature": signature,
      },
      body: rawBody,
    });

    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch {
      return { ok: response.ok };
    }
  }
}
