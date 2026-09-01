/**
 * IT Service Request Management System - Unit IV (CO4-AT2)
 * Interactive Controller & View Simulator, Lifecycle Tracer, Ticket Queue
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigationTabs();
    initSampleDataGenerator();
    initFormSimulator();
    initTicketQueue();
    initReports();
});

// Global State
let requestCounter = 1001;
const sampleTickets = [
    {
        id: 'SR-1001',
        empId: 'EMP-192521373',
        name: 'Harish T',
        dept: 'Software Engineering',
        category: 'Network',
        priority: 'High',
        desc: 'Unable to connect to internal staging VPN server from workstation. Getting TLS handshake timeout.',
        timestamp: '2026-08-29 07:45:12',
        status: 'Open / In Queue',
        sla: 'Within 4 Hours (Critical SLA)'
    },
    {
        id: 'SR-1002',
        empId: 'EMP-AK102',
        name: 'Akash (IT Lead)',
        dept: 'Information Technology',
        category: 'Software',
        priority: 'Medium',
        desc: 'IntelliJ IDEA Ultimate license server unreachable on dev-vm-04. Requesting license activation.',
        timestamp: '2026-08-29 08:00:20',
        status: 'In Progress',
        sla: 'Within 24 Hours (Standard SLA)'
    },
    {
        id: 'SR-1003',
        empId: 'EMP-1045',
        name: 'Priya Sharma',
        dept: 'Human Resources',
        category: 'Account',
        priority: 'High',
        desc: 'MFA 2-factor authentication token expired and needs reset on corporate HRMS portal.',
        timestamp: '2026-08-29 08:10:45',
        status: 'Open / In Queue',
        sla: 'Within 4 Hours (Critical SLA)'
    },
    {
        id: 'SR-1004',
        empId: 'EMP-1102',
        name: 'David Miller',
        dept: 'Quality Assurance',
        category: 'Hardware',
        priority: 'Low',
        desc: 'Secondary 4K test monitor flickers and loses display signal during automated regression testing.',
        timestamp: '2026-08-29 08:15:30',
        status: 'Assigned to Hardware Tech',
        sla: 'Within 48-72 Hours (Normal SLA)'
    }
];

/**
 * Tab Navigation Switcher
 */
function initNavigationTabs() {
    const tabs = document.querySelectorAll('#mainNavTabs .tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetContent = document.getElementById(`tab-${target}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * Sample Data Presets featuring Akash
 */
const samplePresets = [
    {
        empId: 'EMP-192521373',
        name: 'Harish T',
        dept: 'Software Engineering',
        category: 'Network',
        priority: 'High',
        desc: 'VPN gateway timeout error occurred when accessing the remote Kubernetes cluster staging environment.'
    },
    {
        empId: 'EMP-192521374',
        name: 'Harish T',
        dept: 'Information Technology',
        category: 'Software',
        priority: 'Medium',
        desc: 'Docker Desktop WSL 2 integration failed after recent security patch update. Need reinstall.'
    },
    {
        empId: 'EMP-192521375',
        name: 'Harish T',
        dept: 'Quality Assurance',
        category: 'Hardware',
        priority: 'Low',
        desc: 'Requesting an additional USB-C display adapter for multi-screen automated test execution.'
    },
    {
        empId: 'EMP-192521376',
        name: 'Harish T',
        dept: 'Software Engineering',
        category: 'Account',
        priority: 'High',
        desc: 'GitHub Enterprise repository write access revoked after annual SSO policy refresh.'
    }
];

let presetIndex = 0;

function initSampleDataGenerator() {
    const btnFill = document.getElementById('btnFillSample');
    if (!btnFill) return;

    btnFill.addEventListener('click', () => {
        const sample = samplePresets[presetIndex % samplePresets.length];
        presetIndex++;

        document.getElementById('simEmpId').value = sample.empId;
        document.getElementById('simEmpName').value = sample.name;
        document.getElementById('simDept').value = sample.dept;
        document.getElementById('simCategory').value = sample.category;
        document.getElementById('simDesc').value = sample.desc;

        const prioRadio = document.querySelector(`input[name="simPriority"][value="${sample.priority}"]`);
        if (prioRadio) prioRadio.checked = true;

        // Clear previous error states
        const errorBox = document.getElementById('simErrorBox');
        if (errorBox) errorBox.style.display = 'none';

        const statusBadge = document.getElementById('lifecycleStatusBadge');
        if (statusBadge) {
            statusBadge.className = 'pill-badge badge-info';
            statusBadge.textContent = 'Status: Preset Loaded for ' + sample.name;
        }
    });
}

/**
 * Interactive MVC Form Submission Simulator
 */
function initFormSimulator() {
    const form = document.getElementById('simRequestForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Extract values
        const empId = (document.getElementById('simEmpId')?.value || '').trim();
        const empName = (document.getElementById('simEmpName')?.value || '').trim();
        const dept = (document.getElementById('simDept')?.value || '').trim();
        const category = (document.getElementById('simCategory')?.value || '').trim();
        const desc = (document.getElementById('simDesc')?.value || '').trim();
        const priorityEl = document.querySelector('input[name="simPriority"]:checked');
        const priority = priorityEl ? priorityEl.value : '';

        // 2. Simulated Controller Validation (Replicating ServiceRequestServlet.java)
        const errors = [];
        if (!empId) {
            errors.push("Employee ID is required.");
        } else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(empId)) {
            errors.push("Employee ID must be 3-20 alphanumeric characters (e.g. EMP-AK101).");
        }

        if (!empName) {
            errors.push("Employee Name is required.");
        } else if (empName.length < 2) {
            errors.push("Employee Name must be at least 2 characters long.");
        }

        if (!dept) {
            errors.push("Please select a valid Department.");
        }

        if (!category) {
            errors.push("Please select a Problem Category.");
        }

        if (!desc) {
            errors.push("Problem Description is required.");
        } else if (desc.length < 10) {
            errors.push("Problem Description must contain at least 10 characters explaining the issue.");
        }

        if (!priority) {
            errors.push("Please select a Priority level.");
        }

        const errorBox = document.getElementById('simErrorBox');
        const errorList = document.getElementById('simErrorList');
        const statusBadge = document.getElementById('lifecycleStatusBadge');

        if (errors.length > 0) {
            // Validation Failed
            if (errorList) errorList.innerHTML = errors.map(err => `<li>${err}</li>`).join('');
            if (errorBox) errorBox.style.display = 'flex';
            if (statusBadge) {
                statusBadge.className = 'pill-badge badge-danger';
                statusBadge.textContent = 'Validation Failed: ' + errors.length + ' error(s) found';
            }
            return;
        }

        // Validation Succeeded - Hide errors
        if (errorBox) errorBox.style.display = 'none';

        // 3. Trigger Lifecycle Animation
        animateMvcPipeline(empId, empName, dept, category, desc, priority);
    });
}

/**
 * Animate the MVC Lifecycle steps visually
 */
function animateMvcPipeline(empId, empName, dept, category, desc, priority) {
    const statusBadge = document.getElementById('lifecycleStatusBadge');
    const stepView = document.getElementById('stepViewInput');
    const stepCtrl = document.getElementById('stepController');
    const stepModel = document.getElementById('stepModel');

    if (statusBadge) {
        statusBadge.className = 'pill-badge badge-warning';
        statusBadge.textContent = 'Step 1: View (JSP Form) Dispatching POST...';
    }
    if (stepView) {
        stepView.style.borderColor = 'var(--secondary)';
        stepView.style.boxShadow = '0 0 15px rgba(14, 165, 233, 0.4)';
    }

    setTimeout(() => {
        if (statusBadge) statusBadge.textContent = 'Step 2: Controller (Servlet) Validating & Creating Model...';
        if (stepView) {
            stepView.style.borderColor = 'var(--border-color)';
            stepView.style.boxShadow = 'none';
        }
        if (stepCtrl) {
            stepCtrl.style.borderColor = 'var(--primary)';
            stepCtrl.style.boxShadow = '0 0 15px rgba(79, 70, 229, 0.5)';
        }

        setTimeout(() => {
            if (statusBadge) statusBadge.textContent = 'Step 3: Model JavaBean Instantiated in Request Scope...';
            if (stepCtrl) {
                stepCtrl.style.borderColor = 'var(--border-color)';
                stepCtrl.style.boxShadow = 'none';
            }
            if (stepModel) {
                stepModel.style.borderColor = 'var(--success)';
                stepModel.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
            }

            setTimeout(() => {
                if (statusBadge) {
                    statusBadge.className = 'pill-badge badge-success';
                    statusBadge.textContent = 'Step 4: Request Forwarded & Rendered in Acknowledgement View!';
                }
                if (stepModel) {
                    stepModel.style.borderColor = 'var(--border-color)';
                    stepModel.style.boxShadow = 'none';
                }

                // Process Ticket
                renderAcknowledgementResult(empId, empName, dept, category, desc, priority);
            }, 300);
        }, 300);
    }, 300);
}

/**
 * Render Acknowledgement Card & Add to Ticket Queue
 */
function renderAcknowledgementResult(empId, empName, dept, category, desc, priority) {
    requestCounter++;
    const ticketId = `SR-${requestCounter}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    let sla = 'Within 48-72 Hours (Normal SLA)';
    if (priority === 'High') sla = 'Within 4 Hours (Critical SLA)';
    else if (priority === 'Medium') sla = 'Within 24 Hours (Standard SLA)';

    let catIcon = '⚙️';
    if (category === 'Network') catIcon = '🌐';
    else if (category === 'Software') catIcon = '💻';
    else if (category === 'Hardware') catIcon = '🖥️';
    else if (category === 'Account') catIcon = '🔐';

    // Update Right Panel (acknowledgement.jsp)
    const elTicketId = document.getElementById('resTicketId');
    const elEmpId = document.getElementById('resEmpId');
    const elEmpName = document.getElementById('resEmpName');
    const elDept = document.getElementById('resDept');
    const elCategory = document.getElementById('resCategory');
    const elTimestamp = document.getElementById('resTimestamp');
    const elSla = document.getElementById('resSla');
    const elDesc = document.getElementById('resDesc');

    if (elTicketId) elTicketId.textContent = ticketId;
    if (elEmpId) elEmpId.textContent = empId;
    if (elEmpName) elEmpName.textContent = empName;
    if (elDept) elDept.textContent = dept;
    if (elCategory) elCategory.textContent = `${catIcon} ${category}`;
    if (elTimestamp) elTimestamp.textContent = timestamp;
    if (elSla) elSla.textContent = sla;
    if (elDesc) elDesc.textContent = desc;

    const prioBadge = document.getElementById('resPriority');
    if (prioBadge) {
        prioBadge.textContent = priority;
        prioBadge.className = 'pill-badge ' + (priority === 'High' ? 'badge-danger' : priority === 'Medium' ? 'badge-warning' : 'badge-success');
    }

    // Add to Ticket Table
    sampleTickets.unshift({
        id: ticketId,
        empId,
        name: empName,
        dept,
        category,
        priority,
        desc,
        timestamp,
        status: 'Open / In Queue',
        sla
    });

    renderTicketQueue();

    // Refresh analytics report with new data
    renderReport();
}

/**
 * Ticket Queue Table & Search Filter
 */
function initTicketQueue() {
    renderTicketQueue();

    const searchInput = document.getElementById('queueSearchInput');
    const catFilter = document.getElementById('queueCategoryFilter');
    const prioFilter = document.getElementById('queuePriorityFilter');

    if (searchInput) searchInput.addEventListener('input', renderTicketQueue);
    if (catFilter) catFilter.addEventListener('change', renderTicketQueue);
    if (prioFilter) prioFilter.addEventListener('change', renderTicketQueue);
}

function renderTicketQueue() {
    const tableBody = document.getElementById('ticketsTableBody');
    const badgeCount = document.getElementById('queueCountBadge');
    if (!tableBody) return;

    const searchVal = (document.getElementById('queueSearchInput')?.value || '').toLowerCase();
    const catVal = document.getElementById('queueCategoryFilter')?.value || 'ALL';
    const prioVal = document.getElementById('queuePriorityFilter')?.value || 'ALL';

    const filtered = sampleTickets.filter(t => {
        const matchesSearch = t.id.toLowerCase().includes(searchVal) ||
                              t.empId.toLowerCase().includes(searchVal) ||
                              t.name.toLowerCase().includes(searchVal) ||
                              t.desc.toLowerCase().includes(searchVal);

        const matchesCat = catVal === 'ALL' || t.category === catVal;
        const matchesPrio = prioVal === 'ALL' || t.priority === prioVal;

        return matchesSearch && matchesCat && matchesPrio;
    });

    if (badgeCount) {
        badgeCount.textContent = `Total Tickets: ${sampleTickets.length} (${filtered.length} visible)`;
    }

    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-dim); padding: 2rem;">
                    No service requests match the selected filters.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filtered.map(t => {
        const prioBadge = t.priority === 'High' ? 'badge-danger' : t.priority === 'Medium' ? 'badge-warning' : 'badge-success';
        let catIcon = '⚙️';
        if (t.category === 'Network') catIcon = '🌐';
        else if (t.category === 'Software') catIcon = '💻';
        else if (t.category === 'Hardware') catIcon = '🖥️';
        else if (t.category === 'Account') catIcon = '🔐';

        return `
            <tr>
                <td><strong style="color: #38bdf8; font-family: var(--font-mono);">${t.id}</strong></td>
                <td>
                    <div style="font-weight: 600; color: #fff;">${t.name}</div>
                    <div style="font-size: 0.78rem; color: var(--text-dim);"><code>${t.empId}</code></div>
                </td>
                <td>${t.dept}</td>
                <td>${catIcon} ${t.category}</td>
                <td><span class="pill-badge ${prioBadge}">${t.priority}</span></td>
                <td style="font-size: 0.82rem; color: #cbd5e1;">${t.sla}</td>
                <td><span class="pill-badge badge-primary">${t.status}</span></td>
            </tr>
        `;
    }).join('');
}

/**
 * Copy Code Helper
 */
function copyCode(elementId) {
    const codeEl = document.getElementById(elementId);
    if (!codeEl) return;

    navigator.clipboard.writeText(codeEl.innerText).then(() => {
        alert('Code snippet copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// =============================================================
// REPORTS & ANALYTICS ENGINE
// =============================================================

const CATEGORY_META = {
    Network:  { icon: '🌐', barClass: 'bar-network'  },
    Software: { icon: '💻', barClass: 'bar-software' },
    Hardware: { icon: '🖥️', barClass: 'bar-hardware' },
    Account:  { icon: '🔐', barClass: 'bar-account'  },
    Other:    { icon: '⚙️', barClass: 'bar-other'    }
};

const PRIORITY_META = {
    High:   { icon: '🔴', barClass: 'bar-high',   badgeClass: 'badge-danger'  },
    Medium: { icon: '🟡', barClass: 'bar-medium',  badgeClass: 'badge-warning' },
    Low:    { icon: '🟢', barClass: 'bar-low',     badgeClass: 'badge-success' }
};

/**
 * Initialise the Reports tab — wire up search and PDF button
 */
function initReports() {
    const searchInput = document.getElementById('reportSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderReport(searchInput.value));
    }

    const btnPdf = document.getElementById('btnExportPdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', exportReportAsPdf);
    }

    renderReport();
}

/**
 * Build/refresh the full analytics report
 * @param {string} [searchQuery=''] - Optional search filter for the timeline table
 */
function renderReport(searchQuery = '') {
    const total = sampleTickets.length;

    // ── Update stat cards ───────────────────────────────────
    const elTotal  = document.getElementById('statTotal');
    const elHigh   = document.getElementById('statHigh');
    const elMedium = document.getElementById('statMedium');
    const elLow    = document.getElementById('statLow');
    const elMost   = document.getElementById('statMostCommon');
    const elGenAt  = document.getElementById('reportGeneratedAt');

    const highCount   = sampleTickets.filter(t => t.priority === 'High').length;
    const mediumCount = sampleTickets.filter(t => t.priority === 'Medium').length;
    const lowCount    = sampleTickets.filter(t => t.priority === 'Low').length;

    // Count per category
    const catCounts = {};
    sampleTickets.forEach(t => {
        catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });

    // Find top category
    let topCat = '—';
    let topCount = 0;
    Object.entries(catCounts).forEach(([cat, cnt]) => {
        if (cnt > topCount) { topCat = cat; topCount = cnt; }
    });

    if (elTotal)  elTotal.textContent  = total;
    if (elHigh)   elHigh.textContent   = highCount;
    if (elMedium) elMedium.textContent = mediumCount;
    if (elLow)    elLow.textContent    = lowCount;
    if (elMost)   elMost.textContent   = total > 0 ? (CATEGORY_META[topCat]?.icon || '') + ' ' + topCat : '—';
    if (elGenAt)  elGenAt.textContent  = 'Generated: ' + new Date().toLocaleString('en-IN');

    // ── Category bar chart ───────────────────────────────────
    const catBarsEl = document.getElementById('reportCategoryBars');
    if (catBarsEl) {
        const categories = ['Network', 'Software', 'Hardware', 'Account', 'Other'];
        const maxCat = Math.max(...categories.map(c => catCounts[c] || 0), 1);

        catBarsEl.innerHTML = categories.map(cat => {
            const cnt   = catCounts[cat] || 0;
            const pct   = total > 0 ? Math.round((cnt / total) * 100) : 0;
            const width = total > 0 ? Math.max(Math.round((cnt / maxCat) * 100), cnt > 0 ? 4 : 0) : 0;
            const meta  = CATEGORY_META[cat] || { icon: '⚙️', barClass: 'bar-other' };

            return `
                <div class="report-bar-row">
                    <div class="report-bar-label">${meta.icon} ${cat}</div>
                    <div class="report-bar-track">
                        <div class="report-bar-fill ${meta.barClass}" style="width: ${width}%">
                            ${cnt > 0 ? pct + '%' : ''}
                        </div>
                    </div>
                    <div class="report-bar-count">${cnt}</div>
                </div>
            `;
        }).join('');
    }

    // ── Priority bar chart ───────────────────────────────────
    const prioBarsEl = document.getElementById('reportPriorityBars');
    if (prioBarsEl) {
        const priorities  = ['High', 'Medium', 'Low'];
        const prioCounts  = { High: highCount, Medium: mediumCount, Low: lowCount };
        const maxPrio     = Math.max(highCount, mediumCount, lowCount, 1);

        prioBarsEl.innerHTML = priorities.map(prio => {
            const cnt   = prioCounts[prio];
            const pct   = total > 0 ? Math.round((cnt / total) * 100) : 0;
            const width = total > 0 ? Math.max(Math.round((cnt / maxPrio) * 100), cnt > 0 ? 4 : 0) : 0;
            const meta  = PRIORITY_META[prio];

            return `
                <div class="report-bar-row">
                    <div class="report-bar-label">${meta.icon} ${prio}</div>
                    <div class="report-bar-track">
                        <div class="report-bar-fill ${meta.barClass}" style="width: ${width}%">
                            ${cnt > 0 ? pct + '%' : ''}
                        </div>
                    </div>
                    <div class="report-bar-count">${cnt}</div>
                </div>
            `;
        }).join('');
    }

    // ── Detailed Timeline Table ──────────────────────────────
    const tbody = document.getElementById('reportTableBody');
    if (!tbody) return;

    const q = searchQuery.toLowerCase().trim();
    const filtered = q
        ? sampleTickets.filter(t =>
            t.id.toLowerCase().includes(q)         ||
            t.name.toLowerCase().includes(q)       ||
            t.empId.toLowerCase().includes(q)      ||
            t.category.toLowerCase().includes(q)   ||
            t.dept.toLowerCase().includes(q)       ||
            t.desc.toLowerCase().includes(q)
          )
        : sampleTickets;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; color: var(--text-dim); padding: 2rem;">
                    ${total === 0
                        ? 'No requests submitted yet. Submit a request from the <strong>Live MVC Simulator</strong> tab.'
                        : 'No requests match your search query.'
                    }
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((t, idx) => {
        const prioBadge = PRIORITY_META[t.priority]?.badgeClass || 'badge-info';
        const catIcon   = CATEGORY_META[t.category]?.icon || '⚙️';
        // Truncate description for table readability
        const shortDesc = t.desc.length > 80 ? t.desc.substring(0, 80) + '…' : t.desc;

        return `
            <tr>
                <td style="color: var(--text-dim); font-size: 0.82rem;">${idx + 1}</td>
                <td><strong style="color: #38bdf8; font-family: var(--font-mono);">${t.id}</strong></td>
                <td style="font-size: 0.82rem; color: #cbd5e1; white-space: nowrap;">${t.timestamp}</td>
                <td>
                    <div style="font-weight: 600; color: #fff;">${t.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);"><code>${t.empId}</code></div>
                </td>
                <td style="font-size: 0.85rem;">${t.dept}</td>
                <td>${catIcon} ${t.category}</td>
                <td><span class="pill-badge ${prioBadge}">${t.priority}</span></td>
                <td style="font-size: 0.83rem; color: #cbd5e1;">${shortDesc}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Export the Reports tab as a print-ready PDF via the browser's native print dialog.
 * The @media print CSS in style.css automatically hides everything except the report.
 */
function exportReportAsPdf() {
    const btn = document.getElementById('btnExportPdf');
    if (btn) {
        btn.textContent = '⏳ Preparing PDF...';
        btn.disabled = true;
    }

    // Brief delay to let the DOM update, then trigger print
    setTimeout(() => {
        window.print();

        setTimeout(() => {
            if (btn) {
                btn.innerHTML = '<span>📄</span> Export as PDF';
                btn.disabled = false;
            }
        }, 1500);
    }, 200);
}

