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
    systemTitle: '會員服務系統',
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

  const handleLogin = async () => {
    if (!loginPhone || loginPhone.length !== 10) {
      setLoginError('請輸入正確的手機號碼');
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
        setLoginError(data.error || '查無此會員');
      }
    } catch (error) {
      setLoginError('連線錯誤: ' + error.message);
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
      alert('預約失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{systemSettings.brandName}</h1>
          <p className="text-gray-600">{systemSettings.systemTitle}</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            請輸入手機號碼
          </label>
          <input
            type="tel"
            value={loginPhone}
            onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="0912345678"
            maxLength="10"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none text-lg"
          />
        </div>

        {loginError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
            {loginError}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading || loginPhone.length !== 10}
          className="w-full py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isLoading ? '登入中...' : '登入'}
        </button>

        <div className="mt-6 text-center text-xs text-gray-500">
          首次使用請聯繫櫃台註冊會員
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 pb-20">
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold">{currentUser?.name}</h1>
            <p className="text-white/90 text-sm mt-1">{systemSettings.brandName}</p>
          </div>
          <button onClick={handleLogout} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm">服務點數</span>
            <span className="text-white text-3xl font-bold">{currentUser?.points}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">儲值金</span>
            <span className="text-white text-xl font-bold">NT$ {currentUser?.balance}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">服務項目</h2>
        <div className="space-y-3">
          <button 
            onClick={() => setCurrentPage('selectCompanion')}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-shadow"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-pink-300 to-rose-300 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-800">預約服務</h3>
              <p className="text-sm text-gray-500">選擇陪伴員和服務時間</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const SelectCompanionPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-4 flex items-center">
        <button onClick={() => setCurrentPage('home')} className="mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold">選擇{systemSettings.staffTitle}</h1>
      </div>
      <div className="p-6">
        <div className="bg-pink-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-600">請選擇您希望的{systemSettings.staffTitle}</p>
        </div>
        <div className="space-y-3">
          {systemSettings.companions.map((companion, index) => (
            <button
              key={index}
              onClick={() => {
                setBookingData({...bookingData, companion});
                setCurrentPage('selectService');
              }}
              className="w-full bg-white rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg text-gray-800">{companion}</p>
                  <p className="text-sm text-gray-500">{systemSettings.staffTitle}</p>
                </div>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const SelectServicePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 pb-24">
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-4 flex items-center">
        <button onClick={() => setCurrentPage('selectCompanion')} className="mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold">選擇服務項目</h1>
      </div>
      <div className="p-6">
        <div className="bg-pink-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-600">已選擇：{bookingData.companion}</p>
        </div>
        <div className="space-y-3">
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
                className={`w-full rounded-2xl p-5 flex items-center justify-between transition-all ${
                  isSelected ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg' : 'bg-white text-gray-800'
                }`}
              >
                <span className="font-medium text-lg">{service}</span>
                {isSelected && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        {bookingData.services.length > 0 && (
          <button
            onClick={() => setCurrentPage('selectDateTime')}
            className="fixed bottom-6 left-6 right-6 max-w-md mx-auto py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-2xl font-bold shadow-2xl"
          >
            下一步：選擇時間
          </button>
        )}
      </div>
    </div>
  );

  const SelectDateTimePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 pb-24">
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-4 flex items-center">
        <button onClick={() => setCurrentPage('selectService')} className="mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold">選擇日期時間</h1>
      </div>
      <div className="p-6">
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4">預約資訊</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">{systemSettings.staffTitle}：</span>{bookingData.companion}</p>
            <p><span className="text-gray-500">服務項目：</span>{bookingData.services.join(', ')}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-4 shadow-md">
          <label className="block text-gray-700 font-medium mb-2">選擇日期</label>
          <input
            type="date"
            value={bookingData.date}
            onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <label className="block text-gray-700 font-medium mb-2">選擇時段</label>
          <div className="grid grid-cols-3 gap-3">
            {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
              <button
                key={time}
                onClick={() => setBookingData({...bookingData, time})}
                className={`py-3 rounded-xl font-medium transition-all ${
                  bookingData.time === time
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            className="fixed bottom-6 left-6 right-6 max-w-md mx-auto py-4 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-2xl font-bold shadow-2xl disabled:opacity-50"
          >
            {isLoading ? '預約中...' : '確認預約'}
          </button>
        )}
      </div>
    </div>
  );

  const SuccessPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">預約成功！</h2>
        <p className="text-gray-600">我們已收到您的預約</p>
      </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#f472b6" />
      </Head>
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {renderPage()}
      </div>
    </>
  );
};

export default HomePage;
