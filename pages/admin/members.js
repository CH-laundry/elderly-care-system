// pages/admin/members.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberBookings, setMemberBookings] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState('');

  // 管理者權限檢查
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('adminLoggedIn');
      if (!loggedIn) {
        router.replace('/admin/login');
      }
    }
  }, [router]);

  // 載入所有會員
  useEffect(() => {
    async function fetchMembers() {
      setLoadingMembers(true);
      setError('');
      try {
        const resp = await fetch('/api/admin/members');
        const data = await resp.json();
        if (!resp.ok || !data.success) {
          setError(data.error || '讀取會員資料失敗');
        } else {
          setMembers(data.members || []);
        }
      } catch (err) {
        console.error(err);
        setError('系統錯誤，無法取得會員資料');
      } finally {
        setLoadingMembers(false);
      }
    }
    fetchMembers();
  }, []);

  // 點選會員後載入他的預約紀錄
  async function handleSelectMember(member) {
    setSelectedMember(member);
    setMemberBookings([]);
    if (!member.phone) return;

    setLoadingBookings(true);
    try {
      const resp = await fetch(
        `/api/admin/member-bookings?phone=${encodeURIComponent(member.phone)}`
      );
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setError(data.error || '讀取會員預約紀錄失敗');
      } else {
        setMemberBookings(data.bookings || []);
      }
    } catch (err) {
      console.error(err);
      setError('系統錯誤，無法取得會員預約紀錄');
    } finally {
      setLoadingBookings(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 flex flex-col">
      <header className="w-full bg-white/80 border-b border-pink-100 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="text-pink-700 font-bold text-lg">
            管理者後台｜會員基本資料
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold border border-pink-300 text-pink-700 bg-pink-50 hover:bg-pink-100"
          >
            回管理者首頁
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：會員列表 */}
          <section className="bg-white rounded-3xl shadow-lg border border-pink-100 p-4 md:p-6">
            <h2 className="text-lg font-bold text-pink-900 mb-4">
              會員列表
            </h2>

            {loadingMembers && (
              <p className="text-sm text-pink-600">載入中…</p>
            )}

            {error && (
              <p className="text-sm text-red-500 mb-2">{error}</p>
            )}

            <div className="border border-pink-100 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-4 bg-pink-50 text-pink-800 text-xs md:text-sm font-semibold px-3 py-2">
                <div>姓名</div>
                <div>電話</div>
                <div className="text-right">儲值金</div>
                <div className="text-right">點數</div>
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMember(m)}
                    className={`w-full grid grid-cols-4 items-center px-3 py-2 text-xs md:text-sm border-t border-pink-50 hover:bg-pink-50 text-left ${
                      selectedMember && selectedMember.id === m.id
                        ? 'bg-pink-50'
                        : 'bg-white'
                    }`}
                  >
                    <div className="truncate">{m.name || '—'}</div>
                    <div className="truncate">{m.phone || '—'}</div>
                    <div className="text-right">
                      {m.balance ?? 0}
                    </div>
                    <div className="text-right">
                      {m.points ?? 0}
                    </div>
                  </button>
                ))}

                {members.length === 0 && !loadingMembers && (
                  <div className="px-3 py-4 text-center text-xs text-pink-500">
                    目前尚無會員資料
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 右側：選取會員的詳細資料＋預約紀錄 */}
          <section className="bg-white rounded-3xl shadow-lg border border-pink-100 p-4 md:p-6">
            <h2 className="text-lg font-bold text-pink-900 mb-4">
              會員詳情與預約紀錄
            </h2>

            {!selectedMember && (
              <p className="text-sm text-pink-500">
                請先從左側點選一位會員，即可查看其基本資料與歷史預約紀錄。
              </p>
            )}

            {selectedMember && (
              <div className="space-y-4">
                <div className="bg-pink-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-pink-900">
                      {selectedMember.name || '—'}
                    </div>
                    <div className="text-xs text-pink-500">
                      會員電話：{selectedMember.phone || '—'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-pink-800">
                    <div>
                      <div className="text-xs text-pink-500 mb-1">
                        儲值金
                      </div>
                      <div className="font-semibold">
                        ${selectedMember.balance ?? 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-pink-500 mb-1">
                        點數
                      </div>
                      <div className="font-semibold">
                        {selectedMember.points ?? 0} 點
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-pink-900">
                      歷史預約紀錄
                    </h3>
                    {loadingBookings && (
                      <span className="text-xs text-pink-500">
                        載入中…
                      </span>
                    )}
                  </div>

                  <div className="border border-pink-100 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-4 bg-pink-50 text-pink-800 text-xs font-semibold px-3 py-2">
                      <div>日期</div>
                      <div>時間</div>
                      <div>服務類型</div>
                      <div>備註 / 狀態</div>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {memberBookings.map((b) => (
                        <div
                          key={b.id}
                          className="grid grid-cols-4 text-xs px-3 py-2 border-t border-pink-50"
                        >
                          <div className="truncate">
                            {b.date || '—'}
                          </div>
                          <div className="truncate">
                            {b.time || '—'}
                          </div>
                          <div className="truncate">
                            {b.serviceType || '—'}
                          </div>
                          <div className="truncate">
                            {b.status || b.note || '—'}
                          </div>
                        </div>
                      ))}

                      {memberBookings.length === 0 &&
                        !loadingBookings && (
                          <div className="px-3 py-3 text-center text-xs text-pink-500">
                            尚無預約紀錄
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
