import { e as createComponent, f as createAstro, r as renderTemplate, k as renderHead, h as addAttribute } from '../chunks/astro/server_BbGzQJLV.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-2zp6q64z> <head><meta charset="utf-8"><link rel="icon" type="image/x-icon" href="/favicon.ico"><meta name="viewport" content="width=device-width"><meta name="generator"', "><title>Admin - Kairos Prediction Game</title>", `</head> <body data-astro-cid-2zp6q64z> <div class="container" data-astro-cid-2zp6q64z> <div class="header" data-astro-cid-2zp6q64z> <h1 class="title" data-astro-cid-2zp6q64z>Admin Dashboard</h1> <button id="logoutBtn" class="btn secondary" data-astro-cid-2zp6q64z>Logout</button> </div> <div id="loginSection" class="card" data-astro-cid-2zp6q64z> <h2 class="card-title" data-astro-cid-2zp6q64z>Admin Login</h2> <form id="loginForm" data-astro-cid-2zp6q64z> <div class="form-group" data-astro-cid-2zp6q64z> <label for="username" class="form-label" data-astro-cid-2zp6q64z>Username</label> <input type="text" id="username" name="username" required class="form-input" data-astro-cid-2zp6q64z> </div> <div class="form-group" data-astro-cid-2zp6q64z> <label for="password" class="form-label" data-astro-cid-2zp6q64z>Password</label> <input type="password" id="password" name="password" required class="form-input" data-astro-cid-2zp6q64z> </div> <button type="submit" class="btn" data-astro-cid-2zp6q64z>Login</button> </form> <div id="loginMessage" class="message" data-astro-cid-2zp6q64z></div> </div> <div id="dashboardSection" class="hidden" data-astro-cid-2zp6q64z> <div class="stats" data-astro-cid-2zp6q64z> <div class="stat-card" data-astro-cid-2zp6q64z> <h3 class="stat-title" data-astro-cid-2zp6q64z>Total Wallets</h3> <p id="walletCount" class="stat-value" data-astro-cid-2zp6q64z>0</p> </div> <div class="stat-card" data-astro-cid-2zp6q64z> <h3 class="stat-title" data-astro-cid-2zp6q64z>Last Updated</h3> <p id="lastUpdated" class="stat-value" data-astro-cid-2zp6q64z>-</p> </div> </div> <div class="card" data-astro-cid-2zp6q64z> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;" data-astro-cid-2zp6q64z> <h2 class="card-title" data-astro-cid-2zp6q64z>Wallet Submissions</h2> <button id="exportBtn" class="btn" data-astro-cid-2zp6q64z>Export CSV</button> </div> <div class="wallet-list-container" data-astro-cid-2zp6q64z> <table class="wallet-table" data-astro-cid-2zp6q64z> <thead data-astro-cid-2zp6q64z> <tr data-astro-cid-2zp6q64z> <th data-astro-cid-2zp6q64z>User Name</th> <th data-astro-cid-2zp6q64z>Wallet Address</th> <th data-astro-cid-2zp6q64z>Date</th> </tr> </thead> <tbody id="walletTableBody" data-astro-cid-2zp6q64z> <tr data-astro-cid-2zp6q64z> <td colspan="3" style="text-align: center; color: #94a3b8;" data-astro-cid-2zp6q64z>No wallets found</td> </tr> </tbody> </table> </div> </div> </div> </div> <script>
      // Check if already logged in
      const credentials = sessionStorage.getItem('adminCredentials');
      if (credentials) {
        showDashboard();
        loadDashboardData();
      }
      
      // Login form handler
      document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginMessage = document.getElementById('loginMessage');
        
        try {
          // Encode credentials for Basic Authentication
          const credentials = btoa(\`\${username}:\${password}\`);
          
          // Test authentication
          const response = await fetch('/api/admin/wallets', {
            headers: {
              'Authorization': \`Basic \${credentials}\`
            }
          });
          
          if (response.ok) {
            // Store credentials in sessionStorage for subsequent requests
            sessionStorage.setItem('adminCredentials', credentials);
            showDashboard();
            loadDashboardData();
          } else {
            showMessage(loginMessage, 'Invalid credentials', 'error');
          }
        } catch (error) {
          console.error('Login error:', error);
          showMessage(loginMessage, 'Login failed', 'error');
        }
      });
      
      // Logout handler
      document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('adminCredentials');
        showLogin();
      });
      
      // Export handler
      document.getElementById('exportBtn').addEventListener('click', async function() {
        try {
          const credentials = sessionStorage.getItem('adminCredentials');
          if (!credentials) {
            showLogin();
            return;
          }
          
          const response = await fetch('/api/admin/wallets', {
            headers: {
              'Authorization': \`Basic \${credentials}\`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Create CSV content
              let csvContent = "Twitter Handle,Wallet Address,Timestamp\\n";
              data.wallets.forEach(wallet => {
                csvContent += \`"\${wallet.twitterHandle}","\${wallet.walletAddress}","\${wallet.timestamp}"\\n\`;
              });
              
              // Create download link
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', \`wallets-\${new Date().toISOString().split('T')[0]}.csv\`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              alert('Failed to export data: ' + data.message);
            }
          } else {
            alert('Unauthorized. Please login again.');
            showLogin();
          }
        } catch (error) {
          console.error('Export error:', error);
          alert('Export failed');
        }
      });
      
      // Show dashboard
      function showDashboard() {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('dashboardSection').classList.remove('hidden');
      }
      
      // Show login
      function showLogin() {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('dashboardSection').classList.add('hidden');
        document.getElementById('loginForm').reset();
        document.getElementById('loginMessage').style.display = 'none';
      }
      
      // Show message function
      function showMessage(element, text, type) {
        element.textContent = text;
        element.className = 'message ' + type;
        element.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
          element.style.display = 'none';
        }, 5000);
      }
      
      // Load dashboard data
      async function loadDashboardData() {
        try {
          const credentials = sessionStorage.getItem('adminCredentials');
          if (!credentials) {
            showLogin();
            return;
          }
          
          const response = await fetch('/api/admin/wallets', {
            headers: {
              'Authorization': \`Basic \${credentials}\`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              document.getElementById('walletCount').textContent = data.count;
              document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
              
              const tableBody = document.getElementById('walletTableBody');
              if (data.wallets.length > 0) {
                tableBody.innerHTML = '';
                // Show all submissions (most recent first)
                const wallets = data.wallets.reverse();
                wallets.forEach(wallet => {
                  const row = document.createElement('tr');
                  
                  // Format the date
                  const date = new Date(wallet.timestamp);
                  const formattedDate = date.toLocaleString();
                  
                  row.innerHTML = \`
                    <td>\${wallet.twitterHandle}</td>
                    <td style="font-family: monospace;">\${wallet.walletAddress}</td>
                    <td>\${formattedDate}</td>
                  \`;
                  tableBody.appendChild(row);
                });
              } else {
                tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #94a3b8;">No wallets found</td></tr>';
              }
            } else {
              alert('Failed to load data: ' + data.message);
              showLogin();
            }
          } else {
            alert('Unauthorized. Please login again.');
            showLogin();
          }
        } catch (error) {
          console.error('Dashboard load error:', error);
          alert('Failed to load dashboard data');
        }
      }
    <\/script> </body> </html>`], ['<html lang="en" data-astro-cid-2zp6q64z> <head><meta charset="utf-8"><link rel="icon" type="image/x-icon" href="/favicon.ico"><meta name="viewport" content="width=device-width"><meta name="generator"', "><title>Admin - Kairos Prediction Game</title>", `</head> <body data-astro-cid-2zp6q64z> <div class="container" data-astro-cid-2zp6q64z> <div class="header" data-astro-cid-2zp6q64z> <h1 class="title" data-astro-cid-2zp6q64z>Admin Dashboard</h1> <button id="logoutBtn" class="btn secondary" data-astro-cid-2zp6q64z>Logout</button> </div> <div id="loginSection" class="card" data-astro-cid-2zp6q64z> <h2 class="card-title" data-astro-cid-2zp6q64z>Admin Login</h2> <form id="loginForm" data-astro-cid-2zp6q64z> <div class="form-group" data-astro-cid-2zp6q64z> <label for="username" class="form-label" data-astro-cid-2zp6q64z>Username</label> <input type="text" id="username" name="username" required class="form-input" data-astro-cid-2zp6q64z> </div> <div class="form-group" data-astro-cid-2zp6q64z> <label for="password" class="form-label" data-astro-cid-2zp6q64z>Password</label> <input type="password" id="password" name="password" required class="form-input" data-astro-cid-2zp6q64z> </div> <button type="submit" class="btn" data-astro-cid-2zp6q64z>Login</button> </form> <div id="loginMessage" class="message" data-astro-cid-2zp6q64z></div> </div> <div id="dashboardSection" class="hidden" data-astro-cid-2zp6q64z> <div class="stats" data-astro-cid-2zp6q64z> <div class="stat-card" data-astro-cid-2zp6q64z> <h3 class="stat-title" data-astro-cid-2zp6q64z>Total Wallets</h3> <p id="walletCount" class="stat-value" data-astro-cid-2zp6q64z>0</p> </div> <div class="stat-card" data-astro-cid-2zp6q64z> <h3 class="stat-title" data-astro-cid-2zp6q64z>Last Updated</h3> <p id="lastUpdated" class="stat-value" data-astro-cid-2zp6q64z>-</p> </div> </div> <div class="card" data-astro-cid-2zp6q64z> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;" data-astro-cid-2zp6q64z> <h2 class="card-title" data-astro-cid-2zp6q64z>Wallet Submissions</h2> <button id="exportBtn" class="btn" data-astro-cid-2zp6q64z>Export CSV</button> </div> <div class="wallet-list-container" data-astro-cid-2zp6q64z> <table class="wallet-table" data-astro-cid-2zp6q64z> <thead data-astro-cid-2zp6q64z> <tr data-astro-cid-2zp6q64z> <th data-astro-cid-2zp6q64z>User Name</th> <th data-astro-cid-2zp6q64z>Wallet Address</th> <th data-astro-cid-2zp6q64z>Date</th> </tr> </thead> <tbody id="walletTableBody" data-astro-cid-2zp6q64z> <tr data-astro-cid-2zp6q64z> <td colspan="3" style="text-align: center; color: #94a3b8;" data-astro-cid-2zp6q64z>No wallets found</td> </tr> </tbody> </table> </div> </div> </div> </div> <script>
      // Check if already logged in
      const credentials = sessionStorage.getItem('adminCredentials');
      if (credentials) {
        showDashboard();
        loadDashboardData();
      }
      
      // Login form handler
      document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginMessage = document.getElementById('loginMessage');
        
        try {
          // Encode credentials for Basic Authentication
          const credentials = btoa(\\\`\\\${username}:\\\${password}\\\`);
          
          // Test authentication
          const response = await fetch('/api/admin/wallets', {
            headers: {
              'Authorization': \\\`Basic \\\${credentials}\\\`
            }
          });
          
          if (response.ok) {
            // Store credentials in sessionStorage for subsequent requests
            sessionStorage.setItem('adminCredentials', credentials);
            showDashboard();
            loadDashboardData();
          } else {
            showMessage(loginMessage, 'Invalid credentials', 'error');
          }
        } catch (error) {
          console.error('Login error:', error);
          showMessage(loginMessage, 'Login failed', 'error');
        }
      });
      
      // Logout handler
      document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('adminCredentials');
        showLogin();
      });
      
      // Export handler
      document.getElementById('exportBtn').addEventListener('click', async function() {
        try {
          const credentials = sessionStorage.getItem('adminCredentials');
          if (!credentials) {
            showLogin();
            return;
          }
          
          const response = await fetch('/api/admin/wallets', {
            headers: {
              'Authorization': \\\`Basic \\\${credentials}\\\`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Create CSV content
              let csvContent = "Twitter Handle,Wallet Address,Timestamp\\\\n";
              data.wallets.forEach(wallet => {
                csvContent += \\\`"\\\${wallet.twitterHandle}","\\\${wallet.walletAddress}","\\\${wallet.timestamp}"\\\\n\\\`;
              });
              
              // Create download link
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', \\\`wallets-\\\${new Date().toISOString().split('T')[0]}.csv\\\`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              alert('Failed to export data: ' + data.message);
            }
          } else {
            alert('Unauthorized. Please login again.');
            showLogin();
          }
        } catch (error) {
          console.error('Export error:', error);
          alert('Export failed');
        }
      });
      
      // Show dashboard
      function showDashboard() {
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('dashboardSection').classList.remove('hidden');
      }
      
      // Show login
      function showLogin() {
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('dashboardSection').classList.add('hidden');
        document.getElementById('loginForm').reset();
        document.getElementById('loginMessage').style.display = 'none';
      }
      
      // Show message function
      function showMessage(element, text, type) {
        element.textContent = text;
        element.className = 'message ' + type;
        element.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
          element.style.display = 'none';
        }, 5000);
      }
      
      // Load dashboard data
      async function loadDashboardData() {
        try {
          const credentials = sessionStorage.getItem('adminCredentials');
          if (!credentials) {
            showLogin();
            return;
          }
          
          const response = await fetch('/api/admin/wallets', {
            headers: {
              'Authorization': \\\`Basic \\\${credentials}\\\`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              document.getElementById('walletCount').textContent = data.count;
              document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
              
              const tableBody = document.getElementById('walletTableBody');
              if (data.wallets.length > 0) {
                tableBody.innerHTML = '';
                // Show all submissions (most recent first)
                const wallets = data.wallets.reverse();
                wallets.forEach(wallet => {
                  const row = document.createElement('tr');
                  
                  // Format the date
                  const date = new Date(wallet.timestamp);
                  const formattedDate = date.toLocaleString();
                  
                  row.innerHTML = \\\`
                    <td>\\\${wallet.twitterHandle}</td>
                    <td style="font-family: monospace;">\\\${wallet.walletAddress}</td>
                    <td>\\\${formattedDate}</td>
                  \\\`;
                  tableBody.appendChild(row);
                });
              } else {
                tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #94a3b8;">No wallets found</td></tr>';
              }
            } else {
              alert('Failed to load data: ' + data.message);
              showLogin();
            }
          } else {
            alert('Unauthorized. Please login again.');
            showLogin();
          }
        } catch (error) {
          console.error('Dashboard load error:', error);
          alert('Failed to load dashboard data');
        }
      }
    <\/script> </body> </html>`])), addAttribute(Astro2.generator, "content"), renderHead());
}, "/Users/sithu/Downloads/HyperWalletCollector 2/src/pages/admin.astro", void 0);

const $$file = "/Users/sithu/Downloads/HyperWalletCollector 2/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
