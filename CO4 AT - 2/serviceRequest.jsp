<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IT Service Request Management System - View (JSP)</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Header Banner -->
    <header class="app-header">
        <div class="header-container">
            <div class="header-top">
                <div class="header-titles">
                    <div class="badge-tag">UNIT IV - ASSESSMENT II | MVC VIEW (JSP)</div>
                    <h1>IT Service Request Management System</h1>
                    <p class="subtitle">Internal IT Technical Complaints Portal &bull; Apache Tomcat Web Application</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <main class="main-container">
        <div class="card-grid" style="max-width: 860px; margin: 0 auto;">
            
            <div class="glass-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <div class="icon-box">📋</div>
                        <div>
                            <h2>Submit IT Service Request</h2>
                            <p style="font-size: 0.85rem; color: var(--text-dim);">Enter your technical complaint details below for IT support triage.</p>
                        </div>
                    </div>
                    <span class="pill-badge badge-primary">View: serviceRequest.jsp</span>
                </div>

                <%-- Server-Side Validation Error Display --%>
                <%
                    List<String> errors = (List<String>) request.getAttribute("errors");
                    if (errors != null && !errors.isEmpty()) {
                %>
                    <div class="alert alert-danger" role="alert">
                        <div>
                            <strong>⚠️ Please correct the following errors before submitting:</strong>
                            <ul>
                                <% for (String err : errors) { %>
                                    <li><%= err %></li>
                                <% } %>
                            </ul>
                        </div>
                    </div>
                <%
                    }
                %>

                <%-- Form Values Preservation (For Sticky Form Behavior) --%>
                <%
                    String prevEmpId = (String) request.getAttribute("prevEmployeeId");
                    if (prevEmpId == null) prevEmpId = "";

                    String prevEmpName = (String) request.getAttribute("prevEmployeeName");
                    if (prevEmpName == null) prevEmpName = "";

                    String prevDept = (String) request.getAttribute("prevDepartment");
                    if (prevDept == null) prevDept = "";

                    String prevCategory = (String) request.getAttribute("prevCategory");
                    if (prevCategory == null) prevCategory = "";

                    String prevDesc = (String) request.getAttribute("prevDescription");
                    if (prevDesc == null) prevDesc = "";

                    String prevPriority = (String) request.getAttribute("prevPriority");
                    if (prevPriority == null) prevPriority = "Medium";
                %>

                <!-- Question 1: JSP Form Submitting to Controller Servlet via POST -->
                <form id="serviceRequestForm" action="ServiceRequestServlet" method="POST">
                    
                    <!-- Row 1: Employee ID and Employee Name (Q1.a) -->
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="employeeId">
                                Employee ID <span class="required">*</span>
                            </label>
                            <input type="text" 
                                   id="employeeId" 
                                   name="employeeId" 
                                   class="form-control" 
                                   placeholder="e.g. EMP-192521373" 
                                   value="<%= prevEmpId %>" 
                                   required>
                            <div class="form-helper">Unique corporate identification code</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="employeeName">
                                Employee Name <span class="required">*</span>
                            </label>
                            <input type="text" 
                                   id="employeeName" 
                                   name="employeeName" 
                                   class="form-control" 
                                   placeholder="e.g. Harish T" 
                                   value="<%= prevEmpName %>" 
                                   required>
                            <div class="form-helper">Full official employee name</div>
                        </div>
                    </div>

                    <!-- Row 2: Department and Problem Category (Q1.b, Q1.c) -->
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="department">
                                Department <span class="required">*</span>
                            </label>
                            <select id="department" name="department" class="form-select" required>
                                <option value="">-- Select Department --</option>
                                <option value="Software Engineering" <%= "Software Engineering".equals(prevDept) ? "selected" : "" %>>Software Engineering</option>
                                <option value="Information Technology" <%= "Information Technology".equals(prevDept) ? "selected" : "" %>>Information Technology</option>
                                <option value="Human Resources" <%= "Human Resources".equals(prevDept) ? "selected" : "" %>>Human Resources</option>
                                <option value="Finance & Accounts" <%= "Finance & Accounts".equals(prevDept) ? "selected" : "" %>>Finance & Accounts</option>
                                <option value="Marketing & Sales" <%= "Marketing & Sales".equals(prevDept) ? "selected" : "" %>>Marketing & Sales</option>
                                <option value="Operations & Logistics" <%= "Operations & Logistics".equals(prevDept) ? "selected" : "" %>>Operations & Logistics</option>
                                <option value="Quality Assurance" <%= "Quality Assurance".equals(prevDept) ? "selected" : "" %>>Quality Assurance</option>
                            </select>
                            <div class="form-helper">Your organizational business unit</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="problemCategory">
                                Problem Category <span class="required">*</span>
                            </label>
                            <select id="problemCategory" name="problemCategory" class="form-select" required>
                                <option value="">-- Select Category --</option>
                                <option value="Network" <%= "Network".equals(prevCategory) ? "selected" : "" %>>Network (Wi-Fi, VPN, LAN, DNS)</option>
                                <option value="Software" <%= "Software".equals(prevCategory) ? "selected" : "" %>>Software (IDE, OS, License, Tools)</option>
                                <option value="Hardware" <%= "Hardware".equals(prevCategory) ? "selected" : "" %>>Hardware (Laptop, Monitor, Peripherals)</option>
                                <option value="Account" <%= "Account".equals(prevCategory) ? "selected" : "" %>>Account (SSO, Password, Permissions)</option>
                                <option value="Other" <%= "Other".equals(prevCategory) ? "selected" : "" %>>Other Technical Issues</option>
                            </select>
                            <div class="form-helper">Classification of technical complaint</div>
                        </div>
                    </div>

                    <!-- Priority Selection (Q1.e) -->
                    <div class="form-group">
                        <label class="form-label">
                            Priority Level <span class="required">*</span>
                        </label>
                        <div class="radio-group">
                            <div class="radio-card priority-low">
                                <input type="radio" id="prioLow" name="priority" value="Low" <%= "Low".equals(prevPriority) ? "checked" : "" %>>
                                <label for="prioLow">
                                    <span>🟢 Low</span>
                                    <small style="font-size:0.75rem; color:var(--text-dim);">Minor / General Inquiry</small>
                                </label>
                            </div>
                            <div class="radio-card priority-medium">
                                <input type="radio" id="prioMedium" name="priority" value="Medium" <%= "Medium".equals(prevPriority) || prevPriority.isEmpty() ? "checked" : "" %>>
                                <label for="prioMedium">
                                    <span>🟡 Medium</span>
                                    <small style="font-size:0.75rem; color:var(--text-dim);">Standard Technical Issue</small>
                                </label>
                            </div>
                            <div class="radio-card priority-high">
                                <input type="radio" id="prioHigh" name="priority" value="High" <%= "High".equals(prevPriority) ? "checked" : "" %>>
                                <label for="prioHigh">
                                    <span>🔴 High</span>
                                    <small style="font-size:0.75rem; color:var(--text-dim);">Work Blocking / Critical</small>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Problem Description Multi-Line Control (Q1.d) -->
                    <div class="form-group">
                        <label class="form-label" for="problemDescription">
                            Problem Description <span class="required">*</span>
                        </label>
                        <textarea id="problemDescription" 
                                  name="problemDescription" 
                                  class="form-textarea" 
                                  rows="4" 
                                  placeholder="Describe the issue in detail (e.g. error messages, reproduction steps, specific software or hardware affected)..." 
                                  required><%= prevDesc %></textarea>
                        <div class="form-helper">Multi-line text area input (Minimum 10 characters)</div>
                    </div>

                    <!-- Form Action Buttons (Q1.f) -->
                    <div class="form-actions">
                        <button type="reset" class="btn btn-secondary">
                            <span>🔄</span> Reset Form
                        </button>
                        <button type="submit" id="btnSubmitRequest" class="btn btn-primary">
                            <span>🚀</span> Submit Service Request
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
        <p>IT Service Request Management System &bull; Unit IV: Representing Web Data &bull; MVC Architecture</p>
    </footer>

</body>
</html>
