/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '26')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2026')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

/**
 * Encrypts an ID using AES-GCM encryption
 * Works in both browser and server environments using Web Crypto API
 *
 * @param id - The ID string to encrypt
 * @returns Promise resolving to encrypted string in format: iv.encryptedData (both base64url encoded)
 * @throws Error if ENCRYPTION_KEY environment variable is not set
 *
 * @example
 * const encrypted = await encryptId("user123");
 * // Returns: "dGVzdGl2MTIzNDU2.encrypted_data_here"
 */
export async function encryptId(id: string): Promise<string> {
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error("NEXT_PUBLIC_ENCRYPTION_KEY is not defined in environment variables");
  }

  // Convert the encryption key to a crypto key
  const encoder = new TextEncoder();
  const keyData = encoder.encode(encryptionKey.padEnd(32, "0").slice(0, 32)); // Ensure 32 bytes for AES-256

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // Generate a random initialization vector
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the ID
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoder.encode(id)
  );

  // Convert to base64url for safe URL usage
  const encryptedArray = new Uint8Array(encryptedData);
  const ivBase64 = bufferToBase64Url(iv);
  const encryptedBase64 = bufferToBase64Url(encryptedArray);

  // Return format: iv.encryptedData
  return `${ivBase64}.${encryptedBase64}`;
}

/**
 * Decrypts an ID that was encrypted using encryptId
 *
 * @param encryptedId - The encrypted ID string in format: iv.encryptedData
 * @returns Promise resolving to the original decrypted ID string
 * @throws Error if ENCRYPTION_KEY is not set or if decryption fails
 *
 * @example
 * const decrypted = await decryptId("dGVzdGl2MTIzNDU2.encrypted_data_here");
 * // Returns: "user123"
 */
export async function decryptId(encryptedId: string): Promise<string> {
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error("NEXT_PUBLIC_ENCRYPTION_KEY is not defined in environment variables");
  }

  try {
    // Split the encrypted string to get IV and encrypted data
    const [ivBase64, encryptedBase64] = encryptedId.split(".");

    if (!ivBase64 || !encryptedBase64) {
      throw new Error("Invalid encrypted ID format");
    }

    // Convert from base64url back to Uint8Array
    const iv = base64UrlToBuffer(ivBase64);
    const encryptedData = base64UrlToBuffer(encryptedBase64);

    // Recreate the crypto key
    const encoder = new TextEncoder();
    const keyData = encoder.encode(encryptionKey.padEnd(32, "0").slice(0, 32));

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    // Decrypt the data - use ArrayBuffer for type compatibility
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
      cryptoKey,
      encryptedData.buffer as ArrayBuffer
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Converts a Uint8Array to base64url encoding (URL-safe base64)
 * @param buffer - The buffer to encode
 * @returns base64url encoded string
 */
function bufferToBase64Url(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Converts a base64url encoded string back to Uint8Array
 * @param base64url - The base64url encoded string
 * @returns Uint8Array buffer
 */
function base64UrlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binaryString = atob(paddedBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};
