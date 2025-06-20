import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About BoardSource
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re passionate surfers building the ultimate marketplace for
            buying and selling surfboards. Our mission is to connect surfers
            worldwide and make quality boards accessible to everyone.
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg text-white p-8">
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-100">
              <p>
                BoardSource was born out of a simple frustration: finding
                quality used surfboards was harder than it should be. Scattered
                across various platforms, buried in generic classifieds, or
                hidden in local surf shops, great boards were going unnoticed.
              </p>
              <p>
                As lifelong surfers, we knew there had to be a better way. We
                envisioned a dedicated platform where surfers could easily
                discover, evaluate, and purchase boards from fellow enthusiasts.
                A place where the rich history and craftsmanship of each board
                could be properly showcased.
              </p>
              <p>
                Today, BoardSource connects thousands of surfers across the
                country, from weekend warriors to professional athletes, all
                united by their love for the ocean and the perfect wave.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🌊 For Surfers, By Surfers
                </h3>
                <p className="text-gray-600 mb-4">
                  We understand the passion and dedication that goes into
                  surfing. Every board has a story, and we&apos;re here to help
                  those stories continue with new owners who will cherish them.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🎯 Quality First
                </h3>
                <p className="text-gray-600 mb-4">
                  We&apos;re committed to ensuring every transaction is safe,
                  transparent, and satisfying for both buyers and sellers in our
                  community.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ♻️ Sustainable Surfing
                </h3>
                <p className="text-gray-600 mb-4">
                  By facilitating the resale of surfboards, we&apos;re promoting
                  sustainability in the surf community and giving quality boards
                  a second life.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🤝 Building Community
                </h3>
                <p className="text-gray-600 mb-4">
                  More than just a marketplace, we&apos;re fostering a community
                  where surfers can connect, share experiences, and help each
                  other find their perfect board.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Have questions, feedback, or want to partner with us? We&apos;d
              love to hear from fellow surfers and ocean enthusiasts.
            </p>
            <div className="flex justify-center">
              <a
                href="mailto:hello@brdsrc.com"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
              >
                📧 hello@brdsrc.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
