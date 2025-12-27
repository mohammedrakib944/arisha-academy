"use client";

import { updateTransactionStatus } from "@/features/transactions/actions/transactions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleStatusUpdate(
    id: string,
    status: "APPROVED" | "REJECTED"
  ) {
    setLoading(id);
    await updateTransactionStatus(id, status);
    router.refresh();
    setLoading(null);
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

  if (transactions.length === 0) {
    return <p className="text-muted-foreground">No transactions yet.</p>;
  }

  return (
    <Card>
      <CardContent className="p-0">
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
              {transactions.map((transaction) => (
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
      </CardContent>
    </Card>
  );
}
