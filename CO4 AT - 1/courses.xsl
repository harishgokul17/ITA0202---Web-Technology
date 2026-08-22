<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!-- Generate HTML -->
    <xsl:output method="html" indent="yes"/>

    <!-- Match the XML document -->
    <xsl:template match="/">

        <html>

            <head>

                <meta charset="UTF-8"/>

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"/>

                <title>
                    University Course Enrollment Analysis
                </title>

                <!-- LINK EXTERNAL CSS -->
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="style.css"/>

            </head>

            <body>

                <!-- MAIN CONTAINER -->
                <div class="container">

                    <!-- ================= HEADER ================= -->

                    <header class="header">

                        <div class="header-icon">
                            🎓
                        </div>

                        <div class="header-content">

                            <h1>
                                Saveetha University Course Analysis
                            </h1>

                            <p>
                                Semester Enrollment &amp; Workload Report
                            </p>

                        </div>

                    </header>


                    <!-- ================= SUMMARY ================= -->

                    <section class="summary">

                        <div class="summary-card">

                            <div class="summary-icon">
                                📚
                            </div>

                            <div>
                                <h3>
                                    High Enrollment
                                </h3>

                                <p>
                                    Courses above 40 students
                                </p>
                            </div>

                        </div>


                        <div class="summary-card">

                            <div class="summary-icon">
                                📊
                            </div>

                            <div>
                                <h3>
                                    Sorted Analysis
                                </h3>

                                <p>
                                    Highest to lowest enrollment
                                </p>
                            </div>

                        </div>

                    </section>


                    <!-- ================= TABLE CARD ================= -->

                    <section class="table-card">

                        <div class="section-header">

                            <div>

                                <h2>
                                    High Enrollment Courses
                                </h2>

                                <p>
                                    Courses having more than 40 students
                                </p>

                            </div>

                            <span class="badge">
                                XSLT REPORT
                            </span>

                        </div>


                        <!-- TABLE -->

                        <div class="table-container">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Course Code
                                        </th>

                                        <th>
                                            Course Name
                                        </th>

                                        <th>
                                            Faculty
                                        </th>

                                        <th>
                                            Students
                                        </th>

                                        <th>
                                            Credits
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    <!--
                                        XPath CONDITION

                                        Only courses having
                                        more than 40 students
                                        are selected.
                                    -->

                                    <xsl:for-each
                                        select="courses/course[students &gt; 40]">

                                        <!--
                                            SORTING

                                            Students are sorted
                                            from highest to lowest.
                                        -->

                                        <xsl:sort
                                            select="students"
                                            data-type="number"
                                            order="descending"/>


                                        <tr>

                                            <!-- COURSE CODE -->

                                            <td>

                                                <span class="course-code">
                                                    <xsl:value-of
                                                        select="code"/>
                                                </span>

                                            </td>


                                            <!-- COURSE NAME -->

                                            <td class="course-name">

                                                <xsl:value-of
                                                    select="name"/>

                                            </td>


                                            <!-- FACULTY -->

                                            <td>

                                                <xsl:value-of
                                                    select="faculty"/>

                                            </td>


                                            <!-- STUDENTS -->

                                            <td>

                                                <span class="student-count">

                                                    <xsl:value-of
                                                        select="students"/>

                                                </span>

                                            </td>


                                            <!-- CREDITS -->

                                            <td>

                                                <span class="credit-count">

                                                    <xsl:value-of
                                                        select="credits"/>

                                                </span>

                                            </td>


                                            <!-- TYPE -->

                                            <td>

                                                <span class="course-type">

                                                    <xsl:value-of
                                                        select="type"/>

                                                </span>

                                            </td>

                                        </tr>

                                    </xsl:for-each>

                                </tbody>

                            </table>

                        </div>

                    </section>

                </div>

            </body>

        </html>

    </xsl:template>

</xsl:stylesheet>