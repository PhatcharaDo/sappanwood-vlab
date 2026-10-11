'use client'

import { FlaskConical, Leaf, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full mx-auto space-y-8 text-center">
        
        {/* ส่วนหัว: ตราโรงเรียนและชื่อโครงงาน */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-primary bg-background shadow-[0_0_10px_rgba(250,204,21,0.4)] overflow-hidden p-2">
            <img
              src="/school-logo.png"
              alt="ตราโรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกัญญา"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-semibold text-primary">
              สื่อการเรียนรู้ห้องปฏิบัติการเสมือน (Virtual Lab) - โรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกันยา
            </p>
            <h1 className="text-xl sm:text-3xl font-bold text-white leading-snug">
              ชุดกระดาษทดสอบจำแนกความเข้มข้นของสารด้วยระยะทางการเคลื่อนที่บนกระดาษจากสารสกัดแก่นฝาง
            </h1>
          </div>
        </div>

        {/* กล่องอธิบายชุดสื่อและชุดการทดลอง */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3 text-primary">
              <BookOpen className="size-6" />
              <h2 className="font-bold text-lg text-white">เกี่ยวกับชุดสื่อการเรียนรู้</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              นวัตกรรมสื่อการทดลองเคมีที่นำสารสกัดจากแก่นฝาง (มีสาร brazilin) มาพัฒนาเป็นกระดาษทดสอบสำหรับจำแนกความเข้มข้นของสารละลาย ผ่านหลักการโครมาโทกราฟีและแรงแคปิลลารีอย่างง่าย
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3 text-success">
              <Leaf className="size-6" />
              <h2 className="font-bold text-lg text-white">แนวคิดการทดลอง (Green & Microscale)</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              ออกแบบตามหลักเคมีสีเขียว (Green Chemistry) และเคมีแบบย่อส่วน (Microscale Chemistry) เพื่อความปลอดภัยสูงสุด ลดการใช้สารเคมี และเป็นมิตรต่อสิ่งแวดล้อม
            </p>
          </div>
        </div>

        {/* ปุ่มกดเข้าห้องปฏิบัติการ */}
        <div className="pt-4">
          <Link
            href="/lab"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-slate-950 font-bold text-base sm:text-lg shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <FlaskConical className="size-6" />
            เข้าสู่ห้องปฏิบัติการเสมือน (Virtual Lab)
            <ArrowRight className="size-5" />
          </Link>
        </div>

      </div>
    </main>
  )
}
