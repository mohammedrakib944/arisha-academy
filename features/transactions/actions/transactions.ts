import axios from "axios";
import type { TransactionFormData } from "@/features/transactions/validations/transaction";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function submitTransaction(data: TransactionFormData | FormData) {
  try {
    let body: TransactionFormData;

    if (data instanceof FormData) {
      // Handle FormData from book purchase form
      const transactionId = data.get("transactionId") as string;
      const phoneNumber = data.get("phoneNumber") as string;
      const bookId = data.get("bookId") as string;
      const courseId = data.get("courseId") as string | null;

      body = {
        transactionId,
        phoneNumber,
        bookId: bookId || undefined,
        courseId: courseId || undefined,
      };
    } else {
      body = data;
    }

    const response = await api.post("/transactions", body);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      // Handle structured error response
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Return first validation error message
        const firstError = errorData.errors[0];
        return {
          success: false,
          error:
            firstError?.message ||
            errorData.message ||
            "Failed to submit transaction",
          errors: errorData.errors,
        };
      }
      return {
        success: false,
        error:
          errorData?.error ||
          errorData?.message ||
          error.message ||
          "Failed to submit transaction",
        code: errorData?.code,
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit transaction",
    };
  }
}

// Client-side function for client components
export async function getTransactions() {
  try {
    const response = await api.get("/transactions");
    return response.data;
  } catch (error: unknown) {
    return [];
  }
}

export async function updateTransactionStatus(
  id: string,
  status: "APPROVED" | "REJECTED"
) {
  try {
    const response = await api.patch(`/transactions/${id}`, { status });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to update transaction",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update transaction",
    };
  }
}
