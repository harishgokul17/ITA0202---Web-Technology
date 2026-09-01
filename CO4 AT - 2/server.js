/**
 * IT Service Request Management System - Unit IV (CO4-AT2)
 * Pure Node.js Web Server simulating Tomcat Servlet & JSP Execution
 *
 * Provides:
 * - GET  / or /serviceRequest.jsp -> Renders JSP Input Form View
 * - POST /ServiceRequestServlet   -> Executes Servlet Controller validation, Model creation & Forwarding
 * - GET  /acknowledgement.jsp    -> Renders Result View
 * - GET  /index.html              -> Serves Interactive Showcase Dashboard & MVC Simulator
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = process.env.PORT || 3000;
let requestCounter = 1000;

// In-Memory Model Store for submitted service requests
const submittedRequests = [];

// MIME Types
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.jsp':  'text/html; charset=UTF-8',
    '.css':  'text/css; charset=UTF-8',
    '.js':   'application/javascript; charset=UTF-8',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon'
};

/**
 * Renders serviceRequest.jsp dynamically with server-side validation error feedback and preserved inputs
 */
function renderServiceRequestJsp(errors = [], prevData = {}) {
    const prevEmpId = prevData.employeeId || 'EMP-192521373';
    const prevEmpName = prevData.employeeName || 'Harish T';
    const prevDept = prevData.department || 'Software Engineering';
    const prevCat = prevData.problemCategory || 'Network';
    const prevDesc = prevData.problemDescription || 'Unable to connect to internal staging VPN server from workstation. Getting TLS handshake timeout error.';
    const prevPriority = prevData.priority || 'High';

    let errorHtml = '';
    if (errors && errors.length > 0) {
        errorHtml = `
            <div class="alert alert-danger" role="alert">
                <div>
                    <strong>⚠️ Server-Side Validation Errors:</strong>
                    <ul>
                        ${errors.map(err => `<li>${escapeHtml(err)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IT Service Request Management System - View (JSP)</title>
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
                    <p class="subtitle">Live Backend Active &bull; http://localhost:${PORT} &bull; Apache Tomcat / Servlet Simulation</p>
                </div>
                <div style="display:flex; gap:0.5rem;">
                    <a href="index.html" class="btn btn-secondary" style="font-size:0.85rem;">⚡ Interactive Showcase</a>
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

                ${errorHtml}

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
                                   value="${escapeHtml(prevEmpId)}" 
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
                                   value="${escapeHtml(prevEmpName)}" 
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
                                <option value="Software Engineering" ${prevDept === 'Software Engineering' ? 'selected' : ''}>Software Engineering</option>
                                <option value="Information Technology" ${prevDept === 'Information Technology' ? 'selected' : ''}>Information Technology</option>
                                <option value="Human Resources" ${prevDept === 'Human Resources' ? 'selected' : ''}>Human Resources</option>
                                <option value="Finance & Accounts" ${prevDept === 'Finance & Accounts' ? 'selected' : ''}>Finance & Accounts</option>
                                <option value="Marketing & Sales" ${prevDept === 'Marketing & Sales' ? 'selected' : ''}>Marketing & Sales</option>
                                <option value="Operations & Logistics" ${prevDept === 'Operations & Logistics' ? 'selected' : ''}>Operations & Logistics</option>
                                <option value="Quality Assurance" ${prevDept === 'Quality Assurance' ? 'selected' : ''}>Quality Assurance</option>
                            </select>
                            <div class="form-helper">Your organizational business unit</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="problemCategory">
                                Problem Category <span class="required">*</span>
                            </label>
                            <select id="problemCategory" name="problemCategory" class="form-select" required>
                                <option value="">-- Select Category --</option>
                                <option value="Network" ${prevCat === 'Network' ? 'selected' : ''}>Network (Wi-Fi, VPN, LAN, DNS)</option>
                                <option value="Software" ${prevCat === 'Software' ? 'selected' : ''}>Software (IDE, OS, License, Tools)</option>
                                <option value="Hardware" ${prevCat === 'Hardware' ? 'selected' : ''}>Hardware (Laptop, Monitor, Peripherals)</option>
                                <option value="Account" ${prevCat === 'Account' ? 'selected' : ''}>Account (SSO, Password, Permissions)</option>
                                <option value="Other" ${prevCat === 'Other' ? 'selected' : ''}>Other Technical Issues</option>
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
                                <input type="radio" id="prioLow" name="priority" value="Low" ${prevPriority === 'Low' ? 'checked' : ''}>
                                <label for="prioLow">
                                    <span>🟢 Low</span>
                                    <small style="font-size:0.75rem; color:var(--text-dim);">Minor / General Inquiry</small>
                                </label>
                            </div>
                            <div class="radio-card priority-medium">
                                <input type="radio" id="prioMedium" name="priority" value="Medium" ${prevPriority === 'Medium' ? 'checked' : ''}>
                                <label for="prioMedium">
                                    <span>🟡 Medium</span>
                                    <small style="font-size:0.75rem; color:var(--text-dim);">Standard Technical Issue</small>
                                </label>
                            </div>
                            <div class="radio-card priority-high">
                                <input type="radio" id="prioHigh" name="priority" value="High" ${prevPriority === 'High' ? 'checked' : ''}>
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
                                  placeholder="Describe the issue in detail..." 
                                  required>${escapeHtml(prevDesc)}</textarea>
                        <div class="form-helper">Multi-line text area input (Minimum 10 characters)</div>
                    </div>

                    <!-- Form Action Buttons (Q1.f) -->
                    <div class="form-actions">
                        <button type="reset" class="btn btn-secondary">
                            <span>🔄</span> Reset Form
                        </button>
                        <button type="submit" id="btnSubmitRequest" class="btn btn-primary">
                            <span>🚀</span> Submit Service Request (POST)
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
</html>`;
}

/**
 * Renders acknowledgement.jsp dynamically for a given Model object
 */
function renderAcknowledgementJsp(model) {
    const priority = model.priority || 'Medium';
    let prioBadgeClass = 'badge-info';
    let sla = 'Within 48-72 Hours (Normal SLA)';
    if (priority === 'High') {
        prioBadgeClass = 'badge-danger';
        sla = 'Within 4 Hours (Critical SLA)';
    } else if (priority === 'Medium') {
        prioBadgeClass = 'badge-warning';
        sla = 'Within 24 Hours (Standard SLA)';
    } else if (priority === 'Low') {
        prioBadgeClass = 'badge-success';
    }

    let catIcon = '⚙️';
    if (model.problemCategory === 'Network') catIcon = '🌐';
    else if (model.problemCategory === 'Software') catIcon = '💻';
    else if (model.problemCategory === 'Hardware') catIcon = '🖥️';
    else if (model.problemCategory === 'Account') catIcon = '🔐';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Acknowledgement - IT Service Desk</title>
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
                    <div class="badge-tag">UNIT IV - ASSESSMENT II | MVC RESULT VIEW (JSP)</div>
                    <h1>IT Service Request Acknowledgement</h1>
                    <p class="subtitle">Confirmation &amp; Architecture Breakdown &bull; Server Processed via ServiceRequestServlet</p>
                </div>
                <div style="display:flex; gap:0.5rem;">
                    <a href="serviceRequest.jsp" class="btn btn-primary" style="font-size:0.85rem;">➕ Submit Another Request</a>
                    <a href="index.html" class="btn btn-secondary" style="font-size:0.85rem;">⚡ Interactive Showcase</a>
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
                        Your technical service request has been validated by <code>ServiceRequestServlet</code>, instantiated into <code>ServiceRequest</code> Model, and logged into the IT queue.
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
                            <span class="ticket-id-badge">${escapeHtml(model.requestId)}</span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 0.75rem; align-items: center;">
                        <span class="pill-badge badge-primary">
                            Status: ${escapeHtml(model.status)}
                        </span>
                        <span class="pill-badge ${prioBadgeClass}">
                            Priority: ${escapeHtml(model.priority)}
                        </span>
                    </div>
                </div>

                <!-- Structured Ticket Details Grid -->
                <div class="ticket-details-grid">
                    <div class="ticket-item">
                        <div class="item-label">Employee ID</div>
                        <div class="item-value"><code>${escapeHtml(model.employeeId)}</code></div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Employee Name</div>
                        <div class="item-value">${escapeHtml(model.employeeName)}</div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Department</div>
                        <div class="item-value">${escapeHtml(model.department)}</div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Problem Category</div>
                        <div class="item-value">
                            ${catIcon} ${escapeHtml(model.problemCategory)}
                        </div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Submission Timestamp</div>
                        <div class="item-value" style="font-size: 0.9rem;">
                            ${escapeHtml(model.submissionDate)}
                        </div>
                    </div>

                    <div class="ticket-item">
                        <div class="item-label">Estimated SLA Turnaround</div>
                        <div class="item-value" style="font-size: 0.9rem; color: #38bdf8;">
                            ${escapeHtml(sla)}
                        </div>
                    </div>
                </div>

                <!-- Problem Description Box -->
                <div class="ticket-description-box">
                    <div style="font-size: 0.82rem; font-weight: 700; color: #a5b4fc; text-transform: uppercase; margin-bottom: 0.5rem;">
                        Problem Description
                    </div>
                    <p style="color: #f8fafc; font-size: 0.95rem; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(model.problemDescription)}</p>
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

            <!-- ===================================================
                 LIVE REPORTS & ANALYTICS SECTION
                 Reads from server-side submittedRequests[] array
                 ================================================ -->
            ${buildReportHtml()}

        </div>
    </main>

    <!-- Print / PDF Styles (inline so they work without the showcase CSS) -->
    <style>
        @media print {
            .app-header, .app-footer, .btn, .form-actions,
            .report-no-print { display: none !important; }
            body { background: #fff !important; color: #0f172a !important; }
            .glass-card {
                background: #fff !important;
                border: 1px solid #cbd5e1 !important;
                box-shadow: none !important;
                backdrop-filter: none !important;
            }
            h2, h3, .item-label { color: #1e293b !important; }
            .item-value, td, th, p { color: #334155 !important; }
            .report-bar-track { background: #f1f5f9 !important; }
            .data-table th { background: #f8fafc !important; color: #1e293b !important; }
            .data-table td { color: #334155 !important; }
            @page { margin: 1.5cm 2cm; size: A4; }
        }
    </style>

    <!-- PDF Export Script -->
    <script>
        function exportAnalyticsPdf() {
            var btn = document.getElementById('btnPdfExport');
            if (btn) { btn.textContent = '\u23F3 Preparing...'; btn.disabled = true; }
            setTimeout(function() {
                window.print();
                setTimeout(function() {
                    if (btn) { btn.textContent = '\uD83D\uDCC4 Export as PDF'; btn.disabled = false; }
                }, 1500);
            }, 150);
        }
    </script>

    <!-- Footer -->
    <footer class="app-footer">
        <p>IT Service Request Management System &bull; Unit IV: Representing Web Data &bull; MVC Architecture</p>
    </footer>

</body>
</html>`;
}

/**
 * Builds the full server-side Reports & Analytics HTML section
 * using data from submittedRequests[].
 */
function buildReportHtml() {
    const tickets = submittedRequests;
    const total   = tickets.length;
    const now     = new Date().toLocaleString('en-IN');

    if (total === 0) {
        return `
            <div class="glass-card" style="text-align:center; padding: 2.5rem;">
                <div style="font-size:2.5rem;">📈</div>
                <h2 style="margin-top:0.5rem;">Reports &amp; Analytics</h2>
                <p style="color: var(--text-dim);">No requests have been submitted yet. Submit your first request above.</p>
            </div>`;
    }

    // ── Aggregations ─────────────────────────────────────────────────────────
    const CATEGORIES = ['Network', 'Software', 'Hardware', 'Account', 'Other'];
    const PRIORITIES = ['High', 'Medium', 'Low'];
    const CAT_ICONS  = { Network:'🌐', Software:'💻', Hardware:'🖥️', Account:'🔐', Other:'⚙️' };
    const PRIO_ICONS = { High:'🔴', Medium:'🟡', Low:'🟢' };
    const PRIO_BADGES = { High:'badge-danger', Medium:'badge-warning', Low:'badge-success' };
    const BAR_COLORS = {
        Network: 'linear-gradient(90deg,#3b82f6,#6366f1)',
        Software:'linear-gradient(90deg,#8b5cf6,#a855f7)',
        Hardware:'linear-gradient(90deg,#f59e0b,#f97316)',
        Account: 'linear-gradient(90deg,#10b981,#14b8a6)',
        Other:   'linear-gradient(90deg,#64748b,#94a3b8)',
        High:    'linear-gradient(90deg,#ef4444,#f97316)',
        Medium:  'linear-gradient(90deg,#f59e0b,#eab308)',
        Low:     'linear-gradient(90deg,#10b981,#22c55e)'
    };

    const catCounts  = {};
    const prioCounts = {};
    CATEGORIES.forEach(c => catCounts[c]  = 0);
    PRIORITIES.forEach(p => prioCounts[p] = 0);
    tickets.forEach(t => {
        if (catCounts[t.problemCategory]  !== undefined) catCounts[t.problemCategory]++;
        if (prioCounts[t.priority] !== undefined) prioCounts[t.priority]++;
    });

    const highCount   = prioCounts['High'];
    const mediumCount = prioCounts['Medium'];
    const lowCount    = prioCounts['Low'];
    const maxCat  = Math.max(...Object.values(catCounts), 1);
    const maxPrio = Math.max(highCount, mediumCount, lowCount, 1);

    // Top category
    let topCat = 'N/A', topCatCount = 0;
    Object.entries(catCounts).forEach(([c,n]) => { if (n > topCatCount) { topCat = c; topCatCount = n; } });

    // ── Stat Cards ────────────────────────────────────────────────────────────
    const statsHtml = [
        { id:'stat-total',  val: total,      label:'Total Requests',  color:'#818cf8', bg:'rgba(79,70,229,0.15)',   border:'rgba(79,70,229,0.3)'   },
        { id:'stat-high',   val: highCount,  label:'🔴 High Priority', color:'#fca5a5', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.3)'   },
        { id:'stat-medium', val: mediumCount,label:'🟡 Medium Priority',color:'#fcd34d', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)'  },
        { id:'stat-low',    val: lowCount,   label:'🟢 Low Priority',  color:'#6ee7b7', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.3)'  },
        { id:'stat-top',    val: (CAT_ICONS[topCat]||'') + ' ' + topCat, label:'Top Category', color:'#38bdf8', bg:'rgba(14,165,233,0.15)', border:'rgba(14,165,233,0.3)' }
    ].map(s => `
        <div style="background:${s.bg};border:1px solid ${s.border};border-radius:12px;padding:1.25rem;text-align:center;">
            <div style="font-size:1.9rem;font-weight:800;color:${s.color};">${s.val}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;font-weight:600;margin-top:0.25rem;">${s.label}</div>
        </div>`).join('');

    // ── Category bar chart rows ───────────────────────────────────────────────
    const catBarsHtml = CATEGORIES.map(cat => {
        const cnt  = catCounts[cat];
        const pct  = total > 0 ? Math.round((cnt / total) * 100) : 0;
        const wPct = cnt > 0  ? Math.max(Math.round((cnt / maxCat) * 100), 4) : 0;
        return `
            <div style="display:grid;grid-template-columns:130px 1fr 50px;gap:1rem;align-items:center;">
                <div style="font-size:0.88rem;font-weight:600;color:#e2e8f0;">${CAT_ICONS[cat]} ${cat}</div>
                <div style="height:22px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden;">
                    <div style="height:100%;width:${wPct}%;background:${BAR_COLORS[cat]};border-radius:999px;
                                display:flex;align-items:center;padding-left:0.6rem;
                                font-size:0.72rem;font-weight:700;color:rgba(255,255,255,0.85);">
                        ${cnt > 0 ? pct + '%' : ''}
                    </div>
                </div>
                <div style="font-size:0.9rem;font-weight:700;color:#94a3b8;text-align:right;">${cnt}</div>
            </div>`;
    }).join('');

    // ── Priority bar chart rows ───────────────────────────────────────────────
    const prioBarsHtml = PRIORITIES.map(prio => {
        const cnt  = prioCounts[prio];
        const pct  = total > 0 ? Math.round((cnt / total) * 100) : 0;
        const wPct = cnt > 0  ? Math.max(Math.round((cnt / maxPrio) * 100), 4) : 0;
        return `
            <div style="display:grid;grid-template-columns:130px 1fr 50px;gap:1rem;align-items:center;">
                <div style="font-size:0.88rem;font-weight:600;color:#e2e8f0;">${PRIO_ICONS[prio]} ${prio}</div>
                <div style="height:22px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden;">
                    <div style="height:100%;width:${wPct}%;background:${BAR_COLORS[prio]};border-radius:999px;
                                display:flex;align-items:center;padding-left:0.6rem;
                                font-size:0.72rem;font-weight:700;color:rgba(255,255,255,0.85);">
                        ${cnt > 0 ? pct + '%' : ''}
                    </div>
                </div>
                <div style="font-size:0.9rem;font-weight:700;color:#94a3b8;text-align:right;">${cnt}</div>
            </div>`;
    }).join('');

    // ── Timeline table rows ───────────────────────────────────────────────────
    const rowsHtml = tickets.map((t, idx) => {
        const badgeClass = PRIO_BADGES[t.priority] || 'badge-info';
        const catIcon    = CAT_ICONS[t.problemCategory] || '⚙️';
        const shortDesc  = t.problemDescription.length > 80
            ? escapeHtml(t.problemDescription.substring(0, 80)) + '\u2026'
            : escapeHtml(t.problemDescription);
        return `
            <tr>
                <td style="color:var(--text-dim);font-size:0.82rem;">${idx + 1}</td>
                <td><strong style="color:#38bdf8;font-family:var(--font-mono);">${escapeHtml(t.requestId)}</strong></td>
                <td style="font-size:0.82rem;color:#cbd5e1;white-space:nowrap;">${escapeHtml(t.submissionDate)}</td>
                <td>
                    <div style="font-weight:600;color:#fff;">${escapeHtml(t.employeeName)}</div>
                    <div style="font-size:0.75rem;color:var(--text-dim);"><code>${escapeHtml(t.employeeId)}</code></div>
                </td>
                <td style="font-size:0.85rem;">${escapeHtml(t.department)}</td>
                <td>${catIcon} ${escapeHtml(t.problemCategory)}</td>
                <td><span class="pill-badge ${badgeClass}">${escapeHtml(t.priority)}</span></td>
                <td style="font-size:0.83rem;color:#cbd5e1;">${shortDesc}</td>
            </tr>`;
    }).join('');

    // ── Compose full HTML ─────────────────────────────────────────────────────
    return `
        <!-- REPORTS & ANALYTICS SECTION -->
        <div class="glass-card" id="section-reports">

            <!-- Header row -->
            <div class="card-header">
                <div class="card-title-group">
                    <div class="icon-box">📈</div>
                    <div>
                        <h2>IT Service Desk — Issue Analytics Report</h2>
                        <p style="font-size:0.85rem;color:var(--text-dim);">Live aggregated breakdown of all ${total} submitted service request${total === 1 ? '' : 's'} · Generated at ${escapeHtml(now)}</p>
                    </div>
                </div>
                <div style="display:flex;gap:0.75rem;align-items:center;" class="report-no-print">
                    <button id="btnPdfExport" class="btn btn-primary" onclick="exportAnalyticsPdf()" style="gap:0.4rem;">
                        📄 Export as PDF
                    </button>
                </div>
            </div>

            <!-- Stat Cards -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin-bottom:1.75rem;">
                ${statsHtml}
            </div>

            <!-- Category Breakdown -->
            <h3 style="color:#c7d2fe;margin-bottom:1rem;">Issue Category Breakdown</h3>
            <div style="display:flex;flex-direction:column;gap:0.85rem;margin-bottom:2rem;">
                ${catBarsHtml}
            </div>

            <!-- Priority Distribution -->
            <h3 style="color:#c7d2fe;margin-bottom:1rem;">Priority Distribution</h3>
            <div style="display:flex;flex-direction:column;gap:0.85rem;margin-bottom:2rem;">
                ${prioBarsHtml}
            </div>
        </div>

        <!-- Full Timeline Table -->
        <div class="glass-card">
            <div class="card-header">
                <div class="card-title-group">
                    <div class="icon-box">🗂️</div>
                    <div>
                        <h2>Full Request Timeline</h2>
                        <p style="font-size:0.85rem;color:var(--text-dim);">All submitted service requests with date &amp; time, category, and priority.</p>
                    </div>
                </div>
            </div>
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ticket ID</th>
                            <th>Date &amp; Time</th>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Issue Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        </div>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * HTTP Request Handler
 */
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    // 1. Handle GET / or /serviceRequest.jsp -> Renders View Form
    if (method === 'GET' && (pathname === '/' || pathname === '/serviceRequest.jsp')) {
        const html = renderServiceRequestJsp();
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        return res.end(html);
    }

    // 2. Handle GET /acknowledgement.jsp -> Renders latest or fallback Result View
    if (method === 'GET' && pathname === '/acknowledgement.jsp') {
        const latestModel = submittedRequests.length > 0 ? submittedRequests[0] : {
            requestId: 'SR-1001',
            employeeId: 'EMP-192521373',
            employeeName: 'Harish T',
            department: 'Software Engineering',
            problemCategory: 'Network',
            problemDescription: 'Unable to connect to internal staging VPN server from workstation. Getting TLS handshake timeout.',
            priority: 'High',
            submissionDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'Open / Assigned to IT Queue'
        };
        const html = renderAcknowledgementJsp(latestModel);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        return res.end(html);
    }

    // 3. Handle POST /ServiceRequestServlet (Controller processing - Question 3)
    if (method === 'POST' && (pathname === '/ServiceRequestServlet' || pathname === '/service-request')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const params = querystring.parse(body);
            const employeeId = (params.employeeId || '').trim();
            const employeeName = (params.employeeName || '').trim();
            const department = (params.department || '').trim();
            const problemCategory = (params.problemCategory || '').trim();
            const problemDescription = (params.problemDescription || '').trim();
            const priority = (params.priority || '').trim();

            // Server-Side Validation (Question 3.c)
            const validationErrors = [];
            const VALID_CATEGORIES = ['Network', 'Software', 'Hardware', 'Account', 'Other'];
            const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

            if (!employeeId) {
                validationErrors.push('Employee ID is mandatory. Please provide a valid ID.');
            } else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(employeeId)) {
                validationErrors.push('Employee ID must be 3-20 alphanumeric characters (e.g. EMP-AK101).');
            }

            if (!employeeName) {
                validationErrors.push('Employee Name is mandatory.');
            } else if (employeeName.length < 2 || employeeName.length > 60) {
                validationErrors.push('Employee Name must be between 2 and 60 characters.');
            }

            if (!department) {
                validationErrors.push('Please select a valid Department.');
            }

            if (!problemCategory) {
                validationErrors.push('Problem Category is mandatory.');
            } else if (!VALID_CATEGORIES.includes(problemCategory)) {
                validationErrors.push('Invalid Problem Category selected. Valid options: Network, Software, Hardware, Account, Other.');
            }

            if (!problemDescription) {
                validationErrors.push('Problem Description is mandatory.');
            } else if (problemDescription.length < 10) {
                validationErrors.push('Problem Description must contain at least 10 characters explaining the issue.');
            }

            if (!priority) {
                validationErrors.push('Priority level is mandatory.');
            } else if (!VALID_PRIORITIES.includes(priority)) {
                validationErrors.push('Invalid Priority selected. Allowed values: Low, Medium, High.');
            }

            // Handle Validation Failure -> Forward back to serviceRequest.jsp (Sticky form)
            if (validationErrors.length > 0) {
                const html = renderServiceRequestJsp(validationErrors, params);
                res.writeHead(400, { 'Content-Type': 'text/html; charset=UTF-8' });
                return res.end(html);
            }

            // Validation Success -> Generate Request ID & Model (Question 3.d, 3.e)
            requestCounter++;
            const requestId = `SR-${requestCounter}`;
            const submissionDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

            const serviceRequestModel = {
                requestId,
                employeeId,
                employeeName,
                department,
                problemCategory,
                problemDescription,
                priority,
                submissionDate,
                status: 'Open / Assigned to IT Queue'
            };

            submittedRequests.unshift(serviceRequestModel);

            // Forward to acknowledgement.jsp (Question 3.g, Question 4)
            const html = renderAcknowledgementJsp(serviceRequestModel);
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            return res.end(html);
        });
        return;
    }

    // 4. Serve Static Files (style.css, script.js, index.html, etc.)
    let filePath = path.join(__dirname, pathname);
    
    // Default file check
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found - The requested resource does not exist.');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (readErr, data) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('500 Internal Server Error');
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 IT Service Request Management System Backend Running`);
    console.log(`📡 Local URL: http://localhost:${PORT}`);
    console.log(`📋 JSP Form:  http://localhost:${PORT}/serviceRequest.jsp`);
    console.log(`⚡ Showcase:  http://localhost:${PORT}/index.html`);
    console.log(`======================================================\n`);
});
