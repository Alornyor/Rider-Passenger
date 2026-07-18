 // ===== DATABASE =====
        let riders = [];
        let passengers = [];
        let selectedRole = null;
        let isOnline = false;

        // ===== LOAD / SAVE =====
        function loadUsers() {
            const storedRiders = localStorage.getItem('ridehubRiders');
            riders = storedRiders ? JSON.parse(storedRiders) : [
                { fullname: 'Demo Rider', username: 'rider', email: 'rider@ridehub.com', phone: '0551234567', password: 'rider123', role: 'rider' }
            ];
            saveRiders();

            const storedPassengers = localStorage.getItem('ridehubPassengers');
            passengers = storedPassengers ? JSON.parse(storedPassengers) : [
                { fullname: 'Demo Passenger', username: 'passenger', email: 'passenger@ridehub.com', phone: '0557654321', password: 'pass123', role: 'passenger' }
            ];
            savePassengers();
        }

        function saveRiders() { localStorage.setItem('ridehubRiders', JSON.stringify(riders)); }
        function savePassengers() { localStorage.setItem('ridehubPassengers', JSON.stringify(passengers)); }

        // ===== TOAST =====
        function showToast(message, isSuccess = true) {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            toastMessage.textContent = message;
            toast.style.background = isSuccess ? '#0f172a' : '#dc2626';
            toast.querySelector('i').className = isSuccess ? 'fa-regular fa-circle-check' : 'fa-regular fa-circle-xmark';
            toast.classList.add('show');
            clearTimeout(toast.timeout);
            toast.timeout = setTimeout(() => toast.classList.remove('show'), 3000);
        }

        // ===== ROLE SELECTION =====
        function selectRole(role) {
            selectedRole = role;
            document.querySelectorAll('.role-option').forEach(el => {
                el.classList.remove('selected', 'rider-selected', 'passenger-selected');
                if (el.dataset.role === role) {
                    el.classList.add('selected');
                    el.classList.add(role === 'rider' ? 'rider-selected' : 'passenger-selected');
                }
            });
            document.getElementById('signupRoleError').style.display = 'none';
        }

        // ===== TABS =====
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const tab = this.dataset.tab;
                document.querySelectorAll('.form-wrapper').forEach(f => f.classList.remove('active'));
                document.getElementById(tab === 'login' ? 'loginForm' : 'signupForm').classList.add('active');
                document.getElementById('loginError').style.display = 'none';
                document.getElementById('signupError').style.display = 'none';
                clearErrors();
            });
        });

        // ===== ERROR HELPERS =====
        function clearErrors() {
            document.querySelectorAll('.error-msg').forEach(el => { el.classList.remove('show'); el.style.display = 'none'; });
            document.querySelectorAll('.form-group input').forEach(el => el.classList.remove('error'));
        }

        function showError(inputId, errorId, message) {
            const input = document.getElementById(inputId);
            const error = document.getElementById(errorId);
            if (input) input.classList.add('error');
            if (error) { error.textContent = message || error.textContent; error.classList.add('show'); error.style.display = 'block'; }
        }

        function hideError(inputId, errorId) {
            const input = document.getElementById(inputId);
            const error = document.getElementById(errorId);
            if (input) input.classList.remove('error');
            if (error) { error.classList.remove('show'); error.style.display = 'none'; }
        }

        // ===== VALIDATE SIGNUP =====
        function validateSignup() {
            let valid = true;
            clearErrors();

            const fullname = document.getElementById('signupFullname').value.trim();
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const phone = document.getElementById('signupPhone').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirm = document.getElementById('signupConfirm').value;

            if (!fullname || fullname.length < 2) { showError('signupFullname', 'signupFullnameError', 'Enter your full name'); valid = false; }
            else { hideError('signupFullname', 'signupFullnameError'); }

            if (!username || username.length < 3) { showError('signupUsername', 'signupUsernameError', 'Min 3 characters'); valid = false; }
            else {
                const exists = riders.some(u => u.username.toLowerCase() === username.toLowerCase()) ||
                    passengers.some(u => u.username.toLowerCase() === username.toLowerCase());
                if (exists) { showError('signupUsername', 'signupUsernameError', 'Username already taken'); valid = false; }
                else { hideError('signupUsername', 'signupUsernameError'); }
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) { showError('signupEmail', 'signupEmailError', 'Valid email required'); valid = false; }
            else { hideError('signupEmail', 'signupEmailError'); }

            if (!phone || phone.length < 8) { showError('signupPhone', 'signupPhoneError', 'Valid phone required'); valid = false; }
            else { hideError('signupPhone', 'signupPhoneError'); }

            if (!selectedRole) { document.getElementById('signupRoleError').style.display = 'block'; valid = false; }
            else { document.getElementById('signupRoleError').style.display = 'none'; }

            if (!password || password.length < 6) { showError('signupPassword', 'signupPasswordError', 'Min 6 characters'); valid = false; }
            else { hideError('signupPassword', 'signupPasswordError'); }

            if (password !== confirm) { showError('signupConfirm', 'signupConfirmError', 'Passwords do not match'); valid = false; }
            else { hideError('signupConfirm', 'signupConfirmError'); }

            return valid;
        }

        // ===== HANDLE SIGNUP =====
        function handleSignup() {
            document.getElementById('signupError').style.display = 'none';
            if (!validateSignup()) return;

            const newUser = {
                fullname: document.getElementById('signupFullname').value.trim(),
                username: document.getElementById('signupUsername').value.trim(),
                email: document.getElementById('signupEmail').value.trim(),
                phone: document.getElementById('signupPhone').value.trim(),
                password: document.getElementById('signupPassword').value,
                role: selectedRole
            };

            if (selectedRole === 'rider') {
                riders.push(newUser);
                saveRiders();
                showToast('🎉 Rider account created!');
                showRiderHome(newUser);
            } else {
                passengers.push(newUser);
                savePassengers();
                showToast('🎉 Passenger account created!');
                showPassengerHome(newUser);
            }

            document.getElementById('signupFullname').value = '';
            document.getElementById('signupUsername').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPhone').value = '';
            document.getElementById('signupPassword').value = '';
            document.getElementById('signupConfirm').value = '';
            selectedRole = null;
            document.querySelectorAll('.role-option').forEach(el => el.classList.remove('selected', 'rider-selected', 'passenger-selected'));
        }

        // ===== HANDLE LOGIN =====
        function handleLogin() {
            document.getElementById('loginError').style.display = 'none';
            clearErrors();

            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!username) { showError('loginUsername', 'loginUsernameError', 'Enter your username'); return; }
            else { hideError('loginUsername', 'loginUsernameError'); }

            if (!password) { showError('loginPassword', 'loginPasswordError', 'Enter your password'); return; }
            else { hideError('loginPassword', 'loginPasswordError'); }

            let foundUser = riders.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
            let role = foundUser ? 'rider' : null;

            if (!foundUser) {
                foundUser = passengers.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
                role = foundUser ? 'passenger' : null;
            }

            if (foundUser && role) {
                showToast('✅ Welcome back, ' + foundUser.fullname + '!');
                if (role === 'rider') showRiderHome(foundUser);
                else showPassengerHome(foundUser);
                document.getElementById('loginUsername').value = '';
                document.getElementById('loginPassword').value = '';
            } else {
                document.getElementById('loginError').style.display = 'block';
                document.getElementById('loginError').textContent = '❌ Invalid username or password.';
            }
        }

        // ===== STATUS TOGGLE =====
        function toggleStatus() {
            isOnline = !isOnline;
            const dot = document.getElementById('statusDot');
            const text = document.getElementById('statusText');
            const btn = document.getElementById('statusToggleBtn');

            if (isOnline) {
                dot.className = 'status-dot online';
                text.className = 'status-text online';
                text.textContent = 'Online';
                btn.className = 'status-toggle-btn';
                btn.innerHTML = '<i class="fa-solid fa-power-off"></i> Go Offline';
                showToast('🟢 You are now online!');
            } else {
                dot.className = 'status-dot offline';
                text.className = 'status-text offline';
                text.textContent = 'Offline';
                btn.className = 'status-toggle-btn offline';
                btn.innerHTML = '<i class="fa-solid fa-power-off"></i> Go Online';
                showToast('🔴 You are now offline', false);
            }
        }

        // ===== SECTION SWITCHING =====
        function switchSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Update nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.section === sectionId) {
                    item.classList.add('active');
                }
            });
        }

        // ===== SHOW HOMES =====
        function showRiderHome(user) {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('riderHome').classList.add('active');
            document.getElementById('passengerHome').classList.remove('active');
            document.getElementById('riderUsername').textContent = '@' + user.username;
            localStorage.setItem('currentUser', JSON.stringify({ ...user, role: 'rider' }));
            // Reset status
            isOnline = false;
            document.getElementById('statusDot').className = 'status-dot offline';
            document.getElementById('statusText').className = 'status-text offline';
            document.getElementById('statusText').textContent = 'Offline';
            document.getElementById('statusToggleBtn').className = 'status-toggle-btn offline';
            document.getElementById('statusToggleBtn').innerHTML = '<i class="fa-solid fa-power-off"></i> Go Online';
            // Default to Daily Logs
            switchSection('dailyLogs');
        }

        function showPassengerHome(user) {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('passengerHome').classList.add('active');
            document.getElementById('riderHome').classList.remove('active');
            document.getElementById('passengerUsername').textContent = '@' + user.username;
            localStorage.setItem('currentUser', JSON.stringify({ ...user, role: 'passenger' }));
        }

        // ===== LOGOUT =====
        function handleLogout() {
            if (confirm('Are you sure you want to logout?')) {
                isOnline = false;
                localStorage.removeItem('currentUser');
                document.getElementById('riderHome').classList.remove('active');
                document.getElementById('passengerHome').classList.remove('active');
                document.getElementById('landingPage').style.display = 'block';
                document.getElementById('loginUsername').value = '';
                document.getElementById('loginPassword').value = '';
                document.getElementById('loginError').style.display = 'none';
                clearErrors();
                showToast('👋 Logged out');
            }
        }

        // ===== ENTER KEY =====
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                if (document.getElementById('loginForm').classList.contains('active')) handleLogin();
                else if (document.getElementById('signupForm').classList.contains('active')) handleSignup();
            }
        });

        // ===== KEYBOARD NAVIGATION FOR SECTIONS =====
        document.addEventListener('keydown', function(e) {
            if (!document.getElementById('riderHome').classList.contains('active')) return;
            
            const sections = ['dailyLogs', 'ride', 'courier', 'jobs', 'motors'];
            const currentIndex = sections.findIndex(s => 
                document.getElementById(s).classList.contains('active')
            );
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % sections.length;
                switchSection(sections[nextIndex]);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
                switchSection(sections[prevIndex]);
            }
        });

        // ===== SESSION CHECK =====
        function checkSession() {
            loadUsers();
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                try {
                    const user = JSON.parse(currentUser);
                    let found = null;
                    if (user.role === 'rider') found = riders.find(u => u.username === user.username);
                    else if (user.role === 'passenger') found = passengers.find(u => u.username === user.username);
                    if (found) {
                        if (user.role === 'rider') showRiderHome(found);
                        else showPassengerHome(found);
                        return;
                    }
                } catch (e) { /* invalid */ }
            }
            document.getElementById('landingPage').style.display = 'block';
            document.getElementById('riderHome').classList.remove('active');
            document.getElementById('passengerHome').classList.remove('active');
        }

        // ===== INIT =====
        checkSession();
        console.log('🏍️ RideHub Rider App loaded!');
        console.log('📱 Navigate with: Daily Logs | Ride | Courier | Jobs | Motors');
    

        // ---------- STORAGE KEYS ----------
  const STORAGE_KEY = "pragya_rider_data";
  // Data structure:
  // {
  //   dailyTarget: 400,
  //   totalSavings: 0,           // cumulative savings pot (GH₵)
  //   entries: []                // each entry: { dateStr, earnings, fuel, maintenance, profit, savingsAdded }
  //   lastTodaysLogDate: "YYYY-MM-DD"  // to reset daily entry concept
  //   currentDayEntry: null (if we want single entry per day, but we allow multiple logs but aggregate for today's profit)
  // }
  // IMPROVED: We keep a "todayAggregate" computed from entries with today's date.
  // For simplicity & real-time: each log saves an entry with timestamp, and we compute today's profit = sum(profit of all entries where date = today)
  // And savings added = portion of profit saved (manually or auto).
  // BUT demo: each log triggers auto-savings suggestion but requires explicit add. Also user can "add suggested" to savings pot.
  // totalSavings is independent cumulative amount rider has saved.
  
  let appData = {
    dailyTarget: 400,
    totalSavings: 0,
    entries: []       // { id, date, earnings, fuel, maintenance, profit, savingsContributed (bool or amount actually moved to savings) }
  };

  // helper: get today's YYYY-MM-DD
  function getTodayStr() {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  // load from localStorage
  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) {
      try {
        const parsed = JSON.parse(raw);
        appData.dailyTarget = parsed.dailyTarget ?? 400;
        appData.totalSavings = parsed.totalSavings ?? 0;
        appData.entries = parsed.entries ?? [];
      } catch(e) { console.warn(e); }
    }
    // ensure daily target input sync
    document.getElementById('dailyTargetInput').value = appData.dailyTarget;
    updateTargetDisplay();
  }

  function saveData() {
    const toStore = {
      dailyTarget: appData.dailyTarget,
      totalSavings: appData.totalSavings,
      entries: appData.entries
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }

  // compute today's profit (sum of profit from all today's entries)
  function getTodayProfit() {
    const today = getTodayStr();
    let totalProfit = 0;
    for(let entry of appData.entries) {
      if(entry.date === today) {
        totalProfit += entry.profit;
      }
    }
    return totalProfit;
  }

  // get recommended savings = 20% of today's profit
  function getRecommendedSavings() {
    const profit = getTodayProfit();
    return Math.floor(profit * 0.2);
  }

  // get today's progress percentage vs daily target (savings target)
  function getSavingsProgressPercent() {
    const recommended = getRecommendedSavings();  // we show progress based on actual savings? better: based on accumulated savings added TODAY? 
    // But for visual, we compare recommended target versus dailyTarget, but more accurate: we display savings that rider actually added from today's profit.
    // However riders add via "add suggested" which increments totalSavings. To show target progress we need "today's savings added" variable.
    // But we can compute how much savings the rider has added today (records contributions). Let's track contributions per day.
    // Better: add a field in entry 'savingsFromThisEntry' that was moved to pot. Then compute sum of savingsFromThisEntry from today.
    let todaysSavedAmount = 0;
    const today = getTodayStr();
    for(let entry of appData.entries) {
      if(entry.date === today && entry.savingsMoved) {
        todaysSavedAmount += entry.savingsMoved;
      }
    }
    const target = appData.dailyTarget;
    let percent = target > 0 ? (todaysSavedAmount / target) * 100 : 0;
    percent = Math.min(100, percent);
    return { percent, todaysSavedAmount };
  }

  // Render profit dashboard, progress, total savings
  function renderDashboard() {
    const todayProfit = getTodayProfit();
    document.getElementById('todayProfitDisplay').innerHTML = `GH₵ ${todayProfit.toFixed(2)}`;
    const targetVal = appData.dailyTarget;
    document.getElementById('targetDisplay').innerHTML = `GH₵ ${targetVal}`;
    const { percent, todaysSavedAmount } = getSavingsProgressPercent();
    document.getElementById('progressPercent').innerHTML = `${Math.floor(percent)}%`;
    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('totalSavingsSpan').innerHTML = `GH₵ ${appData.totalSavings.toFixed(2)}`;
    // suggestion for today
    const suggestion = getRecommendedSavings();
    document.getElementById('suggestionSpan').innerHTML = `GH₵ ${suggestion}`;
  }
  
  function updateTargetDisplay() {
    document.getElementById('targetDisplay').innerHTML = `GH₵ ${appData.dailyTarget}`;
    renderDashboard();
  }

  // render history (recent 7 entries)
  function renderHistory() {
    const container = document.getElementById('historyList');
    if(!appData.entries.length) {
      container.innerHTML = '<div style="text-align: center; color:#8a9aa8;">No entries yet. Add your first ride →</div>';
      return;
    }
    // show last 5 entries sorted desc
    const sorted = [...appData.entries].sort((a,b)=> new Date(b.date) - new Date(a.date));
    const latest = sorted.slice(0, 6);
    container.innerHTML = latest.map(entry => {
      const profitColor = entry.profit >= 0 ? 'profit-positive' : 'text-danger';
      return `
        <div class="history-row">
          <span><i class="far fa-calendar-alt"></i> ${entry.date}</span>
          <span>💰 ${entry.earnings}</span>
          <span>⛽ ${entry.fuel}</span>
          <span>🔧 ${entry.maintenance}</span>
          <span class="${profitColor}">📈 ${entry.profit}</span>
        </div>
      `;
    }).join('');
  }
  
  // add a new revenue entry
  function addRevenueEntry(earnings, fuel, maintenance) {
    if(isNaN(earnings) || isNaN(fuel) || isNaN(maintenance)) return false;
    const profit = earnings - fuel - maintenance;
    const today = getTodayStr();
    const newEntry = {
      id: Date.now(),
      date: today,
      earnings: earnings,
      fuel: fuel,
      maintenance: maintenance,
      profit: profit,
      savingsMoved: 0   // amount rider decided to transfer to savings from this entry (later)
    };
    appData.entries.push(newEntry);
    saveData();
    renderDashboard();
    renderHistory();
    return profit;
  }

  // add savings from "add suggested" button: takes 20% of today's profit and adds to totalSavings,
  // also records per-entry that savings were moved (prevents duplicate counting)
  function addSuggestedSavingsToPot() {
    const today = getTodayStr();
    const todaysProfit = getTodayProfit();
    if(todaysProfit <= 0) {
      alert("No positive profit today. Add earnings first.");
      return false;
    }
    const suggested = Math.floor(todaysProfit * 0.2);
    if(suggested === 0) {
      alert("Suggested savings amount is zero. Add more profit.");
      return false;
    }
    // We must ensure we don't double-add savings for same profit multiple times.
    // For each entry we track if savings contributed. This is demo-simple: we can just add to totalSavings and also record in a separate array or mark entries.
    // To be robust: we set a flag on each today's entry 'savingsMoved' to accumulate.
    let alreadyAddedForToday = 0;
    let todayEntries = appData.entries.filter(e => e.date === today);
    for(let ent of todayEntries) {
      if(ent.savingsMoved && ent.savingsMoved > 0) alreadyAddedForToday += ent.savingsMoved;
    }
    if(alreadyAddedForToday >= suggested) {
      alert(`Already added GH₵ ${alreadyAddedForToday} savings today. You can add again tomorrow or reset.`);
      return false;
    }
    // add remaining difference
    const toAdd = suggested - alreadyAddedForToday;
    if(toAdd <= 0) return false;
    appData.totalSavings += toAdd;
    // distribute to first entry without full contribution (for UI we simply mark savingsMoved increment on first entry)
    for(let ent of todayEntries) {
      if(ent.savingsMoved < suggested && toAdd > 0) {
        let remainingForEntry = suggested - ent.savingsMoved;
        let addNow = Math.min(remainingForEntry, toAdd);
        ent.savingsMoved = (ent.savingsMoved || 0) + addNow;
        break; // only one entry for simplicity
      }
    }
    saveData();
    renderDashboard();
    renderHistory();
    alert(`✅ Added GH₵ ${toAdd} to savings pot! Total savings: GH₵ ${appData.totalSavings}`);
    return true;
  }
  
  // reset today's logs (clear all entries from today)
  function resetTodayLogs() {
    const today = getTodayStr();
    const newEntries = appData.entries.filter(entry => entry.date !== today);
    appData.entries = newEntries;
    saveData();
    renderDashboard();
    renderHistory();
    alert("Today's ride logs have been reset. You can start fresh.");
  }
  
  // update daily savings target
  function setDailyTarget(value) {
    let newTarget = parseFloat(value);
    if(isNaN(newTarget) || newTarget <= 0) newTarget = 400;
    appData.dailyTarget = newTarget;
    saveData();
    updateTargetDisplay();
    renderDashboard();
  }
  
  // event listeners & manual init
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderDashboard();
    renderHistory();
    
    // log button
    document.getElementById('logEntryBtn').addEventListener('click', () => {
      const earnings = parseFloat(document.getElementById('earningsInput').value);
      const fuel = parseFloat(document.getElementById('fuelInput').value);
      const maintenance = parseFloat(document.getElementById('maintenanceInput').value);
      if(isNaN(earnings) || earnings <= 0) {
        alert("Please enter valid earnings (GH₵)");
        return;
      }
      if(isNaN(fuel)) fuel = 0;
      if(isNaN(maintenance)) maintenance = 0;
      addRevenueEntry(earnings, fuel, maintenance);
      // clear inputs except maybe keep earnings? leave fields
      document.getElementById('earningsInput').value = '';
      document.getElementById('fuelInput').value = '';
      document.getElementById('maintenanceInput').value = '';
      alert(`✅ Logged: profit GH₵ ${(earnings - fuel - maintenance).toFixed(2)}. Use "Add suggested" to move savings to pot.`);
    });
    
    document.getElementById('resetDayBtn').addEventListener('click', () => {
      if(confirm("Reset all today's logs? This cannot be undone.")) {
        resetTodayLogs();
      }
    });
    
    document.getElementById('updateTargetBtn').addEventListener('click', () => {
      const newTarget = document.getElementById('dailyTargetInput').value;
      setDailyTarget(newTarget);
    });
    
    document.getElementById('forceSaveReminderBtn').addEventListener('click', () => {
      addSuggestedSavingsToPot();
    });
    
    // extra sync: update dashboard whenever localStorage may change, but real-time via actions
    window.addEventListener('storage', (e) => {
      if(e.key === STORAGE_KEY) {
        loadData();
        renderDashboard();
        renderHistory();
      }
    });
  });