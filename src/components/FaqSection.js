// src/components/FaqSection.js
import React from "react";

const faqs = [
  {
    question: "What is Baraka Investment?",
    answer:
      "Baraka Investment is a platform where users can invest using bank or crypto, track returns daily, and manage their profiles with ease.",
  },
  {
    question: "How do I earn returns?",
    answer:
      "Returns are based on VIP levels. VIP 1 (<$500) gets 20%, VIP 2 ($500–$2000) gets 30%, and VIP 3 (>$2000) earns 40% daily.",
  },
  {
    question: "Is KYC mandatory?",
    answer:
      "Yes. Users must upload valid KYC documents to ensure safety and compliance.",
  },
  {
    question: "How do I deposit or withdraw?",
    answer:
      "You can deposit via bank/crypto and request withdrawals from your dashboard. Admins approve withdrawals manually.",
  },
];

export default function FaqSection() {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <h3 className="font-semibold text-lg">{faq.question}</h3>
            <p className="text-gray-600 mt-1">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
