import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [systemSettings, setSystemSettings] = useState({
    brandName: '享老生活',
    systemTitle: '陪伴服務系統',
    staffTitle: '陪伴員',
    companions: [],
    services: []
  });
  
  const [bookingData, setBookingData] = useState({
    companion: '',
    services: [],
    date: '',
    time: ''
  });

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

  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setLoginPhone(value);
  };

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
        setLoginError(data.error || '查無此會員，請聯繫櫃台');
      }
    } catch (error) {
      setLoginError('連線錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('login');
    setLoginPhone('');
    setBookingData({ companion: '', services: [], date: '', time: '' });
  };

  const submitBooking = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/airtable?action=createBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          ...bookingData
        })
      });
      
      if (response.ok) {
        setCurrentPage('success');
        setTimeout(() => {
          setCurrentPage('home');
          setBookingData({ companion: '', services: [], date: '', time: '' });
        }, 3000);
      }
    } catch (error) {
      alert('預約失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full max-w-md border border-pink-100">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-rose-400 via-pink-400 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-wide">{systemSettings.brandName}</h1>
          <p className="text-gray-600 text-lg">{systemSettings.systemTitle}</p>
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 text-base font-medium mb-3">
            請輸入手機號碼
          </label>
          <input
            type="tel"
            value={loginPhone}
            onChange={handlePhoneInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
            placeholder="0912345678"
            maxLength="10"
            autoComplete="tel"
            className="w-full px-5 py-4 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none text-xl tracking-wider transition-all"
          />
          <p className="text-sm text-gray-500 mt-2">請輸入 10 碼手機號碼</p>
        </div>

        {loginError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
            {loginError}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading || loginPhone.length !== 10}
          className="w-full py-4 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white text-lg rounded-2xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? '登入中...' : '登入系統'}
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 bg-pink-50 rounded-xl p-3">
            💝 首次使用請聯繫櫃台註冊會員
          </p>
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-6">
      <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 p-8 rounded-b-[3rem] shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-white text-3xl font-bold mb-1">{currentUser?.name}</h1>
            <p className="text-white/90 text-base">{systemSettings.brandName}</p>
          </div>
          <button onClick={handleLogout} className="text-white bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
            <p className="text-white/90 text-sm mb-1">服務點數</p>
            <p className="text-white text-3xl font-bold">{currentUser?.points}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
            <p className="text-white/90 text-sm mb-1">儲值金</p>
            <p className="text-white text-2xl font-bold">NT$ {currentUser?.balance}</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">服務項目</h2>
        <div className="space-y-4">
          <ServiceCard 
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            title="預約服務" 
            subtitle="選擇陪伴員和服務時間"
            onClick={() => setCurrentPage('selectCompanion')}
            gradient="from-rose-400 to-pink-400"
          />
          <ServiceCard 
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            title="預約記錄" 
            subtitle="查看所有預約資訊"
            onClick={() => alert('功能開發中')}
            gradient="from-pink-400 to-orange-400"
          />
          <ServiceCard 
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            title="個人資料" 
            subtitle="查看會員資訊"
            onClick={() => alert('功能開發中')}
            gradient="from-orange-400 to-rose-400"
          />
        </div>
      </div>
    </div>
  );

  const ServiceCard = ({ icon, title, subtitle, onClick, gradient }) => (
    <button 
      onClick={onClick}
      className="w-full bg-white rounded-3xl p-6 flex items-center gap-5 hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-pink-100"
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-bold text-xl text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );

  const SelectCompanionPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <Header title={`選擇${systemSettings.staffTitle}`} onBack={() => setCurrentPage('home')} />
      <div className="px-6 py-6">
        <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-3xl p-5 mb-6 border border-pink-200">
          <p className="text-gray-700 text-center">💝 請選擇您希望的{systemSettings.staffTitle}</p>
        </div>
        <div className="space-y-4">
          {systemSettings.companions.map((companion, index) => (
            <button
              key={index}
              onClick={() => {
                setBookingData({...bookingData, companion});
                setCurrentPage('selectService');
              }}
              className="w-full bg-white rounded-3xl p-6 flex items-center gap-5 hover:shadow-2xl transition-all transform hover:scale-[1.02] border border-pink-100"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-rose-300 to-orange-300 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-2xl text-gray-800">{companion}</p>
                <p className="text-gray-500 mt-1">{systemSettings.staffTitle}</p>
              </div>
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const SelectServicePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-32">
      <Header title="選擇服務項目" onBack={() => setCurrentPage('selectCompanion')} />
      <div className="px-6 py-6">
        <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-3xl p-5 mb-6 border border-pink-200">
          <p className="text-gray-700"><span className="font-bold">{systemSettings.staffTitle}：</span>{bookingData.companion}</p>
          <p className="text-sm text-gray-600 mt-1">✨ 可選擇多項服務</p>
        </div>
        <div className="space-y-4">
          {systemSettings.services.map((service, index) => {
            const isSelected = bookingData.services.includes(service);
            return (
              <button
                key={index}
                onClick={() => {
                  const newServices = isSelected
                    ? bookingData.services.filter(s => s !== service)
                    : [...bookingData.services, service];
                  setBookingData({...bookingData, services: newServices});
                }}
                className={`w-full rounded-3xl p-6 flex items-center justify-between transition-all transform hover:scale-[1.02] border-2 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white shadow-2xl border-transparent' 
                    : 'bg-white text-gray-800 border-pink-100 hover:border-pink-300'
                }`}
              >
                <span className="font-bold text-xl">{service}</span>
                {isSelected && (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        {bookingData.services.length > 0 && (
          <button
            onClick={() => setCurrentPage('selectDateTime')}
            className="fixed bottom-8 left-6 right-6 max-w-md mx-auto py-5 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white text-lg rounded-3xl font-bold shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            下一步：選擇時間
          </button>
        )}
      </div>
    </div>
  );

  const SelectDateTimePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pb-32">
      <Header title="選擇日期時間" onBack={() => setCurrentPage('selectService')} />
      <div className="px-6 py-6">
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-pink-100">
          <h3 className="font-bold text-gray-800 mb-4 text-xl">📋 預約資訊</h3>
          <div className="space-y-3 text-base">
            <p><span className="text-gray-500">{systemSettings.staffTitle}：</span><span className="font-bold text-gray-800">{bookingData.companion}</span></p>
            <p><span className="text-gray-500">服務項目：</span><span className="font-bold text-gray-800">{bookingData.services.join('、')}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-5 shadow-lg border border-pink-100">
          <label className="block text-gray-700 font-bold mb-3 text-lg">📅 選擇日期</label>
          <input
            type="date"
            value={bookingData.date}
            onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-5 py-4 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none text-lg"
          />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
          <label className="block text-gray-700 font-bold mb-4 text-lg">⏰ 選擇時段</label>
          <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => setBookingData({...bookingData, time})}
                className={`py-3 rounded-xl font-medium transition-all text-sm ${
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
            className="fixed bottom-8 left-6 right-6 max-w-md mx-auto py-5 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white text-lg rounded-3xl font-bold shadow-2xl disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? '預約中...' : '✓ 確認預約'}
          </button>
        )}
      </div>
    </div>
  );

  const SuccessPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] p-10 text-center shadow-2xl max-w-md w-full border border-pink-100">
        <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">預約成功！</h2>
        <p className="text-gray-600 text-lg mb-2">✨ 我們已收到您的預約</p>
        <p className="text-sm text-gray-500">請等待{systemSettings.staffTitle}確認</p>
      </div>
    </div>
  );

  const Header = ({ title, onBack }) => (
    <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 p-5 flex items-center sticky top-0 z-10 shadow-lg">
      <button onClick={onBack} className="mr-4 bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-all">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-white text-xl font-bold">{title}</h1>
    </div>
  );

  const renderPage = () => {
    if (!isLoggedIn) return <LoginPage />;
    
    switch(currentPage) {
      case 'home': return <HomePage />;
      case 'selectCompanion': return <SelectCompanionPage />;
      case 'selectService': return <SelectServicePage />;
      case 'selectDateTime': return <SelectDateTimePage />;
      case 'success': return <SuccessPage />;
      default: return <HomePage />;
    }
  };

  return (
    <>
      <Head>
        <title>{systemSettings.brandName} - {systemSettings.systemTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#fb7185" />
        <meta name="description" content="溫馨的陪伴養老服務" />
      </Head>
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {renderPage()}
      </div>
    </>
  );
};

export default HomePage;
