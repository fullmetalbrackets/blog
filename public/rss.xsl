<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> Web Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <link rel="stylesheet" href="rss.css"/>
        <script>
            function copyURL(btn) {
            var url = window.location.href;
            
            // Try modern clipboard API first
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(function() {
                btn.textContent = 'Copied!';
                setTimeout(function() {
                    btn.textContent = 'Copy URL';
                }, 2000);
                }).catch(function() {
                // Fallback for mobile
                fallbackCopy(url, btn);
                });
            } else {
                // Fallback for older browsers
                fallbackCopy(url, btn);
            }
            }

            function fallbackCopy(text, btn) {
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                btn.textContent = 'Copied!';
                setTimeout(function() {
                btn.textContent = 'Copy URL';
                }, 2000);
            } catch (err) {
                btn.textContent = 'Failed';
            }
            document.body.removeChild(textArea);
            }
        </script>
      </head>
      <body class="bg-white">

        <div class="container-md px-3 py-3 markdown-body">
          <header class="pb-5">
            <h1 class="border-0">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="vertical-align: text-bottom; width: 1.325em; height: 1.325em;" class="pr-1" id="RSSicon" viewBox="0 0 256 256">
                <title>RSS Feed</title>
                <defs>
                  <linearGradient x1="0.085" y1="0.085" x2="0.915" y2="0.915" id="RSSg">
                    <stop  offset="0.0" stop-color="#E3702D"/><stop  offset="0.1071" stop-color="#EA7D31"/>
                    <stop  offset="0.3503" stop-color="#F69537"/><stop  offset="0.5" stop-color="#FB9E3A"/>
                    <stop  offset="0.7016" stop-color="#EA7C31"/><stop  offset="0.8866" stop-color="#DE642B"/>
                    <stop  offset="1.0" stop-color="#D95B29"/>
                  </linearGradient>
                </defs>
                <rect width="256" height="256" rx="55" ry="55" x="0"  y="0"  fill="#CC5D15"/>
                <rect width="246" height="246" rx="50" ry="50" x="5"  y="5"  fill="#F49C52"/>
                <rect width="236" height="236" rx="47" ry="47" x="10" y="10" fill="url(#RSSg)"/>
                <circle cx="68" cy="189" r="24" fill="#FFF"/>
                <path d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z" fill="#FFF"/>
                <path d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z" fill="#FFF"/>
              </svg>

              <span>RSS Feed</span>
            </h1>
            <nav class="container-md py-2 mt-md-2 markdown-body">
                <p class="bg-yellow-light ml-n1 p-3 mb-1 f3">
                    <strong>This is the RSS feed for blog posts at <a href="/" class=".link">fullmetalbrackets.com</a></strong>.
                    <br/>
                    Subscribe by copying the URL of this page into your newsreader.
                    <button id="copyBtn" onclick="copyURL(this)" style="font-family: var(--sub-font); background-color: var(--info); color: #000; border: 0; border-radius: 0.25em; padding: 4px 8px 3px 8px; font-weight: 700; font-size: 0.75em; margin: -2em 0 2em 0;">Copy URL</button>
                </p>
                <p class="text-gray f4 text-italic about">
                    <span>Visit <a href="https://aboutfeeds.com" target="_blank">About Feeds</a> to learn more.</span>
                </p>
            </nav>
            <h1 class="site-name"><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="f2 text-italic site-desc"><xsl:value-of select="/rss/channel/description"/></p>
            <a href="/" class="head_link" target="_blank">
              <button>Go To Site</button>
            </a>
          </header>
          <h2 class="posts">Blog Posts</h2>
            <xsl:for-each select="/rss/channel/item">
            <xsl:sort select="substring(pubDate, 13, 4)" order="descending" data-type="number" />
            <xsl:sort select="string-length(substring-before('JanFebMarAprMayJunJulAugSepOctNovDec', substring(pubDate, 9, 3)))" order="descending" data-type="number" />
            <xsl:sort select="substring(pubDate, 6, 2)" order="descending" data-type="number" />
            <div class="pb-5" id="top">
              <h3 class="mb-0 post-titles">
                <a target="_blank">
                  <xsl:attribute name="href">
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h3>
              <small class="date">
                <xsl:variable name="day" select="number(substring(pubDate, 6, 2))" />
                <xsl:variable name="month-abbr" select="substring(pubDate, 9, 3)" />
                <xsl:variable name="year" select="substring(pubDate, 13, 4)" />

                <xsl:variable name="month-full">
                <xsl:choose>
                    <xsl:when test="$month-abbr = 'Jan'">January</xsl:when>
                    <xsl:when test="$month-abbr = 'Feb'">February</xsl:when>
                    <xsl:when test="$month-abbr = 'Mar'">March</xsl:when>
                    <xsl:when test="$month-abbr = 'Apr'">April</xsl:when>
                    <xsl:when test="$month-abbr = 'May'">May</xsl:when>
                    <xsl:when test="$month-abbr = 'Jun'">June</xsl:when>
                    <xsl:when test="$month-abbr = 'Jul'">July</xsl:when>
                    <xsl:when test="$month-abbr = 'Aug'">August</xsl:when>
                    <xsl:when test="$month-abbr = 'Sep'">September</xsl:when>
                    <xsl:when test="$month-abbr = 'Oct'">October</xsl:when>
                    <xsl:when test="$month-abbr = 'Nov'">November</xsl:when>
                    <xsl:when test="$month-abbr = 'Dec'">December</xsl:when>
                </xsl:choose>
                </xsl:variable>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3M19 19H5V9H19V19M19 7H5V5H19V7Z" /></svg><xsl:value-of select="concat($month-full, ' ', $day, ', ', $year)" />
              </small>
              <p class="desc">
                <xsl:value-of select="description"/>
              </p>  
            </div>
          </xsl:for-each>
        <aside>
            <a href="/">
                <button>Go to site</button>
            </a>
            <a href="#top">
                <button>Back to top</button>
            </a>
        </aside>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>