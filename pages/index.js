import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const ElderlyCareApp = () => {
  // 登入 / 使用者狀態
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login'); // login | home | selectCompanion | selectService | selectDateTime | success | bookings | profile | transactions

  // 登入 & 註冊
  const [authMode, setAuthMode] = useState('login'); // login | register
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerError, setRegisterError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // 系統設定（從 Airtable Settings 表來）
  const [systemSettings, setSystemSettings] = useState({
    brandName: '享老生活',
    systemTitle: '陪伴服務系統',
    staffTitle: '陪伴員',
    companions: [],
    services: []
  });

  // 預約資料
  const [bookingData, setBookingData] = useState({
    companion: '',
    services: [],
    date: '',
    time: ''
  });

  // 會員預約紀錄 / 消費紀錄
  const [bookings, setBookings] = useState([]);
  const [isBookingsLoading, setIsBookingsLoading] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);

  // 生成時段（5:00-22:00，每15分鐘）
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 22 && minute > 0) break;
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    loadSystemSettings();
  }, []);

  const loadSystemSettings = async () => {
    try {
      const response = await fetch('/api/airtable?action=getSettings');
      const data = await response.json();

      if (data.settings) {
        setSystemSettings(data.settings);
      }
    } catch (error) {
      console.error('載入設定失敗:', error);
    }
  };

  // ✅ 修正手機欄位：可以連續輸入、不會一個一個被打斷
  const handlePhoneInput = (value, setter) => {
    const onlyDigits = value.replace(/\D/g, '').slice(0, 10);
    setter(onlyDigits);
  };

  // ====== 登入 / 註冊 ======

  const handleLogin = async () => {
    if (!loginPhone || loginPhone.length !== 10) {
      setLoginError('請輸入正確的 10 碼手機號碼');
      return;
    }

    setLoginError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/airtable?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone })
      });

      const data = await response.json();

      if (data.success && data.user) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setCurrentPage('home');
      } else {
        setLoginError(data.error || '查無此會員，請先註冊或聯繫櫃台');
      }
    } catch (error) {
      setLoginError('連線錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerName.trim()) {
      setRegisterError('請輸入姓名');
      return;
    }
    if (!registerPhone || registerPhone.length !== 10) {
      setRegisterError('請輸入正確的 10 碼手機號碼');
      return;
    }

    setRegisterError('');
    setIsRegistering(true);

    try {
      const response = await fetch('/api/airtable?action=registerMember', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName.trim(),
          phone: registerPhone
        })
      });

      const data = await response.json();

      if (data.success && data.user) {
        // 註冊成功後直接登入
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setCurrentPage('home');
      } else {
        setRegisterError(data.error || '註冊失敗，請稍後再試');
      }
    } catch (error) {
      console.error(error);
      setRegisterError('連線錯誤，請稍後再試');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('login');
    setLoginPhone('');
    setBookingData({ companion: '', services: [], date: '', time: '' });
  };

  // ====== 預約送出 ======
  const submitBooking = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/airtable?action=createBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id, // Airtable 會員 recordId
          ...bookingData
        })
      });

      const data = await response.json();

      if (data.success) {
        setCurrentPage('success');
        setTimeout(() => {
          setCurrentPage('home');
          setBookingData({ companion: '', services: [], date: '', time: '' });
        }, 2500);
      } else {
        alert(data.error || '預約失敗，請稍後再試');
      }
    } catch (error) {
      console.error(error);
      alert('預約失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  // ====== 預約紀錄 / 消費紀錄 ======

  const loadBookings = async () => {
    if (!currentUser) return;
    setIsBookingsLoading(true);
    try {
      const res = await fetch('/api/airtable?action=getBookings&userId=' + currentUser.id);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) {
      console.error('讀取預約紀錄失敗', e);
    } finally {
      setIsBookingsLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!currentUser) return;
    setIsTransactionsLoading(true);
    try {
      const res = await fetch('/api/airtable?action=getTransactions&userId=' + currentUser.id);
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (e) {
      console.error('讀取消費紀錄失敗', e);
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  // ====== UI 元件 ======

  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-pink-100">
          {/* 標題區 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-400 via-pink-400 to-orange-400 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🏡</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-wide">
              {systemSettings.brandName}
            </h1>
            <p className="text-gray-600">{systemSettings.systemTitle}</p>
          </div>

          {/* 登入 / 註冊切換 */}
          <div className="flex mb-6 bg-pink-50 rounded-2xl p-1">
            <button
              className={`flex-1 py-2 rounded-2xl text-sm font-semibold transition-all ${
                authMode === 'login'
                  ? 'bg-white shadow text-pink-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setAuthMode('login')}
            >
              會員登入
            </button>
            <button
              className={`flex-1 py-2 rounded-2xl text-sm font-semibold transition-all ${
                authMode === 'register'
                  ? 'bg-white shadow text-pink-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setAuthMode('register')}
            >
              註冊新會員
            </button>
          </div>

          {authMode === 'login' ? (
            <>
              {/* 登入表單 */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  手機號碼
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={loginPhone}
                  onChange={(e) => handlePhoneInput(e.target.value, setLoginPhone)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleLogin();
                    }
                  }}
                  placeholder="0912345678"
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none text-lg tracking-widest bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">請輸入 10 碼手機號碼</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs">
                  {loginError}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading || loginPhone.length !== 10}
                className="w-full py-3 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white text-lg rounded-2xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? '登入中…' : '登入系統'}
              </button>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  若無法登入，請改用「註冊新會員」或聯繫服務人員協助。
                </p>
              </div>
            </>
          ) : (
            <>
              {/* 註冊表單 */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="請輸入姓名"
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none text-lg bg-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  手機號碼
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={registerPhone}
                  onChange={(e) => handlePhoneInput(e.target.value, setRegisterPhone)}
                  placeholder="0912345678"
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none text-lg tracking-widest bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">請輸入 10 碼手機號碼</p>
              </div>

              {registerError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs">
                  {registerError}
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="w-full py-3 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white text-lg rounded-2xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isRegistering ? '註冊中…' : '註冊並登入'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-10">
      {/* 頂部區塊 */}
      <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 p-6 rounded-b-[2.5rem] shadow-xl max-w-md mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">
              {currentUser?.name}
            </h1>
            <p className="text-white/90 text-sm">{systemSettings.brandName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30 transition-all text-xs flex items-center gap-1"
          >
            <span>登出</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
            <p className="text-white/80 text-xs mb-1">服務點數</p>
            <p className="text-white text-2xl font-bold">
              {currentUser?.points ?? 0}
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
            <p className="text-white/80 text-xs mb-1">儲值金</p>
            <p className="text-white text-xl font-bold">
              NT$ {currentUser?.balance ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* 服務卡片 */}
      <div className="px-4 mt-8 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">服務項目</h2>
        <ServiceCard
          icon="📅"
          title="預約服務"
          subtitle="選擇陪伴員和服務時間"
          onClick={() => setCurrentPage('selectCompanion')}
          gradient="from-rose-400 to-pink-400"
        />
        <ServiceCard
          icon="📝"
          title="預約記錄"
          subtitle="查看所有預約資訊"
          onClick={() => {
            setCurrentPage('bookings');
            loadBookings();
          }}
          gradient="from-pink-400 to-orange-400"
        />
        <ServiceCard
          icon="👤"
          title="個人資料"
          subtitle="查看會員基本資訊"
          onClick={() => setCurrentPage('profile')}
          gradient="from-orange-400 to-rose-400"
        />
        <ServiceCard
          icon="💳"
          title="消費紀錄"
          subtitle="查看儲值與扣點明細"
          onClick={() => {
            setCurrentPage('transactions');
            loadTransactions();
          }}
          gradient="from-rose-300 to-pink-400"
        />
      </div>
    </div>
  );

  const ServiceCard = ({ icon, title, subtitle, onClick, gradient }) => (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-3xl p-5 flex items-center gap-4 hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-pink-100"
    >
      <div
        className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg text-2xl`}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <svg
        className="w-6 h-6 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );

  const SelectCompanionPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <Header
        title={`選擇${systemSettings.staffTitle}`}
        onBack={() => setCurrentPage('home')}
      />
      <div className="px-4 py-6 max-w-md mx-auto">
        <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-3xl p-4 mb-5 border border-pink-200 text-center text-sm text-gray-700">
          💝 請選擇您希望的{systemSettings.staffTitle}
        </div>
        <div className="space-y-4">
          {systemSettings.companions.map((companion, index) => (
            <button
              key={index}
              onClick={() => {
                setBookingData({ ...bookingData, companion });
                setCurrentPage('selectService');
              }}
              className="w-full bg-white rounded-3xl p-5 flex items-center gap-4 hover:shadow-2xl transition-all transform hover:scale-[1.02] border border-pink-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-rose-300 to-orange-300 rounded-full flex items-center justify-center shadow-lg text-2xl">
                👨‍🦳
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-lg text-gray-800">{companion}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {systemSettings.staffTitle}
                </p>
              </div>
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const SelectServicePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-28">
      <Header
        title="選擇服務項目"
        onBack={() => setCurrentPage('selectCompanion')}
      />
      <div className="px-4 py-6 max-w-md mx-auto">
        <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-3xl p-4 mb-5 border border-pink-200 text-sm text-gray-700">
          <p>
            <span className="font-bold">{systemSettings.staffTitle}：</span>
            {bookingData.companion}
          </p>
          <p className="text-xs text-gray-600 mt-1">✨ 可勾選多項服務</p>
        </div>
        <div className="space-y-3">
          {systemSettings.services.map((service, index) => {
            const isSelected = bookingData.services.includes(service);
            return (
              <button
                key={index}
                onClick={() => {
                  const newServices = isSelected
                    ? bookingData.services.filter((s) => s !== service)
                    : [...bookingData.services, service];
                  setBookingData({ ...bookingData, services: newServices });
                }}
                className={`w-full rounded-3xl p-5 flex items-center justify-between transition-all transform hover:scale-[1.02] border-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white shadow-2xl border-transparent'
                    : 'bg-white text-gray-800 border-pink-100 hover:border-pink-300'
                }`}
              >
                <span className="font-bold text-base">{service}</span>
                {isSelected && (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        {bookingData.services.length > 0 && (
          <button
            onClick={() => setCurrentPage('selectDateTime')}
            className="fixed bottom-6 left-4 right-4 max-w-md mx-auto py-4 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white text-lg rounded-3xl font-bold shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            下一步：選擇時間
          </button>
        )}
      </div>
    </div>
  );

  const SelectDateTimePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-28">
      <Header
        title="選擇日期時間"
        onBack={() => setCurrentPage('selectService')}
      />
      <div className="px-4 py-6 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-5 mb-4 shadow-lg border border-pink-100 text-sm">
          <h3 className="font-bold text-gray-800 mb-3 text-base">
            📋 預約資訊
          </h3>
          <p className="mb-1">
            <span className="text-gray-500">{systemSettings.staffTitle}：</span>
            <span className="font-bold text-gray-800">
              {bookingData.companion}
            </span>
          </p>
          <p>
            <span className="text-gray-500">服務項目：</span>
            <span className="font-bold text-gray-800">
              {bookingData.services.join('、')}
            </span>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 mb-4 shadow-lg border border-pink-100">
          <label className="block text-gray-700 font-bold mb-2 text-sm">
            📅 選擇日期
          </label>
          <input
            type="date"
            value={bookingData.date}
            onChange={(e) =>
              setBookingData({ ...bookingData, date: e.target.value })
            }
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none text-sm"
          />
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-lg border border-pink-100">
          <label className="block text-gray-700 font-bold mb-3 text-sm">
            ⏰ 選擇時段
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto text-xs">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setBookingData({ ...bookingData, time })}
                className={`py-2 rounded-xl font-medium transition-all ${
                  bookingData.time === time
                    ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg transform scale-105'
                    : 'bg-pink-50 text-gray-700 hover:bg-pink-100 border border-pink-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {bookingData.date && bookingData.time && (
          <button
            onClick={submitBooking}
            disabled={isLoading}
            className="fixed bottom-6 left-4 right-4 max-w-md mx-auto py-4 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white text-lg rounded-3xl font-bold shadow-2xl disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? '預約中…' : '✓ 確認預約'}
          </button>
        )}
      </div>
    </div>
  );

  const SuccessPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-2xl max-w-sm w-full border border-pink-100">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
          <svg
            className="w-14 h-14 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">預約成功！</h2>
        <p className="text-gray-600 text-sm mb-1">我們已收到您的預約</p>
        <p className="text-xs text-gray-500">
          請等待{systemSettings.staffTitle}確認，我們會再與您聯繫。
        </p>
      </div>
    </div>
  );

  const BookingsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <Header title="預約記錄" onBack={() => setCurrentPage('home')} />
      <div className="px-4 py-6 max-w-md mx-auto">
        {isBookingsLoading ? (
          <p className="text-gray-500 text-sm">載入中…</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">目前沒有預約記錄</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-5 shadow border border-pink-100 text-sm"
              >
                <p className="font-bold text-gray-800 mb-1">
                  {b.date} {b.time}
                </p>
                <p className="text-gray-600 mb-1">
                  {systemSettings.staffTitle}：{b.companion}
                </p>
                <p className="text-gray-600 mb-1">
                  服務項目：{Array.isArray(b.services) ? b.services.join('、') : b.services}
                </p>
                <p className="text-xs text-gray-400">
                  狀態：{b.status || '待確認'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ProfilePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <Header title="個人資料" onBack={() => setCurrentPage('home')} />
      <div className="px-4 py-6 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100 space-y-3 text-sm">
          <div>
            <p className="text-gray-500 mb-1">姓名</p>
            <p className="font-bold text-gray-800">{currentUser?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">手機號碼</p>
            <p className="font-bold text-gray-800">{currentUser?.phone}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-pink-50 rounded-2xl p-3">
              <p className="text-gray-500 text-xs mb-1">服務點數</p>
              <p className="font-bold text-lg text-pink-500">
                {currentUser?.points ?? 0}
              </p>
            </div>
            <div className="bg-pink-50 rounded-2xl p-3">
              <p className="text-gray-500 text-xs mb-1">儲值金</p>
              <p className="font-bold text-lg text-pink-500">
                NT$ {currentUser?.balance ?? 0}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 pt-2">
            如需修改資料、調整點數或儲值金，請由管理者在 Airtable 後台直接編輯會員資料。
          </p>
        </div>
      </div>
    </div>
  );

  const TransactionsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <Header title="消費紀錄" onBack={() => setCurrentPage('home')} />
      <div className="px-4 py-6 max-w-md mx-auto">
        {isTransactionsLoading ? (
          <p className="text-gray-500 text-sm">載入中…</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">目前沒有消費紀錄</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-5 shadow border border-pink-100 text-sm"
              >
                <div className="flex justify-between mb-1">
                  <p className="font-bold text-gray-800">{t.type}</p>
                  <p className="font-bold text-pink-500">
                    {t.amountDisplay || t.amount}
                  </p>
                </div>
                <p className="text-gray-500 text-xs mb-1">
                  {t.date} {t.time}
                </p>
                <p className="text-gray-600 text-xs">{t.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const Header = ({ title, onBack }) => (
    <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 p-4 flex items-center sticky top-0 z-10 shadow-lg max-w-md mx-auto">
      <button
        onClick={onBack}
        className="mr-3 bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-all"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 className="text-white text-base font-bold">{title}</h1>
    </div>
  );

  const renderPage = () => {
    if (!isLoggedIn) return <LoginPage />;

    switch (currentPage) {
      case 'home':
        return <DashboardPage />;
      case 'selectCompanion':
        return <SelectCompanionPage />;
      case 'selectService':
        return <SelectServicePage />;
      case 'selectDateTime':
        return <SelectDateTimePage />;
      case 'success':
        return <SuccessPage />;
      case 'bookings':
        return <BookingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'transactions':
        return <TransactionsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      <Head>
        <title>
          {systemSettings.brandName} - {systemSettings.systemTitle}
        </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#fb7185" />
        <meta name="description" content="溫馨的陪伴養老服務" />
      </Head>
      {/* 外層直接鋪滿粉色背景，避免看到黑色底 */}
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex justify-center">
        {renderPage()}
      </div>
    </>
  );
};

export default ElderlyCareApp;
