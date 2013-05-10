<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xls="http://www.w3.org/1999/XSL/Transform" xmlns:xslt="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="no"/>

    <xsl:template match="/tutorial">
        <html>
            <head>
                <link rel="stylesheet" href="styles/bootstrap.min.css" />
                <link rel="stylesheet" href="styles/idea.css" />

                <style type="text/css">
                    header
                    {
                    padding-bottom: 30px;
                    }

                    .example
                    {
                    padding-bottom: 30px;
                    }
                </style>
            </head>
            <body>
                <script type="text/javascript" src="scripts/jquery-2.0.0.min.js"></script>
                <script type="text/javascript" src="scripts/highlight.pack.js"></script>

                <script type="text/javascript" src="../src/Common.js"></script>
                <script type="text/javascript" src="../src/Common.js"></script>
                <script type="text/javascript" src="../src/Binding.js"></script>
                <script type="text/javascript" src="../src/View.js"></script>
                <script type="text/javascript" src="../src/JQuery.js"></script>
                <script type="text/javascript" src="../src/Debug.js"></script>

                <div id="tutorial" class="container">
                    <xls:apply-templates select="example"/>
                </div>

                <script type="text/javascript">
                    hljs.initHighlightingOnLoad();
                </script>
            </body>
        </html>
    </xsl:template>

    <xslt:template match="example">
        <section id="{@id}" class='example'>
            <h2><xsl:value-of select="title"/></h2>
            <div class="description">
                <xsl:value-of select="description" disable-output-escaping="yes"/>
            </div>

            <div class="source">
                <section>
                    <h4>HTML:</h4>
                    <pre><code><xsl:value-of select="markup"/></code></pre>
                </section>
                <section>
                    <h4>Javascript:</h4>
                    <pre><code><xsl:value-of select="script"/></code></pre>
                </section>
            </div>

            <div class="result">
                <xsl:value-of disable-output-escaping="yes" select="markup"/>
            </div>

            <script type="text/javascript">
                (function(){
                    <xsl:value-of disable-output-escaping="yes" select="script"/>
                }());
            </script>
        </section>
    </xslt:template>

</xsl:stylesheet>