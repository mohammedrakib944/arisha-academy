"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethod = "bkash" | "nagad" | "rocket";

const PaymentProcess = () => {
  const [openMethod, setOpenMethod] = useState<PaymentMethod | null>("bkash");

  const toggleMethod = (method: PaymentMethod) => {
    setOpenMethod(openMethod === method ? null : method);
  };

  const paymentMethods = [
    {
      id: "bkash" as PaymentMethod,
      name: "bKash",
      number: "০১৭১২৩৪৫৬৭৮",
      instructions: [
        "bKash অ্যাপ খুলুন",
        "*247# ডায়াল করুন",
        "Send Money নির্বাচন করুন",
        "নিচের নম্বরে টাকা পাঠান: ০১৭১২৩৪৫৬৭৮",
        "Reference হিসেবে আপনার নাম লিখুন",
        "পিন নম্বর দিয়ে কনফার্ম করুন",
        "লেনদেন আইডি সংরক্ষণ করুন",
      ],
    },
    {
      id: "nagad" as PaymentMethod,
      name: "Nagad",
      number: "০১৭১২৩৪৫৬৭৮",
      instructions: [
        "Nagad অ্যাপ খুলুন",
        "*167# ডায়াল করুন",
        "Send Money নির্বাচন করুন",
        "নিচের নম্বরে টাকা পাঠান: ০১৭১২৩৪৫৬৭৮",
        "Reference হিসেবে আপনার নাম লিখুন",
        "পিন নম্বর দিয়ে কনফার্ম করুন",
        "লেনদেন আইডি সংরক্ষণ করুন",
      ],
    },
    {
      id: "rocket" as PaymentMethod,
      name: "Rocket",
      number: "০১৭১২৩৪৫৬৭৮",
      instructions: [
        "Rocket অ্যাপ খুলুন",
        "*322# ডায়াল করুন",
        "Send Money নির্বাচন করুন",
        "নিচের নম্বরে টাকা পাঠান: ০১৭১২৩৪৫৬৭৮",
        "Reference হিসেবে আপনার নাম লিখুন",
        "পিন নম্বর দিয়ে কনফার্ম করুন",
        "লেনদেন আইডি সংরক্ষণ করুন",
      ],
    },
  ];

  return (
    <Card className="mb-4">
      <CardHeader>
        <h3 className="text-xl font-bold">পেমেন্ট পদ্ধতি</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        {paymentMethods.map((method) => {
          const isOpen = openMethod === method.id;
          return (
            <div key={method.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleMethod(method.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-colors",
                  isOpen && "bg-accent"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg">{method.name}</span>
                  <span
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                    className="text-sm text-muted-foreground"
                  >
                    {method.number}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {isOpen && (
                <div className="border-t bg-muted/30">
                  <div className="p-4 space-y-3">
                    <div className="bg-primary/10 p-3 rounded-md">
                      <p className="text-sm font-medium mb-2">পেমেন্ট নম্বর:</p>
                      <p className="text-lg font-bold text-primary">
                        {method.number}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">
                        পেমেন্ট করার ধাপসমূহ:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {method.instructions.map((instruction, index) => (
                          <li key={index} className="text-muted-foreground">
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PaymentProcess;
