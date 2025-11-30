// pages/member/transactions.js
import MemberLayout from "../../components/MemberLayout";

export default function MemberTransactionsPage() {
  return (
    <MemberLayout>
      <h2 className="text-lg md:text-xl font-semibold text-pink-900 mb-4">
        消費紀錄
      </h2>
      <p className="text-xs md:text-sm text-pink-700 mb-4">
        完成服務並結帳後，系統會自動在這裡產生消費明細。
      </p>

      <div className="mt-6 flex flex-col items-center justify-center py-12">
        <div className="mb-4 text-5xl">💰</div>
        <p className="text-sm text-pink-800">目前還沒有交易紀錄</p>
        <p className="mt-1 text-xs text-pink-600">
          當預約完成並結帳後，就可以在這裡查看每一筆消費。
        </p>
      </div>
    </MemberLayout>
  );
}
