import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Activity, BellRing, CheckCircle, Globe, LayoutDashboard, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-12 dark:bg-gray-950 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              MouNa Monitoring <span className="text-primary">Real-Time</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
             Keep all users informed about the status of all MouNa services.
            </p>
            
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-50 py-12 dark:bg-gray-900/50 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Everything you need to monitor uptime</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Powerful tools designed for developers and ops teams.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Website & API</h3>
                  <p className="text-gray-600 dark:text-gray-300">Monitor HTTP, Ping, TCP, and Keyword responses every minute.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BellRing className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Real-Time Alerts</h3>
                  <p className="text-gray-600 dark:text-gray-300">Get notified instantly via Email, SMS, Slack, or Webhooks.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Public Status Pages</h3>
                  <p className="text-gray-600 dark:text-gray-300">Keep users informed with beautiful, customizable status pages.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Multi-Region</h3>
                  <p className="text-gray-600 dark:text-gray-300">Check from multiple locations to eliminate false positives.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        {/* <section id="pricing" className="bg-white py-20 dark:bg-gray-950 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Simple, transparent pricing</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Start for free, upgrade when you need more power.</p>
            </div>
            
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2"> */}
              {/* Free Plan */}
                {/* <Card className="relative overflow-hidden flex flex-col border-gray-200 dark:border-gray-800">
                  <div className="p-8 pb-0">
                    <h3 className="text-xl font-semibold mb-2">Hobby</h3>
                    <div className="mb-4 flex items-baseline">
                      <span className="text-4xl font-extrabold tracking-tight">$0</span>
                      <span className="text-gray-500 ml-1 font-medium">/month</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Perfect for side projects and personal websites.</p>
                  </div>
                  <div className="flex-1 p-8 pt-0 flex flex-col">
                    <ul className="space-y-4 mb-8 flex-1">
                      <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span className="text-gray-600 dark:text-gray-300">5 Monitors</span></li>
                      <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span className="text-gray-600 dark:text-gray-300">5-minute checks</span></li>
                      <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span className="text-gray-600 dark:text-gray-300">Email Alerts</span></li>
                      <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span className="text-gray-600 dark:text-gray-300">1 Status Page</span></li>
                    </ul>
                    <Link href="/signup" className="w-full">
                      <Button variant="outline" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </Card> */}

              {/* Pro Plan */}
              {/* <Card className="relative overflow-hidden flex flex-col border-primary shadow-xl ring-1 ring-primary/20">
                <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>
                <div className="p-8 pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-primary">Pro</h3>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Most Popular</span>
                  </div>
                  <div className="mb-4 flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight">$19</span>
                    <span className="text-gray-500 ml-1 font-medium">/month</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">For professionals and growing businesses.</p>
                </div>
                <div className="flex-1 p-8 pt-0 flex flex-col">
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span className="text-gray-600 dark:text-gray-300">50 Monitors</span></li>
                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span className="text-gray-600 dark:text-gray-300">1-minute checks</span></li>
                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span className="text-gray-600 dark:text-gray-300">Email, SMS, Webhook Alerts</span></li>
                    <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary" /><span className="text-gray-600 dark:text-gray-300">Unlimited Status Pages</span></li>
                  </ul>
                  <Link href="/signup" className="w-full">
                    <Button className="w-full">Start Free Trial</Button>
                  </Link>
                </div>
              </Card> */}
            {/* </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  );
}
