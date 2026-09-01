<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.itservice.model.ServiceRequest" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Acknowledgement - IT Service Desk</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <%-- Read Model object & Request ID from Request Scope --%>
    <%
        ServiceRequest reqObj = (ServiceRequest) request.getAttribute("serviceRequest");
        String reqId = (String) request.getAttribute("requestId");
        String successMsg = (String) request.getAttribute("successMessage");

        // Fallback for direct URL access without servlet forwarding
        if (reqObj == null) {
            reqObj = new ServiceRequest(
                "SR-1001",
                "EMP-192521373",
                "Harish T",
                "Software Engineering",
                "Network",
                "Unable to connect to internal staging VPN server from workstation. Getting TLS timeout error.",
                "High"
            );
            reqId = reqObj.getRequestId();
            successMsg = "Demonstration Service Request (Direct View)";
        }
    %>

    <!-- Header Banner -->
    <header class="app-header">
        <div class="header-container">
            <div class="header-top">
                <div class="header-titles">
                    <div class="badge-tag">UNIT IV - ASSESSMENT II | MVC RESULT VIEW (JSP)</div>
                    <h1>IT Service Request Acknowledgement</h1>
                    <p class="subtitle">Confirmation &amp; Architecture Breakdown &bull; Apache Tomcat Web Application</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-container">
        <div style="max-width: 980px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
            
            <!-- Success Notification Alert (Q4.b) -->
            <div class="alert alert-success" role="alert">
                <span style="font-size: 1.5rem;">✅</span>
                <div>
                    <strong style="font-size: 1.1rem; color: #10b981;">Service Request Submitted Successfully!</strong>
                    <p style="margin-top: 0.25rem; color: #a7f3d0;">
                        <%= successMsg != null ? successMsg : "Your technical support request has been logged into the IT queue and assigned to an engineer." %>
                    </p>
                </div>
            </div>

            <!-- Question 4.a: Displaying Processed Ticket Information -->
            <div class="ticket-card">
                <div class="ticket-header">
                    <div>
                        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">
                            Generated Service Request Number
                        </span>
                        <div style="margin-top: 0.35rem;">
                            <span class="ticket-id-badge"><%= reqId != null ? reqId : reqObj.getRequestId() %></span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 0.75rem; align-items: center;">
                        <span class="pill-badge badge-primary">
                            Status: <%= reqObj.getStatus() != null ? reqObj.getStatus() : "Open" %>
                        </span>
                        <%
                            String priority = reqObj.getPriority();
                            String prioBadgeClass = "badge-info";
                            if ("High".equalsIgnoreCase(priority)) prioBadgeClass = "badge-danger";
                            else if ("Medium".equalsIgnoreCase(priority)) prioBadgeClass = "badge-warning";
                            else if ("Low".equalsIgnoreCase(priority)) prioBadgeClass = "badge-success";
                        %>
                        <span class="pill-badge <%= prioBadgeClass %>">
                            Priority: <%= priority %>
                        </span>
                    </div>
                </div>

                <!-- Structured Ticket Details Grid -->
                <div class="ticket-details-grid">
                    <div class="ticket-item">
                        <div class="item-label">Employee ID</div>
                        <div class="item-value"><code><%= reqObj.getEmployeeId() %></code></div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Employee Name</div>
                        <div class="item-value"><%= reqObj.getEmployeeName() %></div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Department</div>
                        <div class="item-value"><%= reqObj.getDepartment() %></div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Problem Category</div>
                        <div class="item-value">
                            <% 
                                String cat = reqObj.getProblemCategory();
                                String catIcon = "⚙️";
                                if ("Network".equalsIgnoreCase(cat)) catIcon = "🌐";
                                else if ("Software".equalsIgnoreCase(cat)) catIcon = "💻";
                                else if ("Hardware".equalsIgnoreCase(cat)) catIcon = "🖥️";
                                else if ("Account".equalsIgnoreCase(cat)) catIcon = "🔐";
                            %>
                            <%= catIcon %> <%= cat %>
                        </div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Submission Timestamp</div>
                        <div class="item-value" style="font-size: 0.9rem;">
                            <%= reqObj.getSubmissionDate() %>
                        </div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Estimated SLA Turnaround</div>
                        <div class="item-value" style="font-size: 0.9rem; color: #38bdf8;">
                            <%= reqObj.getEstimatedResolutionTime() %>
                        </div>
                    </div>
                </div>

                <!-- Problem Description Box -->
                <div class="ticket-description-box">
                    <div style="font-size: 0.82rem; font-weight: 700; color: #a5b4fc; text-transform: uppercase; margin-bottom: 0.5rem;">
                        Problem Description
                    </div>
                    <p style="color: #f8fafc; font-size: 0.95rem; white-space: pre-wrap; line-height: 1.6;"><%= reqObj.getProblemDescription() %></p>
                </div>

                <!-- Action Toolbar -->
                <div class="form-actions" style="margin-top: 0; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08);">
                    <a href="serviceRequest.jsp" class="btn btn-primary">
                        <span>➕</span> Submit Another Service Request
                    </a>
                </div>
            </div>

            <!-- Question 4.c & 4.d: MVC Architecture Explanation and Request Flow -->
            <div class="glass-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <div class="icon-box">🏛️</div>
                        <div>
                            <h2>MVC Architecture Component Mapping &amp; Execution Flow</h2>
                            <p style="font-size: 0.85rem; color: var(--text-dim);">Detailed technical explanation for Question 4 (Parts c and d)</p>
                        </div>
                    </div>
                    <span class="pill-badge badge-info">Evaluation Theory</span>
                </div>

                <!-- MVC Component Identification (Q4.c) -->
                <h3 style="margin-top: 0.5rem; margin-bottom: 1rem; color: #c7d2fe;">1. MVC Component Identification</h3>
                
                <div class="mvc-visualizer">
                    <!-- Model -->
                    <div class="mvc-card model">
                        <span class="mvc-tag model-tag">Model</span>
                        <div class="mvc-component-name"><code>ServiceRequest.java</code></div>
                        <p style="font-size: 0.88rem; color: var(--text-muted);">
                            <strong>Role &amp; Responsibilities:</strong>
                            <br>&bull; Encapsulates service request data and business state.
                            <br>&bull; Holds fields: <code>employeeId</code>, <code>employeeName</code>, <code>department</code>, <code>problemCategory</code>, <code>problemDescription</code>, <code>priority</code>.
                            <br>&bull; Free of presentation HTML or HTTP-specific servlet APIs.
                        </p>
                    </div>

                    <!-- View -->
                    <div class="mvc-card view">
                        <span class="mvc-tag view-tag">View</span>
                        <div class="mvc-component-name"><code>serviceRequest.jsp</code> &amp; <code>acknowledgement.jsp</code></div>
                        <p style="font-size: 0.88rem; color: var(--text-muted);">
                            <strong>Role &amp; Responsibilities:</strong>
                            <br>&bull; <code>serviceRequest.jsp</code> presents the HTML input form and displays server validation feedback.
                            <br>&bull; <code>acknowledgement.jsp</code> extracts Model attributes from request scope and renders the confirmation UI.
                        </p>
                    </div>

                    <!-- Controller -->
                    <div class="mvc-card controller">
                        <span class="mvc-tag controller-tag">Controller</span>
                        <div class="mvc-component-name"><code>ServiceRequestServlet.java</code></div>
                        <p style="font-size: 0.88rem; color: var(--text-muted);">
                            <strong>Role &amp; Responsibilities:</strong>
                            <br>&bull; Intercepts HTTP <code>POST</code> submissions in <code>doPost()</code>.
                            <br>&bull; Validates mandatory inputs and sanitizes parameters.
                            <br>&bull; Instantiates Model JavaBean and assigns request number.
                            <br>&bull; Dispatches request to the appropriate View.
                        </p>
                    </div>
                </div>

                <!-- Step-by-Step Request Lifecycle (Q4.d) -->
                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #c7d2fe;">2. End-to-End Request Lifecycle &amp; Execution Flow</h3>
                
                <div class="flow-pipeline">
                    <div class="flow-step">
                        <div class="step-num">1</div>
                        <div class="step-content">
                            <h4>Form Submission from View (Client Browser)</h4>
                            <p>The employee fills the service request form on <code>serviceRequest.jsp</code> and clicks <em>Submit Service Request</em>. The form issues an HTTP <code>POST</code> request to <code>ServiceRequestServlet</code>.</p>
                        </div>
                    </div>

                    <div class="flow-step">
                        <div class="step-num">2</div>
                        <div class="step-content">
                            <h4>Controller Request Interception &amp; Parameter Extraction</h4>
                            <p>The web container routes the request to <code>ServiceRequestServlet.doPost()</code>. The servlet extracts parameters using <code>request.getParameter("employeeId")</code>, <code>employeeName</code>, <code>department</code>, etc. All request state is stored in thread-safe local variables.</p>
                        </div>
                    </div>

                    <div class="flow-step">
                        <div class="step-num">3</div>
                        <div class="step-content">
                            <h4>Server-Side Validation</h4>
                            <p>The Controller verifies mandatory constraints (non-empty fields, valid categories, priority levels, minimum description length). If validation fails, errors are placed into request scope and forwarded back to <code>serviceRequest.jsp</code>.</p>
                        </div>
                    </div>

                    <div class="flow-step">
                        <div class="step-num">4</div>
                        <div class="step-content">
                            <h4>Model Instantiation &amp; Request ID Generation</h4>
                            <p>Upon successful validation, the Servlet generates a sequential ID (e.g. <code>SR-1001</code>) and instantiates a <code>ServiceRequest</code> Model object, populating it with the validated employee and issue details.</p>
                        </div>
                    </div>

                    <div class="flow-step">
                        <div class="step-num">5</div>
                        <div class="step-content">
                            <h4>Request Scope Binding &amp; Forwarding</h4>
                            <p>The Controller binds the Model to the request: <code>request.setAttribute("serviceRequest", serviceRequest)</code> and forwards execution using <code>RequestDispatcher.forward(request, response)</code> to <code>acknowledgement.jsp</code> without changing the browser URL.</p>
                        </div>
                    </div>

                    <div class="flow-step">
                        <div class="step-num">6</div>
                        <div class="step-content">
                            <h4>View Rendering &amp; Final Confirmation</h4>
                            <p><code>acknowledgement.jsp</code> reads the Model attributes from request scope and renders the confirmation screen displaying the generated Ticket ID, SLA, and complaint details back to the employee.</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
        <p>IT Service Request Management System &bull; Unit IV: Representing Web Data &bull; MVC Architecture</p>
    </footer>

</body>
</html>
