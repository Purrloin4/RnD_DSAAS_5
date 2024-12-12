// Hotjar.tsx
 
"use client";
import Script from "next/script";
import EnviromentStrings from "@/src/enums/envStrings";
 
const HotJar = () => {
  if (process.env.VERCEL_ENV === EnviromentStrings.PRODUCTION) {
    return (
      <Script id="hotjar">
        {`
          (function (h, o, t, j, a, r) {
            h.hj =
              h.hj ||
              function () {
                // eslint-disable-next-line prefer-rest-params
                (h.hj.q = h.hj.q || []).push(arguments);
              };
            h._hjSettings = { hjid:5217513, hjsv: 6 };
            a = o.getElementsByTagName("head")[0];
            r = o.createElement("script");
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
          })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
        `}
      </Script>
    );
  }
  return null;
};
 
export { HotJar };