import HeroSection from "../components/hero";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  featuresData,
  statsData,
  howItWorksData,
  testimonialsData,
} from "../data/landing";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-10">
      <HeroSection />

      {/* Stats Section */}
      <section className="py-20 bg-blue-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="cursor-pointer bg-[#fefefe] dark:bg-blue-900/10 text-center rounded-xl p-6 border border-gray-100 dark:border-gray-700 
                   shadow-sm hover:shadow-md transition duration-300 group"
              >
                <div className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium group-hover:text-blue-400 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Everything you need to manage your finances
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuresData.map((feature, index) => (
              <Card
                key={index}
                className="cursor-pointer bg-white/80 dark:bg-gray-900 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl transition hover:shadow-xl hover:-translate-y-1 duration-300 border border-transparent"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="text-primary text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 bg-blue-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((step, index) => (
              <div
                key={index}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 
                     shadow-md hover:shadow-xl hover:bg-white/80 dark:hover:bg-white/10 
                     transition duration-300"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-800 dark:text-gray-200 text-2xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* testimonial Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card
                key={index}
                className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md 
                     hover:shadow-xl hover:bg-white/80 dark:hover:bg-white/10 transition duration-300"
              >
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    “{testimonial.quote}”
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CIA Section */}
      <section className="py-20 relative bg-blue-600 overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500 opacity-90 pointer-events-none"></div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 animate-fade-in-down">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg animate-fade-in-up">
            Join thousands of users already managing their money smarter with{" "}
            <strong>FinApp</strong>.
          </p>
          <Link href="/dashboard" className="cursor-pointer">
            <Button
              size="lg"
              className="cursor-pointer bg-white text-blue-600 hover:bg-blue-100 font-semibold rounded-xl shadow-lg 
                   animate-bounce hover:scale-105 transition duration-300"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
