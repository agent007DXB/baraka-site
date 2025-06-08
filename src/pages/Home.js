import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [fomoText, setFomoText] = useState("");

  useEffect(() => {
    const names = ["Aliya", "John", "Fatima", "Carlos", "Riya"];
    const cities = ["Dubai", "Mumbai", "London", "Delhi", "Singapore"];
    const amounts = [250, 490, 1200, 700, 2000];

    const interval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      setFomoText(`${name} from ${city} just invested $${amount}`);
      setTimeout(() => setFomoText(""), 4000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Baraka Investment</h1>
        <p className="max-w-2xl mx-auto mb-3 text-lg">
          Grow your wealth with daily returns and trusted investment plans. Our platform is secure, transparent, and tailored to every investor.
        </p>
        <p className="max-w-xl mx-auto mb-6 text-base">
          Track your profits, manage deposits, and reach your financial goals — all in one place.
        </p>
        <Link to="/signup" className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded hover:bg-gray-100 transition">
          Start Investing
        </Link>
      </div>

      {/* Why Invest Section */}
      <section className="py-16 bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Why Invest With Us?</h2>
        <p className="text-gray-600 mb-10">We offer high returns, 24/7 support, and secure investment plans tailored to your goals.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { emoji: "📈", title: "Daily ROI", desc: "Earn up to 40% daily returns based on your VIP level." },
            { emoji: "🔒", title: "100% Secure", desc: "We ensure top-tier security and transparency." },
            { emoji: "⚡", title: "Instant Support", desc: "Our team is always here to assist you." },
            { emoji: "🌍", title: "Global Access", desc: "Used by investors in 30+ countries worldwide." },
            { emoji: "📊", title: "Smart Growth", desc: "Daily compounding builds your wealth faster." },
            { emoji: "🧾", title: "No Hidden Fees", desc: "Fully transparent — no surprises." },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded shadow p-6">
              <div className="text-4xl mb-2">{item.emoji}</div>
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "What is Baraka Investment?",
              a: "Baraka Investment is a platform where users can invest using bank or crypto, track returns daily, and manage their profiles with ease."
            },
            {
              q: "How do I earn returns?",
              a: "Returns are based on VIP levels. VIP 1 (<$500) gets 20%, VIP 2 ($500–$2000) gets 30%, and VIP 3 (>$2000) earns 40% daily."
            },
            {
              q: "Is KYC mandatory?",
              a: "Yes. Users must upload valid KYC documents to ensure safety and compliance."
            },
            {
              q: "How do I deposit or withdraw?",
              a: "You can deposit via bank/crypto and request withdrawals from your dashboard. Admins approve withdrawals manually."
            }
          ].map((faq, i) => (
            <details key={i} className="bg-gray-50 p-4 rounded shadow-sm">
              <summary className="font-medium cursor-pointer">{faq.q}</summary>
              <p className="mt-2 text-sm text-gray-700">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOMO Popup */}
      {fomoText && (
        <div className="fixed bottom-4 left-4 bg-white border px-4 py-2 rounded shadow text-sm text-gray-800 z-50">
          {fomoText}
        </div>
      )}
    </div>
  );
}
