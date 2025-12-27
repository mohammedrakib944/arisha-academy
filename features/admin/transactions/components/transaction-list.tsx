"use client";

import {
  updateTransactionStatus,
  getTransactions,
} from "@/features/transactions/actions/transactions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

type Transaction = {
  id: string;
  transactionId: string;
  phoneNumber: string;
  courseId: string | null;
  bookId: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date | string;
  user: {
    id: string;
    username: string;
    phoneNumber: string;
  } | null;
  course?: {
    id: string;
    title: string;
  } | null;
  book?: {
    id: string;
    title: string;
  } | null;
};

type TransactionsResponse = {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function TransactionList() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [data, setData] = useState<TransactionsResponse>({
    transactions: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchTransactions = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const result = await getTransactions({
        page,
        limit: 10,
        search: search || undefined,
      });
      setData(result);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  async function handleStatusUpdate(
    id: string,
    status: "APPROVED" | "REJECTED"
  ) {
    setLoading(id);
    try {
      await updateTransactionStatus(id, status);
      // Refresh the current page
      await fetchTransactions(currentPage, debouncedSearch);
      router.refresh();
    } catch (error) {
      console.error("Failed to update transaction:", error);
    } finally {
      setLoading(null);
    }
  }

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= data.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading transactions...
            </div>
          ) : data.transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery
                ? "No transactions found matching your search."
                : "No transactions yet."}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Transaction ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-t">
                        <td className="px-4 py-3 text-sm">
                          {transaction.transactionId}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {transaction.user?.username || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {transaction.phoneNumber}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {transaction.course
                            ? `Course: ${transaction.course.title}`
                            : transaction.book
                            ? `Book: ${transaction.book.title}`
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getStatusVariant(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {transaction.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handleStatusUpdate(transaction.id, "APPROVED")
                                }
                                disabled={loading === transaction.id}
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 min-w-[90px]"
                              >
                                {loading === transaction.id ? "..." : "Approve"}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleStatusUpdate(transaction.id, "REJECTED")
                                }
                                disabled={loading === transaction.id}
                                size="sm"
                                className="min-w-[70px]"
                                variant="destructive"
                              >
                                {loading === transaction.id ? "..." : "Reject"}
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * data.limit + 1} to{" "}
                    {Math.min(currentPage * data.limit, data.total)} of{" "}
                    {data.total} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show first page, last page, current page, and pages around current
                          return (
                            page === 1 ||
                            page === data.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          );
                        })
                        .map((page, index, array) => {
                          // Add ellipsis if there's a gap
                          const showEllipsisBefore =
                            index > 0 && array[index - 1] !== page - 1;
                          return (
                            <div key={page} className="flex items-center gap-1">
                              {showEllipsisBefore && (
                                <span className="px-2 text-muted-foreground">
                                  ...
                                </span>
                              )}
                              <Button
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                disabled={isLoading}
                                className="min-w-[40px]"
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === data.totalPages || isLoading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
