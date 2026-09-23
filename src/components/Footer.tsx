const footerLinks = {
  'Get to Know Us': [
    'About ShopNow',
    'Careers',
    'Press Releases',
    'Investor Relations',
    'Sustainability',
  ],
  'Make Money with Us': [
    'Sell products on ShopNow',
    'Sell on ShopNow Business',
    'Become an Affiliate',
    'Advertise Your Products',
  ],
  'Payment Products': [
    'ShopNow Rewards Visa Card',
    'ShopNow Store Card',
    'ShopNow Business Card',
    'ShopNow Currency Converter',
  ],
  'Let Us Help You': [
    'Your Account',
    'Returns Centre',
    'Track Packages',
    'Shipping Rates & Policies',
    'Help',
  ],
}

export default function Footer() {
  return (
    <footer className="mt-8 bg-navy-mid text-white">
      <div
        className="cursor-pointer bg-navy-light py-3 text-center text-sm transition-colors hover:bg-[#485769]"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      <div className="mx-auto max-w-375 px-8 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="mb-3 font-display text-sm font-bold">{section}</h3>
              <ul className="space-y-1.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-sm text-[#CCC] transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-375 flex-col items-center justify-between gap-3 px-8 py-5 md:flex-row">
          <span className="font-display text-xl font-extrabold text-white">
            shop<span className="text-orange">now</span>
          </span>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[#999]">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="transition-colors hover:text-white"
            >
              Conditions of Use
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="transition-colors hover:text-white"
            >
              Privacy Notice
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="transition-colors hover:text-white"
            >
              Your Ads Privacy Choices
            </a>
            <span>© 2026, ShopNow.com, Inc. or its affiliates</span>
          </div>
        </div>
      </div>
    </footer>
  )
}