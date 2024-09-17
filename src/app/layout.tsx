'use client'
import { Poppins } from 'next/font/google'
import './globals.css'
import { RootChildren } from './components/RootChildren'
import { Providers } from './providers'
import PageTransition from './components/PageTransition'

// Load Poppins font with Latin and Cyrillic subsets
const poppins = Poppins({
  subsets: ['latin', 'latin-ext'], // Note: Poppins currently supports latin and latin-ext subsets
  weight: ['400', '500', '600', '700'], // Include the weights you need
  display: 'swap', // Optional: for better font loading performance
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <PageTransition>
            <RootChildren>{children}</RootChildren>
          </PageTransition>
        </Providers>

        {/* <!-- Yandex.Metrika counter --> */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html:
              '(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }};k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");ym(98371026, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});',
          }}
        ></script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/98371026"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
        {/* <!-- /Yandex.Metrika counter --> */}
      </body>
    </html>
  )
}
