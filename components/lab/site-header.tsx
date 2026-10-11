'use client'

import { useState } from 'react'
import { FlaskConical, Leaf, X, CheckCircle2 } from 'lucide-react'

export function SiteHeader() {
  const [activeModal, setActiveModal] = useState<'green' | 'micro' | null>(null)

  return (
    <>
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              role="img"
              aria-label="ตราสัญลักษณ์โรงเรียน"
              className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background shadow-[0_0_4px_rgba(250,204,21,0.3)] overflow-hidden p-1 md:size-14"
            >
              <img
                src="/school.logo.png"
                alt="ตราโรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกัญญา"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-snug text-primary md:text-base">
                สื่อการเรียนรู้ห้องปฏิบัติการเสมือน (Virtual Lab) - โรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกันยา
              </p>
              <h1 className="text-xs leading-snug text-foreground md:text-base">
                ชุดกระดาษทดสอบจำแนกความเข้มข้นของสารด้วยระยะทางการเคลื่อนที่บนกระดาษจากสารสกัดแก่นฝาง
              </h1>
            </div>
          </div>

          <ul className="flex shrink-0 flex-wrap gap-2" aria-label="แนวคิดหลัก">
            <li>
              <button
                onClick={() => setActiveModal('green')}
                className="group flex flex-col items-center justify-center rounded-full border border-success/40 bg-success/10 px-3 py-1 text-[11px] font-medium text-success transition-all hover:bg-success/20 md:text-xs"
              >
                <span className="inline-flex items-center gap-1">
                  <Leaf className="size-3" aria-hidden="true" />
                  Green Chemistry
                </span>
                <span className="text-[9px] text-success/80 underline underline-offset-2 font-normal">
                  (คลิกอ่าน)
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveModal('micro')}
                className="group flex flex-col items-center justify-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary transition-all hover:bg-primary/20 md:text-xs"
              >
                <span className="inline-flex items-center gap-1">
                  <FlaskConical className="size-3" aria-hidden="true" />
                  Microscale Chemistry
                </span>
                <span className="text-[9px] text-primary/80 underline underline-offset-2 font-normal">
                  (คลิกอ่าน)
                </span>
              </button>
            </li>
          </ul>
        </div>
      </header>

      {/* Modal: Green Chemistry (12 Principles) */}
      {activeModal === 'green' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-success/40 bg-slate-950 shadow-2xl text-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-3 text-success">
                <div className="p-2.5 rounded-xl bg-success/10 border border-success/30 shrink-0">
                  <Leaf className="size-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-white">Green Chemistry (เคมีสีเขียว)</h3>
                  <p className="text-xs sm:text-sm text-success/90 font-medium">หลักการ 12 ประการของเคมีสีเขียว</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X className="size-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm text-slate-200 leading-relaxed">
              <p className="text-sm sm:text-base font-medium text-slate-100 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-success">เคมีสีเขียว (Green Chemistry)</strong> คือแนวทางการออกแบบผลิตภัณฑ์และกระบวนการทางเคมีเพื่อลดหรือกำจัดสารอันตราย
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Microscale Chemistry */}
      {activeModal === 'micro' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-primary/40 bg-slate-950 shadow-2xl text-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-3 text-primary">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 shrink-0">
                  <FlaskConical className="size-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-white">Microscale Chemistry (เคมีแบบย่อส่วน)</h3>
                  <p className="text-xs sm:text-sm text-primary/90 font-medium">หลักการ แนวคิด และประโยชน์</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X className="size-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm text-slate-200 leading-relaxed">
              <p className="text-sm sm:text-base font-normal text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-primary font-semibold">เคมีแบบย่อส่วน (Microscale Chemistry)</strong> คือแนวคิดในการทำปฏิบัติการทางเคมีโดยลดขนาดปริมาณสารเคมีลงให้เหลือน้อยที่สุด
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
